"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Loader2, Car, Phone, MapPin, Clock, CreditCard, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  quickReplies?: string[]
}

const quickQuestions = [
  "Horário de funcionamento",
  "Formas de pagamento",
  "Como agendar test drive",
  "Financiamento disponível",
  "Localização da loja",
  "Carros mais vendidos",
]

const botResponses: Record<string, { response: string; quickReplies?: string[] }> = {
  "horário de funcionamento": {
    response: "Nosso horário de funcionamento é:\n\n**Segunda a Sexta:** 8h às 18h\n**Sábado:** 8h às 14h\n**Domingo e Feriados:** Fechado\n\nVenha nos visitar! Estamos localizados em Taubaté.",
    quickReplies: ["Localização da loja", "Agendar visita"]
  },
  "formas de pagamento": {
    response: "Trabalhamos com diversas formas de pagamento:\n\n• **À vista** - com desconto especial\n• **Financiamento** - parcelas em até 60x\n• **Consórcio** - planeje sua compra\n• **Troca** - avaliamos seu usado\n\nQuer saber mais sobre alguma opção?",
    quickReplies: ["Simular financiamento", "Avaliar meu carro"]
  },
  "como agendar test drive": {
    response: "Agendar um test drive é muito fácil!\n\n1. Escolha o veículo de interesse\n2. Clique em 'Agendar Test Drive'\n3. Preencha seus dados e escolha o melhor horário\n\nOu se preferir, entre em contato pelo WhatsApp: **(12) 99999-9999**",
    quickReplies: ["Ver veículos disponíveis", "Falar no WhatsApp"]
  },
  "financiamento disponível": {
    response: "Oferecemos as melhores condições de financiamento!\n\n• Taxas a partir de **0,99% a.m.**\n• Parcelas em até **60x**\n• Aprovação em até **30 minutos**\n• Aceitamos seu carro como entrada\n\nFaça uma simulação agora mesmo em nossa página!",
    quickReplies: ["Simular financiamento", "Formas de pagamento"]
  },
  "localização da loja": {
    response: "Estamos localizados em:\n\n**GT Veículos**\nAv. Independência, 1500\nCentro - Taubaté/SP\nCEP: 12020-000\n\n📍 Fácil acesso pela Dutra\n🅿️ Estacionamento gratuito\n\nVenha nos visitar!",
    quickReplies: ["Ver no mapa", "Horário de funcionamento"]
  },
  "carros mais vendidos": {
    response: "Nossos veículos mais procurados são:\n\n🥇 **Toyota Corolla** - Sedan líder\n🥈 **Honda Civic** - Esportividade\n🥉 **VW Polo** - Hatch premium\n🏅 **Chevrolet Onix** - Economia\n🏅 **Jeep Compass** - SUV versátil\n\nQuer conhecer algum deles?",
    quickReplies: ["Ver estoque completo", "Agendar test drive"]
  },
  "simular financiamento": {
    response: "Para simular seu financiamento, acesse a página do veículo desejado e clique em 'Simular Financiamento'.\n\nNossa calculadora mostra:\n• Valor das parcelas\n• Taxa de juros\n• Custo total\n\nOu fale com um consultor para uma proposta personalizada!",
    quickReplies: ["Ver veículos disponíveis", "Falar no WhatsApp"]
  },
  "avaliar meu carro": {
    response: "Quer saber quanto vale seu carro?\n\nClique em 'Avalie seu Carro' no menu ou na página de qualquer veículo.\n\nPreencha os dados e receba uma avaliação em até **24 horas**!\n\nAceitamos seu usado como entrada no financiamento.",
    quickReplies: ["Formas de pagamento", "Ver veículos disponíveis"]
  },
  "ver veículos disponíveis": {
    response: "Temos uma grande variedade de veículos!\n\n• **Sedans** - Corolla, Civic, Jetta\n• **Hatchs** - Polo, Onix, Argo\n• **SUVs** - Compass, Tracker, CR-V\n• **Pickups** - Hilux, S10, Ranger\n\nAcesse nosso estoque completo no menu 'Veículos'.",
    quickReplies: ["Agendar test drive", "Carros mais vendidos"]
  },
  "falar no whatsapp": {
    response: "Claro! Fale diretamente com nossos consultores:\n\n📱 **(12) 99999-9999**\n\nAtendimento de segunda a sábado, das 8h às 18h.\n\nEstamos prontos para ajudar você a encontrar o carro ideal!",
    quickReplies: ["Horário de funcionamento", "Localização da loja"]
  },
  "ver no mapa": {
    response: "Nossa localização no Google Maps está disponível na seção 'Contato' do site.\n\n**Endereço:**\nAv. Independência, 1500\nCentro - Taubaté/SP\n\nVenha nos visitar! Temos estacionamento gratuito.",
    quickReplies: ["Horário de funcionamento", "Falar no WhatsApp"]
  },
  "agendar visita": {
    response: "Para agendar sua visita:\n\n1. Escolha a data e horário de sua preferência\n2. Você pode agendar pelo site ou WhatsApp\n\nNossos consultores estarão prontos para atendê-lo!\n\n📱 **(12) 99999-9999**",
    quickReplies: ["Horário de funcionamento", "Ver veículos disponíveis"]
  },
  "default": {
    response: "Olá! Sou o assistente virtual da **GT Veículos**.\n\nPosso ajudar você com:\n• Informações sobre veículos\n• Financiamento e pagamento\n• Agendamento de test drive\n• Avaliação do seu usado\n• Localização e horários\n\nComo posso ajudar?",
    quickReplies: ["Ver veículos disponíveis", "Financiamento disponível", "Localização da loja"]
  }
}

