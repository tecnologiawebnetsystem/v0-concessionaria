import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const result = await sql`
      INSERT INTO vehicle_evaluations (
        brand, model, year, version, mileage, color, fuel_type,
        transmission, condition, customer_name, customer_email,
        customer_phone, city, message, status
      ) VALUES (
        ${data.brand},
        ${data.model},
        ${data.year},
        ${data.version || null},
        ${data.mileage},
        ${data.color || null},
        ${data.fuel},
        ${data.transmission},
        ${data.condition},
        ${data.name},
        ${data.email},
        ${data.phone},
        ${data.city || null},
        ${data.message || null},
        'pending'
      )
      RETURNING id
    `

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error creating evaluation:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao solicitar avaliação" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const evaluations = await sql`
      SELECT * FROM vehicle_evaluations
      ORDER BY created_at DESC
    `
    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Error fetching evaluations:", error)
    return NextResponse.json(
      { success: false, error: "Erro ao buscar avaliações" },
      { status: 500 }
    )
  }
}
