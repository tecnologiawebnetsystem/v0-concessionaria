import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const [seller] = await sql`SELECT id FROM sellers WHERE user_id = ${session.userId}`
    if (!seller) return NextResponse.json({ error: "Seller not found" }, { status: 404 })

    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    // Meta do mes atual
    const [currentGoal] = await sql`
      SELECT * FROM sales_goals
      WHERE seller_id = ${seller.id} AND month = ${currentMonth} AND year = ${currentYear}
    `

    // Vendas do mes atual
    const [currentSales] = await sql`
      SELECT 
        COUNT(*) as count,
        COALESCE(SUM(final_price), 0) as value
      FROM sales
      WHERE seller_id = ${seller.id}
        AND EXTRACT(MONTH FROM sale_date) = ${currentMonth}
        AND EXTRACT(YEAR FROM sale_date) = ${currentYear}
        AND status IN ('approved','completed')
    `

    // Historico de metas dos ultimos 12 meses com vendas reais
    const history = await sql`
      SELECT 
        sg.year, sg.month, sg.goal_quantity, sg.goal_value, sg.bonus_percentage, sg.bonus_paid,
        COALESCE(s.actual_sales, 0) as actual_sales,
        COALESCE(s.actual_value, 0) as actual_value
      FROM sales_goals sg
      LEFT JOIN (
        SELECT 
          seller_id,
          EXTRACT(YEAR FROM sale_date)::int as year,
          EXTRACT(MONTH FROM sale_date)::int as month,
          COUNT(*) as actual_sales,
          SUM(final_price) as actual_value
        FROM sales
        WHERE seller_id = ${seller.id} AND status IN ('approved','completed')
        GROUP BY 1, 2, 3
      ) s ON s.seller_id = sg.seller_id AND s.year = sg.year AND s.month = sg.month
      WHERE sg.seller_id = ${seller.id}
        AND (sg.year < ${currentYear} OR (sg.year = ${currentYear} AND sg.month < ${currentMonth}))
      ORDER BY sg.year DESC, sg.month DESC
      LIMIT 12
    `

    // Stats gerais: quantas metas foram atingidas
    const [statsRow] = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (
          WHERE EXISTS (
            SELECT 1 FROM sales sa
            WHERE sa.seller_id = sg.seller_id
              AND EXTRACT(YEAR FROM sa.sale_date) = sg.year
              AND EXTRACT(MONTH FROM sa.sale_date) = sg.month
              AND sa.status IN ('approved','completed')
            HAVING COUNT(*) >= sg.goal_quantity
          )
        ) as achieved
      FROM sales_goals sg
      WHERE seller_id = ${seller.id}
        AND (year < ${currentYear} OR (year = ${currentYear} AND month < ${currentMonth}))
    `

    return NextResponse.json({ currentGoal, currentSales, history, stats: statsRow })
  } catch (error) {
    console.error("[seller/goals] Error:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}
