"use client"

import { useEffect } from "react"

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/admin" })
        .then((reg) => console.log("[v0] SW registrado:", reg.scope))
        .catch(() => {})
    }
  }, [])

  return null
}
