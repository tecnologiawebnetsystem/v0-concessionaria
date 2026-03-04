import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PWARegister } from "@/components/admin/pwa-register"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  console.log("[v0] admin/layout - session:", session ? `role=${session.role} user=${session.email}` : "NULL")

  if (!session) {
    console.log("[v0] admin/layout - sem sessão, redirecionando para login")
    redirect("/login?redirect=/admin")
  }

  if (session.role !== "admin" && session.role !== "super_admin") {
    console.log("[v0] admin/layout - role inválida:", session.role)
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <PWARegister />
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader session={session} />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
