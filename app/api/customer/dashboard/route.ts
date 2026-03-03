import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const userResult = await sql`SELECT email, name FROM users WHERE id = ${session.userId} LIMIT 1`
    const user = userResult[0]
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

    const [proposals, testDrives, favorites, alerts, recentProposals, recentTestDrives] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM proposals WHERE email = ${user.email}`,
      sql`SELECT COUNT(*) as count FROM test_drives WHERE customer_email = ${user.email}`,
      sql`SELECT COUNT(*) as count FROM favorites WHERE user_id = ${session.userId}`,
      sql`SELECT COUNT(*) as count FROM vehicle_alerts WHERE customer_email = ${user.email} AND is_active = true`,
      sql`
        SELECT id, vehicle_name, vehicle_price, proposed_price, status, created_at
        FROM proposals WHERE email = ${user.email}
        ORDER BY created_at DESC LIMIT 3
      `,
      sql`
        SELECT td.id, td.preferred_date, td.preferred_time, td.status, td.message,
               v.name as vehicle_name
        FROM test_drives td
        LEFT JOIN vehicles v ON td.vehicle_id = v.id
        WHERE td.customer_email = ${user.email}
        ORDER BY td.created_at DESC LIMIT 3
      `,
    ])

    return NextResponse.json({
      user: { name: user.name, email: user.email },
      stats: {
        proposals: Number(proposals[0]?.count ?? 0),
        testDrives: Number(testDrives[0]?.count ?? 0),
        favorites: Number(favorites[0]?.count ?? 0),
        alerts: Number(alerts[0]?.count ?? 0),
      },
      recentProposals,
      recentTestDrives,
    })
  } catch (error) {
    console.error("Erro no dashboard do cliente:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
