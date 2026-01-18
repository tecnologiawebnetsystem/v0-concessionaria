import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const evaluations = await sql`
      SELECT * FROM vehicle_evaluations
      ORDER BY created_at DESC
    `
    return NextResponse.json(evaluations)
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error)
    return NextResponse.json({ error: "Erro ao buscar avaliações" }, { status: 500 })
  }
}
