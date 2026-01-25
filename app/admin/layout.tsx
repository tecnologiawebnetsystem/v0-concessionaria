import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect("/login?redirect=/admin")
  }

  if (session.role !== "admin" && session.role !== "super_admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
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