function getBotResponse(message: string): { response: string; quickReplies?: string[] } {
  const normalizedMessage = message.toLowerCase().trim()
  
  // Check for keyword matches
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== "default" && normalizedMessage.includes(key)) {
      return value
    }
  }
  
  // Check for partial matches
  if (normalizedMessage.includes("horário") || normalizedMessage.includes("funcionamento") || normalizedMessage.includes("abre")) {
    return botResponses["horário de funcionamento"]
  }
  if (normalizedMessage.includes("pagamento") || normalizedMessage.includes("pagar") || normalizedMessage.includes("parcela")) {
    return botResponses["formas de pagamento"]
  }
  if (normalizedMessage.includes("test") || normalizedMessage.includes("drive") || normalizedMessage.includes("experimentar")) {
    return botResponses["como agendar test drive"]
  }
  if (normalizedMessage.includes("financ") || normalizedMessage.includes("crédito") || normalizedMessage.includes("simul")) {
    return botResponses["financiamento disponível"]
  }
  if (normalizedMessage.includes("onde") || normalizedMessage.includes("endereço") || normalizedMessage.includes("localiz") || normalizedMessage.includes("mapa")) {
    return botResponses["localização da loja"]
  }
  if (normalizedMessage.includes("carro") && (normalizedMessage.includes("vendido") || normalizedMessage.includes("popular"))) {
    return botResponses["carros mais vendidos"]
  }
  if (normalizedMessage.includes("avali") || normalizedMessage.includes("troc") || normalizedMessage.includes("usado")) {
    return botResponses["avaliar meu carro"]
  }
  if (normalizedMessage.includes("whatsapp") || normalizedMessage.includes("zap") || normalizedMessage.includes("telefone")) {
    return botResponses["falar no whatsapp"]
  }
  if (normalizedMessage.includes("veículo") || normalizedMessage.includes("carro") || normalizedMessage.includes("estoque")) {
    return botResponses["ver veículos disponíveis"]
  }
  if (normalizedMessage.includes("oi") || normalizedMessage.includes("olá") || normalizedMessage.includes("boa")) {
    return {
      response: "Olá! Seja bem-vindo à **GT Veículos**! 👋\n\nSou seu assistente virtual e estou aqui para ajudar.\n\nO que você gostaria de saber?",
      quickReplies: ["Ver veículos disponíveis", "Financiamento disponível", "Horário de funcionamento"]
    }
  }
  
  return botResponses["default"]
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente virtual da **GT Veículos** em Taubaté. Como posso ajudar você hoje?",
      timestamp: new Date(),
      quickReplies: quickQuestions.slice(0, 4)
    }
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = (text: string = input) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const { response, quickReplies } = getBotResponse(text)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        quickReplies
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 500)
  }

  const handleQuickReply = (reply: string) => {
    handleSend(reply)
  }

  const formatMessage = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />')
  }

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-24 right-6 z-40 h-14 w-14 rounded-full shadow-lg",
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
          "transition-all hover:scale-105",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[600px] shadow-2xl border-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Assistente Virtual</CardTitle>
                  <p className="text-xs text-blue-100">GT Veículos</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-slate-50 dark:bg-slate-900">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                  <div className={cn("flex flex-col gap-2 max-w-[80%]")}>
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm",
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-bl-sm"
                      )}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    {message.quickReplies && message.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.quickReplies.map((reply) => (
                          <Badge
                            key={reply}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-colors text-xs py-1"
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t bg-white dark:bg-slate-800 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  )
}
