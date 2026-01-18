import type React from "react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { SellerHeader } from "@/components/seller/seller-header"
import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"

async function getSellerData(userId: string) {
  try {
    // Buscar dados do vendedor
    const [seller] = await sql`
      SELECT s.*, 
        (SELECT COALESCE(SUM(commission_value), 0) FROM sales WHERE seller_id = s.id AND commission_paid = false) as pending_commissions,
        (SELECT COUNT(*) FROM sales WHERE seller_id = s.id AND EXTRACT(MONTH FROM sale_date) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM sale_date) = EXTRACT(YEAR FROM CURRENT_DATE)) as month_sales
      FROM sellers s
      WHERE s.user_id = ${userId}
    `
    
    if (seller) {
      return {
        pendingCommissions: Number(seller.pending_commissions) || 0,
        monthSales: Number(seller.month_sales) || 0
      }
    }
    return null
  } catch (error) {
    console.error("[v0] Error fetching seller data:", error)
    return null
  }
}

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (!session) {
    redirect("/login?redirect=/seller")
  }

  // Verificar se é vendedor ou admin
  if (session.role !== "seller" && session.role !== "admin" && session.role !== "super_admin") {
    redirect("/")
  }

  const sellerData = await getSellerData(session.userId)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SellerSidebar />
      <div className="flex flex-1 flex-col">
        <SellerHeader session={session} sellerData={sellerData || undefined} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
