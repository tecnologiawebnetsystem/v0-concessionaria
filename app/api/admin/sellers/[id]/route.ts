import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session?.userId || session.role !== "admin") {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    if (typeof body.is_active === "boolean") {
      await sql`UPDATE sellers SET is_active = ${body.is_active}, updated_at = NOW() WHERE id = ${id}`
      await sql`
        UPDATE users SET is_active = ${body.is_active}
        WHERE id = (SELECT user_id FROM sellers WHERE id = ${id})
      `
    }

    if (body.commission_rate !== undefined) {
      await sql`UPDATE sellers SET commission_rate = ${body.commission_rate}, updated_at = NOW() WHERE id = ${id}`
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao atualizar vendedor:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
