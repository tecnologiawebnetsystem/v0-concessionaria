"use client"

import type React from "react"
import { CustomerSidebar } from "@/components/customer/customer-sidebar"
import { CustomerHeader } from "@/components/customer/customer-header"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <CustomerSidebar />
      <div className="lg:pl-72">
        <CustomerHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
