"use client"

import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Check, AlertCircle, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface ViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean
}

interface AddressData {
  cep: string
  street: string
  complement: string
  neighborhood: string
  city: string
  state: string
  ibge: string
}

interface CepInputProps {
  onAddressFound?: (address: AddressData) => void
  onError?: (error: string) => void
  defaultValue?: string
  label?: string
  className?: string
  showAddressPreview?: boolean
}

export function CepInput({
  onAddressFound,
  onError,
  defaultValue = "",
  label = "CEP",
  className,
  showAddressPreview = true,
}: CepInputProps) {
  const [cep, setCep] = useState(defaultValue)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [address, setAddress] = useState<AddressData | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const fetchAddress = useCallback(async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, "")
    
    if (cleanCep.length !== 8) {
      return
    }

    setLoading(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data: ViaCepResponse = await response.json()

      if (data.erro) {
        setStatus("error")
        setErrorMessage("CEP não encontrado")
        setAddress(null)
        onError?.("CEP não encontrado")
        return
      }

      const addressData: AddressData = {
        cep: data.cep,
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        ibge: data.ibge,
      }

      setAddress(addressData)
      setStatus("success")
      onAddressFound?.(addressData)
    } catch {
      setStatus("error")
      setErrorMessage("Erro ao buscar CEP")
      setAddress(null)
      onError?.("Erro ao buscar CEP")
    } finally {
      setLoading(false)
    }
  }, [onAddressFound, onError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value)
    setCep(formatted)
    
    // Auto-busca quando completar 8 dígitos
    if (formatted.replace(/\D/g, "").length === 8) {
      fetchAddress(formatted)
    } else {
      setStatus("idle")
      setAddress(null)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="cep">{label}</Label>
      <div className="relative">
        <Input
          id="cep"
          type="text"
          inputMode="numeric"
          placeholder="00000-000"
          value={cep}
          onChange={handleChange}
          maxLength={9}
          className={cn(
            "pr-10",
            status === "success" && "border-emerald-500 focus-visible:ring-emerald-500/50",
            status === "error" && "border-red-500 focus-visible:ring-red-500/50"
          )}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          {status === "success" && <Check className="size-4 text-emerald-500" />}
          {status === "error" && <AlertCircle className="size-4 text-red-500" />}
        </div>
      </div>

      {status === "error" && errorMessage && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="size-3" />
          {errorMessage}
        </p>
      )}

      {showAddressPreview && address && status === "success" && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="size-4 text-emerald-500 mt-0.5 shrink-0" />
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {address.street || "Logradouro não disponível"}
                {address.complement && ` - ${address.complement}`}
              </p>
              <p className="text-muted-foreground">
                {address.neighborhood && `${address.neighborhood}, `}
                {address.city} - {address.state}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook para usar a busca de CEP em outros lugares
export function useViaCep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddress = useCallback(async (cep: string): Promise<AddressData | null> => {
    const cleanCep = cep.replace(/\D/g, "")
    
    if (cleanCep.length !== 8) {
      setError("CEP deve ter 8 dígitos")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data: ViaCepResponse = await response.json()

      if (data.erro) {
        setError("CEP não encontrado")
        return null
      }

      return {
        cep: data.cep,
        street: data.logradouro,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
        ibge: data.ibge,
      }
    } catch {
      setError("Erro ao buscar CEP")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchAddress, loading, error }
}
