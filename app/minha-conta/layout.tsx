import React from "react"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

async function getUser(userId: string) {
  try {
    const result = await sql`
      SELECT id, name, email, phone, role
      FROM users
      WHERE id = ${userId}
    `
    return result[0] || null
  } catch {
    return null
  }
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login?redirect=/minha-conta")
  }

  const user = await getUser(session.userId)

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CustomerHeader user={user} />
      <CustomerSidebar />
      <main className="lg:pl-64 pt-16">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
