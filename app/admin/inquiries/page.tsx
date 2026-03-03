import { sql } from "@/lib/db"
import { InquiriesClient } from "./inquiries-client"

async function getInquiries() {
  const inquiries = await sql`
    SELECT i.*, v.name as vehicle_name, v.price as vehicle_price
    FROM inquiries i
    LEFT JOIN vehicles v ON i.vehicle_id = v.id
    ORDER BY i.created_at DESC
  `
  const [stats] = await sql`
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'new') as new_count,
      COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
      COUNT(*) FILTER (WHERE status = 'closed') as closed
    FROM inquiries
  `
  return { inquiries, stats }
}

export default async function InquiriesPage() {
  const { inquiries, stats } = await getInquiries()
  return <InquiriesClient initialInquiries={inquiries} stats={stats} />
}
