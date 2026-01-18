"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Bot, User, Phone, Headphones } from "lucide-react"
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
    response: "Agendar um test drive é muito fácil!\n\n1. Escolha o veículo de interesse\n2. Clique em 'Agendar Test Drive'\n3. Preencha seus dados e escolha o melhor horário\n\nOu se preferir, clique em 'Falar no WhatsApp' abaixo!",
    quickReplies: ["Ver veículos disponíveis", "Falar no WhatsApp"]
  },
  "financiamento disponível": {
    response: "Oferecemos as melhores condições de financiamento!\n\n• Taxas a partir de **0,99% a.m.**\n• Parcelas em até **60x**\n• Aprovação em até **30 minutos**\n• Aceitamos seu carro como entrada\n\nFaça uma simulação agora mesmo em nossa página!",
    quickReplies: ["Simular financiamento", "Formas de pagamento"]
  },
  "localização da loja": {
    response: "Estamos localizados em:\n\n**Nacional Veículos**\nAv. Independência, 1500\nCentro - Taubaté/SP\nCEP: 12020-000\n\n📍 Fácil acesso pela Dutra\n🅿️ Estacionamento gratuito",
    quickReplies: ["Horário de funcionamento", "Falar no WhatsApp"]
  },
  "carros mais vendidos": {
    response: "Nossos veículos mais procurados são:\n\n🥇 **Toyota Corolla** - Sedan líder\n🥈 **Honda Civic** - Esportividade\n🥉 **VW Polo** - Hatch premium\n🏅 **Chevrolet Onix** - Economia\n🏅 **Jeep Compass** - SUV versátil",
    quickReplies: ["Ver estoque completo", "Agendar test drive"]
  },
  "default": {
    response: "Olá! Sou o assistente virtual da **Nacional Veículos**.\n\nPosso ajudar você com:\n• Informações sobre veículos\n• Financiamento e pagamento\n• Agendamento de test drive\n• Avaliação do seu usado\n• Localização e horários\n\nComo posso ajudar?",
    quickReplies: ["Ver veículos disponíveis", "Financiamento disponível", "Localização da loja"]
  }
}

function getBotResponse(message: string): { response: string; quickReplies?: string[] } {
  const normalizedMessage = message.toLowerCase().trim()
  
  for (const [key, value] of Object.entries(botResponses)) {
    if (key !== "default" && normalizedMessage.includes(key)) {
      return value
    }
  }
  
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
  if (normalizedMessage.includes("whatsapp") || normalizedMessage.includes("zap")) {
    return {
      response: "Clique no botão do WhatsApp no canto superior direito do chat para falar diretamente com nossos consultores!",
      quickReplies: ["Horário de funcionamento", "Localização da loja"]
    }
  }
  if (normalizedMessage.includes("oi") || normalizedMessage.includes("olá") || normalizedMessage.includes("boa")) {
    return {
      response: "Olá! Seja bem-vindo à **Nacional Veículos**! 👋\n\nSou seu assistente virtual. O que você gostaria de saber?",
      quickReplies: ["Ver veículos disponíveis", "Financiamento disponível", "Horário de funcionamento"]
    }
  }
  
  return botResponses["default"]
}

type ChatView = "menu" | "chatbot" | "whatsapp"

