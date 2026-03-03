"use client"

import { useEffect } from "react"

export function TrackVehicleView({ vehicleId }: { vehicleId: string }) {
  useEffect(() => {
    // Só registra se o usuário estiver logado — a API retorna 401 silenciosamente
    fetch("/api/customer/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicle_id: vehicleId }),
    }).catch(() => {})
  }, [vehicleId])

  return null
}
