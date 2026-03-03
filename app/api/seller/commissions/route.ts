import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const [seller] = await sql`SELECT id, commission_rate FROM sellers WHERE user_id = ${session.userId}`
    if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 })

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    // Comissoes pendentes (nao pagas) de vendas aprovadas/concluidas
    const pending = await sql`
      SELECT 
        s.id, s.sale_date, s.final_price, s.commission_value, s.commission_rate,
        v.name as vehicle_name, b.name as brand_name, s.customer_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE s.seller_id = ${seller.id}
        AND s.commission_paid = false
        AND s.status IN ('approved','completed')
      ORDER BY s.sale_date DESC
    `

    // Comissoes pagas
    const paid = await sql`
      SELECT 
        s.id, s.sale_date, s.commission_paid_at, s.final_price, s.commission_value, s.commission_rate,
        v.name as vehicle_name, b.name as brand_name, s.customer_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE s.seller_id = ${seller.id}
        AND s.commission_paid = true
      ORDER BY s.commission_paid_at DESC
    `

    // Totais gerais
    const [totals] = await sql`
      SELECT 
        COALESCE(SUM(commission_value), 0) as total_earned,
        COALESCE(SUM(commission_value) FILTER (WHERE commission_paid = true), 0) as total_paid,
        COALESCE(SUM(commission_value) FILTER (WHERE commission_paid = false AND status IN ('approved','completed')), 0) as total_pending
      FROM sales WHERE seller_id = ${seller.id} AND status NOT IN ('cancelled')
    `

    // Resumo mensal (ultimos 6 meses)
    const monthly = await sql`
      SELECT 
        EXTRACT(YEAR FROM sale_date)::int as year,
        EXTRACT(MONTH FROM sale_date)::int as month,
        COUNT(*) as sales_count,
        COALESCE(SUM(commission_value), 0) as total_commission,
        COALESCE(SUM(commission_value) FILTER (WHERE commission_paid = true), 0) as paid_commission,
        COALESCE(SUM(commission_value) FILTER (WHERE commission_paid = false), 0) as pending_commission
      FROM sales
      WHERE seller_id = ${seller.id}
        AND status NOT IN ('cancelled')
        AND sale_date >= NOW() - INTERVAL '6 months'
      GROUP BY 1, 2
      ORDER BY 1 DESC, 2 DESC
    `

    return NextResponse.json({ pending, paid, totals, monthly, seller })
  } catch (error) {
    console.error("[seller/commissions] Error:", error)
    return NextResponse.json({ error: "Failed to fetch commissions" }, { status: 500 })
  }
}
