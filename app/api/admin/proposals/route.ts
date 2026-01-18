import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const proposals = await sql`
      SELECT * FROM proposals
      ORDER BY created_at DESC
    `
    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Erro ao buscar propostas:", error)
    return NextResponse.json({ error: "Erro ao buscar propostas" }, { status: 500 })
  }
}
