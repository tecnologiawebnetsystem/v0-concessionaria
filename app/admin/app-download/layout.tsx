import type React from "react"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function AppDownloadLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) redirect("/login?redirect=/admin/app-download")
  if (session.role !== "admin" && session.role !== "super_admin") redirect("/")

  // Layout sem sidebar e sem header do admin — página standalone
  return <>{children}</>
}
