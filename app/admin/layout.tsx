import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { PWARegister } from "@/components/admin/pwa-register"
import { getSession } from "@/lib/session"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Sessao ja foi verificada pelo proxy.ts
  // Aqui so pegamos os dados para exibir no header
  const session = await getSession()

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
