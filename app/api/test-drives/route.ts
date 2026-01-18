import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const result = await sql`
      INSERT INTO test_drives (
        vehicle_id, customer_name, customer_email, customer_phone,
        preferred_date, preferred_time, message, status
      ) VALUES (
        ${data.vehicleId || null},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${data.date},
        ${data.time},
        ${data.message || null},
        'pending'
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating test drive:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao agendar test drive" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const testDrives = await sql`
      SELECT td.*, v.name as vehicle_name, v.brand_name
      FROM test_drives td
      LEFT JOIN (
        SELECT v.id, v.name, b.name as brand_name
        FROM vehicles v
        LEFT JOIN brands b ON v.brand_id = b.id
      ) v ON td.vehicle_id = v.id
      ORDER BY td.created_at DESC
    `
    return NextResponse.json(testDrives)
  } catch (error) {
    console.error("Error fetching test drives:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar agendamentos" },
      { status: 500 }
    )
  }
}
