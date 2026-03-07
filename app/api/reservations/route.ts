import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { verifySession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleId,
      amount,
      paymentMethod,
      customerName,
      customerEmail,
      customerPhone,
      customerCpf,
    } = body

    // Validacoes
    if (!vehicleId || !amount || !paymentMethod || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      )
    }

    // Verificar se veiculo esta disponivel
    const [vehicle] = await sql`
      SELECT id, name, status FROM vehicles WHERE id = ${vehicleId}
    `

    if (!vehicle) {
      return NextResponse.json(
        { error: "Veiculo nao encontrado" },
        { status: 404 }
      )
    }

    if (vehicle.status !== "available") {
      return NextResponse.json(
        { error: "Veiculo nao esta disponivel para reserva" },
        { status: 400 }
      )
    }

    // Verificar se ja existe reserva ativa para este veiculo
    const [existingReservation] = await sql`
      SELECT id FROM vehicle_reservations 
      WHERE vehicle_id = ${vehicleId} 
      AND status IN ('pending', 'confirmed', 'payment_received')
      AND expires_at > NOW()
    `

    if (existingReservation) {
      return NextResponse.json(
        { error: "Este veiculo ja possui uma reserva ativa" },
        { status: 400 }
      )
    }

    // Obter ou criar usuario
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    let userId: string | null = null

    if (sessionToken) {
      const session = await verifySession(sessionToken)
      if (session) {
        userId = session.userId
      }
    }

    // Se nao estiver logado, verificar se existe usuario com este email
    if (!userId) {
      const [existingUser] = await sql`
        SELECT id FROM users WHERE email = ${customerEmail}
      `
      
      if (existingUser) {
        userId = existingUser.id
      } else {
        // Criar usuario guest
        const [newUser] = await sql`
          INSERT INTO users (name, email, phone, role)
          VALUES (${customerName}, ${customerEmail}, ${customerPhone}, 'customer')
          RETURNING id
        `
        userId = newUser.id
      }
    }

    // Criar reserva
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48) // 48 horas de validade

    const [reservation] = await sql`
      INSERT INTO vehicle_reservations (
        vehicle_id, user_id, reservation_amount, payment_method, 
        status, payment_status, expires_at, notes
      )
      VALUES (
        ${vehicleId}, ${userId}, ${amount}, ${paymentMethod},
        'pending', 'pending', ${expiresAt.toISOString()},
        ${JSON.stringify({ customerName, customerEmail, customerPhone, customerCpf })}
      )
      RETURNING id
    `

    // Atualizar status do veiculo para reservado
    await sql`
      UPDATE vehicles SET status = 'reserved' WHERE id = ${vehicleId}
    `

    // Gerar dados do PIX (simulado - em producao, integrar com gateway)
    let pixData = null
    if (paymentMethod === "pix") {
      pixData = {
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX_${reservation.id}`,
        copyPaste: `00020126580014br.gov.bcb.pix0136${reservation.id}520400005303986540${amount.toFixed(2)}5802BR`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
      }
    }

    // Enviar email de confirmacao (simulado)
    // await sendReservationEmail(customerEmail, reservation.id, vehicle.name, amount)

    return NextResponse.json({
      success: true,
      reservationId: reservation.id,
      expiresAt: expiresAt.toISOString(),
      pixQrCode: pixData?.qrCode,
      pixCopyPaste: pixData?.copyPaste,
      message: "Reserva criada com sucesso",
    })
  } catch (error) {
    console.error("Reservation error:", error)
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Nao autenticado" }, { status: 401 })
    }

    const session = await verifySession(sessionToken)
    if (!session) {
      return NextResponse.json({ error: "Sessao invalida" }, { status: 401 })
    }

    const reservations = await sql`
      SELECT 
        r.*,
        v.name as vehicle_name,
        v.slug as vehicle_slug,
        b.name as brand_name,
        (SELECT url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC LIMIT 1) as vehicle_image
      FROM vehicle_reservations r
      JOIN vehicles v ON v.id = r.vehicle_id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE r.user_id = ${session.userId}
      ORDER BY r.created_at DESC
    `

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("Get reservations error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar reservas" },
      { status: 500 }
    )
  }
}
