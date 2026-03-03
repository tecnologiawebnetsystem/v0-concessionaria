import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAdmin } from "@/lib/session"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const { status, notes } = await request.json()

    const [inquiry] = await sql`
      UPDATE inquiries SET
        status = COALESCE(${status ?? null}, status),
        notes = COALESCE(${notes ?? null}, notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!inquiry) {
      return NextResponse.json({ error: "Contato não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar contato" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await sql`DELETE FROM inquiries WHERE id = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir contato" }, { status: 500 })
  }
}
