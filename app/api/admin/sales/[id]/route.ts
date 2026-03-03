import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const [sale] = await sql`
      SELECT s.*,
        v.name as vehicle_name, v.year as vehicle_year, v.slug as vehicle_slug,
        u.name as seller_name, u.email as seller_email
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN sellers sl ON s.seller_id = sl.id
      LEFT JOIN users u ON sl.user_id = u.id
      WHERE s.id = ${id}
    `

    if (!sale) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    return NextResponse.json(sale)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar venda" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await request.json()
    const {
      status,
      final_price,
      payment_method,
      installments,
      down_payment,
      commission_value,
      commission_paid,
      notes,
      customer_name,
      customer_email,
      customer_phone,
    } = body

    const [sale] = await sql`
      UPDATE sales SET
        status = COALESCE(${status ?? null}, status),
        final_price = COALESCE(${final_price ?? null}, final_price),
        payment_method = COALESCE(${payment_method ?? null}, payment_method),
        installments = COALESCE(${installments ?? null}, installments),
        down_payment = COALESCE(${down_payment ?? null}, down_payment),
        commission_value = COALESCE(${commission_value ?? null}, commission_value),
        commission_paid = COALESCE(${commission_paid ?? null}, commission_paid),
        notes = COALESCE(${notes ?? null}, notes),
        customer_name = COALESCE(${customer_name ?? null}, customer_name),
        customer_email = COALESCE(${customer_email ?? null}, customer_email),
        customer_phone = COALESCE(${customer_phone ?? null}, customer_phone),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!sale) {
      return NextResponse.json({ error: "Venda não encontrada" }, { status: 404 })
    }

    // Atualiza status do veículo se venda concluída/cancelada
    if (sale.vehicle_id && status) {
      if (status === 'completed' || status === 'approved') {
        await sql`UPDATE vehicles SET status = 'sold' WHERE id = ${sale.vehicle_id}`
      } else if (status === 'cancelled') {
        await sql`UPDATE vehicles SET status = 'available' WHERE id = ${sale.vehicle_id}`
      }
    }

    return NextResponse.json({ success: true, sale })
  } catch (error) {
    console.error("Erro ao atualizar venda:", error)
    return NextResponse.json({ error: "Erro ao atualizar venda" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const [sale] = await sql`DELETE FROM sales WHERE id = ${id} RETURNING vehicle_id, status`

    if (sale?.vehicle_id && (sale.status === 'completed' || sale.status === 'approved')) {
      await sql`UPDATE vehicles SET status = 'available' WHERE id = ${sale.vehicle_id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir venda" }, { status: 500 })
  }
}
