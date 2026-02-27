import { PublicHeader } from "@/components/public/public-header"
import { PublicFooter } from "@/components/public/public-footer"
import { WhatsAppFloat } from "@/components/public/whatsapp-float"
import { StoreMap } from "@/components/public/store-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, Car, Shield, Award } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contato - GT Veículos Taubaté",
  description: "Entre em contato com a GT Veículos em Taubaté. Telefone, WhatsApp, endereço e formulário de contato.",
  keywords: "contato nacional veículos, concessionária taubaté telefone, endereço nacional veículos"
}

export default function ContatoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <WhatsAppFloat />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center">
              <Badge className="mb-4 bg-blue-400/20 text-blue-100 border-blue-300/30">
                <Phone className="h-3 w-3 mr-1" />
                Fale Conosco
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Entre em Contato
              </h1>
              <p className="text-lg text-blue-100/90 max-w-2xl mx-auto">
                Estamos prontos para ajudar você a encontrar o carro dos seus sonhos. 
                Fale com nossos consultores especializados.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-6 -mt-20">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
                  <p className="text-muted-foreground mb-4">Atendimento rápido e prático</p>
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <a href="https://wa.me/5512999999999" target="_blank" rel="noopener noreferrer">
                      (12) 99999-9999
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Telefone</h3>
                  <p className="text-muted-foreground mb-4">Ligue para nossa central</p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href="tel:+551236210000">
                      (12) 3621-0000
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">E-mail</h3>
                  <p className="text-muted-foreground mb-4">Envie sua mensagem</p>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <a href="mailto:contato@nacionalveiculos.com.br">
                      contato@nacionalveiculos.com.br
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Map and Form */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Map */}
              <div>
                <StoreMap />
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-primary" />
                    Envie sua Mensagem
                  </CardTitle>
                  <CardDescription>
                    Preencha o formulário abaixo e entraremos em contato em até 24 horas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" placeholder="Seu nome completo" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input id="phone" placeholder="(12) 99999-9999" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input id="subject" placeholder="Como podemos ajudar?" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Escreva sua mensagem aqui..." 
                        rows={5}
                        required 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">Resposta Rápida</h3>
                <p className="text-sm text-muted-foreground">Retornamos seu contato em até 24 horas úteis</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Dados Protegidos</h3>
                <p className="text-sm text-muted-foreground">Suas informações estão seguras conosco</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-bold mb-2">15 Anos de Experiência</h3>
                <p className="text-sm text-muted-foreground">Tradição e confiança no mercado automotivo</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}
