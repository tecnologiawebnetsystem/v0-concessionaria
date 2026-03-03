"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send, Bot, User, Phone, Headphones, MessageCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const quickQuestions = [
  "Quais carros vocês têm disponíveis?",
  "Como funciona o financiamento?",
  "Qual o horário de funcionamento?",
  "Como agendar um test drive?",
]

type ChatView = "menu" | "chatbot" | "whatsapp"

function getUIMessageText(msg: any): string {
  if (msg.parts && Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("")
  }
  return msg.content || ""
}

function formatMessage(content: string) {
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br />")
}

export function UnifiedChat({ phoneNumber = "5512974063079" }: { phoneNumber?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<ChatView>("menu")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState("")

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isStreaming = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isStreaming])

  useEffect(() => {
    if (view === "chatbot" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [view])

  const handleSend = (text: string = input) => {
    if (!text.trim() || isStreaming) return
    sendMessage({ text })
    setInput("")
  }

  const handleWhatsAppClick = (message?: string) => {
    const defaultMessage = "Olá! Vim do site da GT Veículos e gostaria de mais informações."
    const encodedMessage = encodeURIComponent(message || defaultMessage)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")
  }

  const handleClose = () => {
    setIsOpen(false)
    setView("menu")
  }

  const displayMessages = messages.length === 0
    ? [{
        id: "welcome",
        role: "assistant" as const,
        content: "Olá! Sou o assistente virtual da **GT Veículos** com inteligência artificial. Posso ajudar você a encontrar o carro ideal, tirar dúvidas sobre financiamento, agendar test drive e muito mais. Como posso ajudar?",
      }]
    : messages

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full shadow-lg transition-all hover:scale-110",
          "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
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

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] animate-in slide-in-from-bottom-5">

          {/* Menu View */}
          {view === "menu" && (
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-semibold">Atendimento GT Veículos</CardTitle>
                      <p className="text-xs text-red-100">Como podemos ajudar?</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                <p className="text-sm text-gray-500 text-center mb-2">Escolha como deseja ser atendido:</p>

                <button
                  onClick={() => setView("chatbot")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-red-500 hover:bg-red-50 dark:border-gray-700 dark:hover:border-red-500 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative">
                    <Bot className="h-6 w-6 text-white" />
                    <Sparkles className="absolute -top-1 -right-1 size-4 text-yellow-400" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Assistente com IA</h3>
                    <p className="text-xs text-gray-500">Respostas inteligentes 24h sobre estoque, preços e mais</p>
                  </div>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 shrink-0">
                    Online
                  </Badge>
                </button>

                <button
                  onClick={() => setView("whatsapp")}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 dark:border-slate-700 dark:hover:border-green-500 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp</h3>
                    <p className="text-xs text-gray-500">Fale com um consultor humano</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 shrink-0">
                    Humano
                  </Badge>
                </button>

                <p className="text-center text-xs text-gray-400 pt-1">Seg-Sex 8h-18h | Sáb 9h-13h</p>
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
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={handleClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <div className="p-4 space-y-3 bg-white dark:bg-slate-900">
                <p className="text-sm text-gray-500 text-center mb-2">Escolha o assunto:</p>
                <Button onClick={() => handleWhatsAppClick()} className="w-full justify-start bg-green-500 hover:bg-green-600 h-12">
                  <MessageCircle className="mr-3 size-5" />
                  Iniciar Conversa
                </Button>
                <Button onClick={() => handleWhatsAppClick("Olá! Gostaria de agendar uma visita para conhecer os veículos.")} variant="outline" className="w-full justify-start h-11">
                  Agendar Visita
                </Button>
                <Button onClick={() => handleWhatsAppClick("Olá! Gostaria de saber sobre as condições de financiamento.")} variant="outline" className="w-full justify-start h-11">
                  Financiamento
                </Button>
                <Button onClick={() => handleWhatsAppClick("Olá! Tenho um veículo para trocar e gostaria de uma avaliação.")} variant="outline" className="w-full justify-start h-11">
                  Avaliar Meu Carro
                </Button>
                <button onClick={() => setView("menu")} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 pt-1">
                  Voltar ao menu
                </button>
              </div>
            </Card>
          )}

          {/* Chatbot View */}
          {view === "chatbot" && (
            <Card className="shadow-2xl border-0 flex flex-col overflow-hidden" style={{ height: 500 }}>
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setView("menu")} className="hover:bg-white/20 p-1.5 rounded">
                      <X className="h-4 w-4 rotate-45" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center relative">
                      <Bot className="h-4 w-4" />
                      <Sparkles className="absolute -top-1 -right-1 size-3 text-yellow-300" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">Assistente GT Veículos</CardTitle>
                      <p className="text-xs text-red-200">Powered by IA</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-8 px-2 text-xs" onClick={() => handleWhatsAppClick()}>
                      <Phone className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8" onClick={handleClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <ScrollArea ref={scrollRef} className="flex-1 p-3 bg-slate-50 dark:bg-slate-900">
                <div className="space-y-3">
                  {displayMessages.map((message, idx) => {
                    const text = getUIMessageText(message)
                    const isLast = idx === displayMessages.length - 1
                    const isAssistantStreaming = isStreaming && isLast && message.role === "assistant"
                    return (
                      <div key={message.id} className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
                        {message.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-3.5 w-3.5 text-red-600" />
                          </div>
                        )}
                        <div className={cn("rounded-2xl px-3 py-2 text-sm max-w-[85%]",
                          message.role === "user"
                            ? "bg-red-600 text-white rounded-br-sm"
                            : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-bl-sm"
                        )}>
                          {text ? (
                            <span dangerouslySetInnerHTML={{ __html: formatMessage(text) }} />
                          ) : isAssistantStreaming ? (
                            <span className="flex gap-1 items-center py-0.5">
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                          ) : null}
                        </div>
                        {message.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-3.5 w-3.5 text-white" />
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* Respostas rápidas iniciais */}
                  {messages.length === 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {quickQuestions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="text-xs px-2.5 py-1.5 rounded-full border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-3 border-t bg-white dark:bg-slate-800 flex-shrink-0">
                <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 text-sm"
                    disabled={isStreaming}
                  />
                  <Button type="submit" size="icon" disabled={!input.trim() || isStreaming} className="bg-red-600 hover:bg-red-700 shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-center text-xs text-gray-400 mt-1.5 flex items-center justify-center gap-1">
                  <Sparkles className="size-3" />
                  Assistente com inteligência artificial
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
