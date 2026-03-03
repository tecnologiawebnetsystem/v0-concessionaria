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
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear

    const sales = await sql`
      SELECT 
        s.id, s.sale_date, s.final_price, s.commission_value, s.commission_rate,
        s.payment_method, s.has_trade_in, s.status, s.customer_name, s.customer_phone,
        v.name as vehicle_name, v.year as vehicle_year, b.name as brand_name
      FROM sales s
      LEFT JOIN vehicles v ON s.vehicle_id = v.id
      LEFT JOIN brands b ON v.brand_id = b.id
      WHERE s.seller_id = ${seller.id}
      ORDER BY s.sale_date DESC
    `

    const [monthStats] = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(final_price), 0) as total_value,
        COALESCE(SUM(commission_value), 0) as total_commission,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_sales,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_sales
      FROM sales 
      WHERE seller_id = ${seller.id}
      AND EXTRACT(MONTH FROM sale_date) = ${currentMonth}
      AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
    `

    const [lastMonthStats] = await sql`
      SELECT COUNT(*) as total_sales
      FROM sales 
      WHERE seller_id = ${seller.id}
      AND EXTRACT(MONTH FROM sale_date) = ${lastMonth}
      AND EXTRACT(YEAR FROM sale_date) = ${lastMonthYear}
      AND status IN ('approved','completed')
    `

    const [allTimeStats] = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(final_price), 0) as total_value,
        COALESCE(SUM(commission_value), 0) as total_commission,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_sales
      FROM sales WHERE seller_id = ${seller.id}
    `

    return NextResponse.json({ sales, monthStats, lastMonthStats, allTimeStats, seller })
  } catch (error) {
    console.error("[seller/sales] Error:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}
