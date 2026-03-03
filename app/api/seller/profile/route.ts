import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const [row] = await sql`
      SELECT 
        u.id as user_id, u.name, u.email, u.phone,
        s.id as seller_id, s.cpf, s.rg, s.birth_date, s.hire_date,
        s.address, s.city, s.state, s.zip_code,
        s.emergency_contact, s.emergency_phone,
        s.bank_name, s.bank_agency, s.bank_account, s.pix_key,
        s.commission_rate, s.base_salary, s.is_active
      FROM users u
      JOIN sellers s ON s.user_id = u.id
      WHERE u.id = ${session.userId}
    `
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Stats gerais
    const [stats] = await sql`
      SELECT 
        COUNT(*) as total_sales,
        COALESCE(SUM(final_price), 0) as total_value,
        COALESCE(SUM(commission_value), 0) as total_commission
      FROM sales WHERE seller_id = ${row.seller_id} AND status NOT IN ('cancelled')
    `

    const [goalsStats] = await sql`
      SELECT COUNT(*) as total FROM sales_goals WHERE seller_id = ${row.seller_id}
    `

    return NextResponse.json({ profile: row, stats, goalsTotal: Number(goalsStats.total) })
  } catch (error) {
    console.error("[seller/profile] GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const { name, phone, address, city, state, zip_code, emergency_contact, emergency_phone, bank_name, bank_agency, bank_account, pix_key } = body

    if (name) {
      await sql`UPDATE users SET name = ${name}, updated_at = NOW() WHERE id = ${session.userId}`
    }
    if (phone !== undefined) {
      await sql`UPDATE users SET phone = ${phone}, updated_at = NOW() WHERE id = ${session.userId}`
    }

    await sql`
      UPDATE sellers SET
        address = ${address ?? null},
        city = ${city ?? null},
        state = ${state ?? null},
        zip_code = ${zip_code ?? null},
        emergency_contact = ${emergency_contact ?? null},
        emergency_phone = ${emergency_phone ?? null},
        bank_name = ${bank_name ?? null},
        bank_agency = ${bank_agency ?? null},
        bank_account = ${bank_account ?? null},
        pix_key = ${pix_key ?? null},
        updated_at = NOW()
      WHERE user_id = ${session.userId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[seller/profile] PATCH Error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
