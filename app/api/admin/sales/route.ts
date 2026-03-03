import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function GET() {
  try {
    await requireAdmin()
    const sales = await sql`
      SELECT s.*,
        v.name as vehicle_name, v.year as vehicle_year,
        u.name as seller_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN sellers sl ON s.seller_id = sl.id
      LEFT JOIN users u ON sl.user_id = u.id
      ORDER BY s.sale_date DESC
    `
    return NextResponse.json(sales)
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar vendas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    const body = await request.json()
    const {
      vehicle_id,
      seller_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_cpf,
      sale_date,
      final_price,
      original_price,
      discount,
      payment_method,
      installments,
      down_payment,
      commission_rate,
      commission_value,
      notes,
      status,
    } = body

    if (!customer_name || !final_price) {
      return NextResponse.json({ error: "Nome do cliente e valor são obrigatórios" }, { status: 400 })
    }

    const [sale] = await sql`
      INSERT INTO sales (
        vehicle_id, seller_id, customer_name, customer_email, customer_phone,
        customer_cpf, sale_date, final_price, original_price, discount,
        payment_method, installments, down_payment, commission_rate,
        commission_value, notes, status
      ) VALUES (
        ${vehicle_id || null}, ${seller_id || null},
        ${customer_name}, ${customer_email || null}, ${customer_phone || null},
        ${customer_cpf || null}, ${sale_date || new Date().toISOString()},
        ${final_price}, ${original_price || final_price}, ${discount || 0},
        ${payment_method || null}, ${installments || null}, ${down_payment || null},
        ${commission_rate || 2.5}, ${commission_value || (final_price * 0.025)},
        ${notes || null}, ${status || 'pending'}
      )
      RETURNING *
    `

    // Marcar veículo como vendido se status for completed/approved
    if (vehicle_id && (status === 'completed' || status === 'approved')) {
      await sql`UPDATE vehicles SET status = 'sold' WHERE id = ${vehicle_id}`
    }

    return NextResponse.json({ success: true, sale })
  } catch (error) {
    console.error("Erro ao criar venda:", error)
    return NextResponse.json({ error: "Erro ao criar venda" }, { status: 500 })
  }
}
