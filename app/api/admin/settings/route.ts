import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  
  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const settings = await sql`
      SELECT key, value, category, type 
      FROM site_settings 
      WHERE category = 'integrations'
    `
    
    // Mascarar valores secretos
    const maskedSettings = settings.map(s => ({
      ...s,
      value: s.type === "secret" && s.value 
        ? `${s.value.substring(0, 8)}${"*".repeat(20)}` 
        : s.value
    }))

    return NextResponse.json(maskedSettings)
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session || (session.role !== "admin" && session.role !== "super_admin")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const { key, value, category, type } = await request.json()

    if (!key || !category) {
      return NextResponse.json({ error: "Key e category são obrigatórios" }, { status: 400 })
    }

    // Upsert - inserir ou atualizar
    await sql`
      INSERT INTO site_settings (key, value, category, type, updated_at)
      VALUES (${key}, ${value}, ${category}, ${type || 'text'}, NOW())
      ON CONFLICT (key) 
      DO UPDATE SET 
        value = EXCLUDED.value,
        category = EXCLUDED.category,
        type = EXCLUDED.type,
        updated_at = NOW()
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar configuração:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}
