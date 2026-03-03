import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"
import { destroySession } from "@/lib/session"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()
    if (!session?.userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 })

    const { id } = await params

    // Usuário só pode excluir a própria conta (admin pode excluir qualquer um)
    if (session.userId !== id && session.role !== "admin" && session.role !== "super_admin") {
      return NextResponse.json({ error: "Proibido" }, { status: 403 })
    }

    // Soft-delete: marcar como inativo em vez de deletar fisicamente
    await sql`
      UPDATE users SET is_active = false, updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir conta:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
