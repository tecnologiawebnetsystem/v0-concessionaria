"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface Banner {
  id: string
  title: string
  image_url: string
  position: string
  is_active: boolean
  display_order: number
}

export function BannersTable() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/admin/banners")
      if (response.ok) {
        const data = await response.json()
        setBanners(data)
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar banners",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este banner?")) return

    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Banner excluído com sucesso",
        })
        fetchBanners()
      } else {
        throw new Error()
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir banner",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Posição</TableHead>
            <TableHead>Ordem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="relative w-20 h-12 rounded overflow-hidden">
                  <Image
                    src={banner.image_url || "/placeholder.svg"}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{banner.title}</TableCell>
              <TableCell className="capitalize">{banner.position}</TableCell>
              <TableCell>{banner.display_order}</TableCell>
              <TableCell>
                <Badge variant={banner.is_active ? "default" : "secondary"}>
                  {banner.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/banners/${banner.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
