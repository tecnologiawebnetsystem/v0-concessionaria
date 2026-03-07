"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Car,
  Sparkles,
  Minimize2,
  Maximize2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  vehicles?: VehicleSuggestion[]
  isLoading?: boolean
}

interface VehicleSuggestion {
  id: string
  name: string
  brand: string
  year: number
  price: number
  image_url?: string
  slug: string
}

interface AIChatbotProps {
  className?: string
}

const QUICK_QUESTIONS = [
  "Quais SUVs voces tem disponiveis?",
  "Carros ate R$ 50.000",
  "Veiculos automaticos",
  "Quero fazer um test drive",
  "Como funciona o financiamento?",
]

export function AIChatbot({ className }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: "Ola! Sou o assistente virtual da concessionaria. Posso ajudar voce a encontrar o veiculo ideal, tirar duvidas sobre financiamento, agendar test drives e muito mais. Como posso ajudar?",
          timestamp: new Date(),
        },
      ])
    }
  }, [isOpen, messages.length])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Add loading message
    const loadingId = `loading_${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isLoading: true,
      },
    ])

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId,
          history: messages.filter((m) => !m.isLoading).slice(-10),
        }),
      })

      const data = await response.json()

      // Replace loading message with actual response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: data.response || "Desculpe, nao consegui processar sua mensagem.",
                vehicles: data.vehicles,
                isLoading: false,
              }
            : m
        )
      )
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: "Desculpe, ocorreu um erro. Tente novamente.",
                isLoading: false,
              }
            : m
        )
      )
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, messages, sessionId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 size-14 rounded-full shadow-lg z-50",
          "bg-primary hover:bg-primary/90 text-primary-foreground",
          "animate-bounce hover:animate-none",
          className
        )}
        size="icon"
      >
        <MessageCircle className="size-6" />
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed z-50 shadow-2xl transition-all duration-300",
        isExpanded
          ? "inset-4 md:inset-8"
          : "bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-10 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              Assistente Virtual
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="size-3 mr-1" />
                IA
              </Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">Online agora</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0 flex-1 overflow-hidden" style={{ height: "calc(100% - 140px)" }}>
        <ScrollArea ref={scrollRef} className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="size-8 shrink-0">
                  {message.role === "assistant" ? (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="size-4" />
                    </AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <User className="size-4" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted rounded-tl-sm"
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2 py-1">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm">Pensando...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                      {/* Vehicle suggestions */}
                      {message.vehicles && message.vehicles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-medium opacity-70">
                            Veiculos sugeridos:
                          </p>
                          {message.vehicles.map((vehicle) => (
                            <Link
                              key={vehicle.id}
                              href={`/veiculos/${vehicle.slug}`}
                              className="block"
                            >
                              <div className="flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                                <div className="size-12 rounded-lg bg-muted overflow-hidden shrink-0">
                                  {vehicle.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={vehicle.image_url}
                                      alt={vehicle.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Car className="size-6 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {vehicle.brand} {vehicle.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {vehicle.year} • {formatPrice(vehicle.price)}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick questions (show only at start) */}
          {messages.length <= 1 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">Perguntas frequentes:</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_QUESTIONS.map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5"
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
