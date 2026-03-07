"use client"

import { WifiOff, RefreshCw, Home, Heart, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="size-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
            <WifiOff className="size-10 text-muted-foreground" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Voce esta offline</h1>
          <p className="text-muted-foreground mb-6">
            Parece que voce perdeu a conexao com a internet. 
            Algumas funcoes podem estar indisponiveis.
          </p>

          <div className="space-y-3 mb-6">
            <Button className="w-full gap-2" onClick={() => window.location.reload()}>
              <RefreshCw className="size-4" />
              Tentar Novamente
            </Button>
            
            <Button variant="outline" className="w-full gap-2" asChild>
              <Link href="/">
                <Home className="size-4" />
                Pagina Inicial (Cache)
              </Link>
            </Button>
          </div>

          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Enquanto estiver offline, voce pode:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Heart className="size-4 text-red-500" />
                <span>Ver favoritos salvos</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <Phone className="size-4 text-green-500" />
                <span>Ligar para nos</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Precisa de ajuda? Ligue para{" "}
              <a href="tel:+551199999999" className="text-primary font-medium">
                (11) 9999-9999
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
