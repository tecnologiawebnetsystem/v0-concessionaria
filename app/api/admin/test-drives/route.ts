import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const testDrives = await sql`
      SELECT * FROM test_drives
      ORDER BY created_at DESC
    `
    return NextResponse.json(testDrives)
  } catch (error) {
    console.error("Erro ao buscar test drives:", error)
    return NextResponse.json({ error: "Erro ao buscar test drives" }, { status: 500 })
  }
}
