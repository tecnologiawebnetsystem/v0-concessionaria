import { sql } from "@/lib/db"
import AdminSellersClient from "./sellers-client"

export const dynamic = "force-dynamic"

export default async function AdminSellersPage() {
  const sellers = await sql`
    SELECT
      s.id,
      s.commission_rate,
      s.base_salary,
      s.hire_date,
      s.is_active,
      s.cpf,
      u.name,
      u.email,
      u.phone,
      COUNT(sa.id) FILTER (WHERE DATE_TRUNC('month', sa.sale_date) = DATE_TRUNC('month', NOW())) AS current_month_sales,
      COALESCE(SUM(sa.sale_price) FILTER (WHERE DATE_TRUNC('month', sa.sale_date) = DATE_TRUNC('month', NOW())), 0) AS current_month_value,
      COUNT(sa.id) AS total_sales,
      COALESCE(SUM(sa.sale_price), 0) AS total_value
    FROM sellers s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN sales sa ON sa.seller_id = s.id
    GROUP BY s.id, u.name, u.email, u.phone
    ORDER BY s.is_active DESC, u.name
  `

  return <AdminSellersClient sellers={sellers} />
}