export function UnifiedChat({ phoneNumber = "5511999999999" }: { phoneNumber?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ChatView>("menu")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente virtual da **Nacional Veículos**. Como posso ajudar você hoje?",
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
    if (view === "chatbot" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [view])

  const handleWhatsAppClick = (message?: string) => {
    const defaultMessage = "Olá! Vim do site da Nacional Veículos e gostaria de mais informações."
    const encodedMessage = encodeURIComponent(message || defaultMessage)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

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

  const handleClose = () => {
    setIsOpen(false)
    setView("menu")
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
          "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
          isOpen ? "size-12" : "size-14 sm:size-16"
        )}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="size-5 text-white" />
        ) : (
          <>
            <Headphones className="size-6 sm:size-7 text-white" />
            <span className="absolute -top-1 -right-1 flex size-4 animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="absolute -top-1 -right-1 flex size-4 rounded-full bg-green-400" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5">
          {/* Menu View */}
          {view === "menu" && (
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Atendimento</CardTitle>
                      <p className="text-xs text-blue-100">Como podemos ajudar?</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  Escolha como deseja ser atendido:
                </p>

                {/* Chatbot Option */}
                <button
                  onClick={() => setView("chatbot")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Assistente Virtual</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Respostas instantâneas 24h</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Online
                  </Badge>
                </button>

                {/* WhatsApp Option */}
                <button
                  onClick={() => setView("whatsapp")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 dark:border-slate-700 dark:hover:border-green-500 dark:hover:bg-green-900/20 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fale com um consultor</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Humano
                  </Badge>
                </button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 pt-2">
                  Seg-Sex 8h-18h | Sáb 8h-14h
                </p>
              </div>
            </Card>
          )}

          {/* WhatsApp View */}
          {view === "whatsapp" && (
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setView("menu")} className="hover:bg-white/20 p-1 rounded">
                      <X className="h-4 w-4 rotate-45" />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">WhatsApp</CardTitle>
                      <p className="text-xs text-green-100">Fale com um consultor</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                  Escolha o assunto para agilizar seu atendimento:
                </p>

                <Button
                  onClick={() => handleWhatsAppClick()}
                  className="w-full justify-start bg-green-500 hover:bg-green-600 h-12"
                >
                  <MessageCircle className="mr-3 size-5" />
                  Iniciar Conversa
                </Button>
                
                <Button
                  onClick={() => handleWhatsAppClick("Olá! Gostaria de agendar uma visita para conhecer os veículos.")}
                  variant="outline"
                  className="w-full justify-start h-11"
                >
                  Agendar Visita
                </Button>
                
                <Button
                  onClick={() => handleWhatsAppClick("Olá! Gostaria de saber sobre as condições de financiamento.")}
                  variant="outline"
                  className="w-full justify-start h-11"
                >
                  Financiamento
                </Button>
                
                <Button
                  onClick={() => handleWhatsAppClick("Olá! Tenho um veículo para vender/trocar e gostaria de fazer uma avaliação.")}
                  variant="outline"
                  className="w-full justify-start h-11"
                >
                  Avaliar Meu Carro
                </Button>

                <button
                  onClick={() => setView("menu")}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 pt-2"
                >
                  ← Voltar ao menu
                </button>
              </div>
            </Card>
          )}

          {/* Chatbot View */}
          {view === "chatbot" && (
            <Card className="shadow-2xl border-0 flex flex-col overflow-hidden max-h-[500px]">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setView("menu")} className="hover:bg-white/20 p-1.5 rounded">
                      <X className="h-4 w-4 rotate-45" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Assistente Virtual</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 h-8 px-2 text-xs"
                      onClick={() => handleWhatsAppClick()}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={handleClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea ref={scrollRef} className="flex-1 p-3 bg-slate-50 dark:bg-slate-900">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-2",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div className="flex flex-col gap-1.5 max-w-[85%]">
                        <div
                          className={cn(
                            "rounded-2xl px-3 py-2 text-sm",
                            message.role === "user"
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-bl-sm"
                          )}
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        {message.quickReplies && message.quickReplies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.quickReplies.map((reply) => (
                              <Badge
                                key={reply}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-colors text-xs py-0.5"
                                onClick={() => handleQuickReply(reply)}
                              >
                                {reply}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <User className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 shadow-sm">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-2 border-t bg-white dark:bg-slate-800 flex-shrink-0">
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
                    className="flex-1 h-9 text-sm"
                    disabled={isTyping}
                  />
                  <Button type="submit" size="icon" className="h-9 w-9" disabled={!input.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
