import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

async function getSellerId(userId: string) {
  const [s] = await sql`SELECT id FROM sellers WHERE user_id = ${userId}`
  return s?.id ?? null
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sellerId = await getSellerId(session.userId)
    if (!sellerId) return NextResponse.json({ error: "Seller not found" }, { status: 404 })

    const docs = await sql`
      SELECT 
        sd.id, sd.type, sd.name, sd.file_url, sd.expiry_date,
        sd.is_verified, sd.verified_at, sd.notes, sd.created_at,
        u.name as verified_by_name
      FROM seller_documents sd
      LEFT JOIN users u ON u.id = sd.verified_by
      WHERE sd.seller_id = ${sellerId}
      ORDER BY sd.created_at DESC
    `

    return NextResponse.json({ documents: docs })
  } catch (error) {
    console.error("[seller/documents] GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sellerId = await getSellerId(session.userId)
    if (!sellerId) return NextResponse.json({ error: "Seller not found" }, { status: 404 })

    const { type, name, file_url, expiry_date } = await req.json()
    if (!type || !name) return NextResponse.json({ error: "type and name are required" }, { status: 400 })

    const [doc] = await sql`
      INSERT INTO seller_documents (seller_id, type, name, file_url, expiry_date)
      VALUES (${sellerId}, ${type}, ${name}, ${file_url ?? null}, ${expiry_date ?? null})
      RETURNING *
    `
    return NextResponse.json({ document: doc }, { status: 201 })
  } catch (error) {
    console.error("[seller/documents] POST Error:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const sellerId = await getSellerId(session.userId)
    if (!sellerId) return NextResponse.json({ error: "Seller not found" }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 })

    await sql`DELETE FROM seller_documents WHERE id = ${id} AND seller_id = ${sellerId}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[seller/documents] DELETE Error:", error)
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}
