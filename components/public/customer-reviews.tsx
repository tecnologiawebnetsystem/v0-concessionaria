"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Star, ThumbsUp, MessageCircle, CheckCircle, Camera, 
  ChevronLeft, ChevronRight, Quote, Loader2, Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Image from "next/image"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    verified: boolean
    purchaseDate?: string
    vehiclePurchased?: string
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  photos?: string[]
  response?: {
    author: string
    content: string
    date: string
  }
}

interface CustomerReviewsProps {
  vehicleId?: string // Se passado, mostra reviews do veiculo especifico
  showForm?: boolean
}

export function CustomerReviews({ vehicleId, showForm = false }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  })

  useEffect(() => {
    loadReviews()
  }, [vehicleId, filter])

  async function loadReviews() {
    setLoading(true)
    try {
      const url = vehicleId 
        ? `/api/reviews?vehicleId=${vehicleId}&rating=${filter}`
        : `/api/reviews?rating=${filter}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews)
        setStats(data.stats)
      } else {
        // Dados de demonstracao
        setReviews([
          {
            id: '1',
            user: {
              name: 'Carlos Silva',
              verified: true,
              purchaseDate: '2024-01-15',
              vehiclePurchased: 'Toyota Corolla 2023'
            },
            rating: 5,
            title: 'Excelente experiencia de compra!',
            content: 'Desde o primeiro contato ate a entrega do veiculo, tudo foi impecavel. O vendedor Joao foi muito atencioso e transparente. O carro estava exatamente como descrito no anuncio. Recomendo muito!',
            date: '2024-01-20',
            helpful: 24,
            photos: ['/images/vehicles/car-main.jpg']
          },
          {
            id: '2',
            user: {
              name: 'Maria Santos',
              verified: true,
              purchaseDate: '2024-02-10',
              vehiclePurchased: 'Honda Civic 2022'
            },
            rating: 5,
            title: 'Transparencia e qualidade',
            content: 'O que mais me impressionou foi a transparencia. Me mostraram todo o historico do carro, laudo de vistoria detalhado. Financiamento foi rapido e com otimas taxas. Super satisfeita!',
            date: '2024-02-15',
            helpful: 18,
            response: {
              author: 'Equipe Concessionaria',
              content: 'Maria, muito obrigado pelo feedback! Ficamos felizes em saber que sua experiencia foi positiva. Estamos a disposicao!',
              date: '2024-02-16'
            }
          },
          {
            id: '3',
            user: {
              name: 'Pedro Oliveira',
              verified: true,
              purchaseDate: '2024-03-01',
              vehiclePurchased: 'Jeep Compass 2023'
            },
            rating: 4,
            title: 'Otimo atendimento',
            content: 'Atendimento muito bom, equipe prestativa. O unico ponto de atencao foi o prazo de entrega que demorou um pouco mais que o previsto, mas no geral foi uma boa experiencia.',
            date: '2024-03-10',
            helpful: 12
          },
          {
            id: '4',
            user: {
              name: 'Ana Costa',
              verified: true,
              purchaseDate: '2024-03-15',
              vehiclePurchased: 'Volkswagen T-Cross 2024'
            },
            rating: 5,
            title: 'Melhor concessionaria da regiao!',
            content: 'Ja comprei 3 carros aqui e sempre tive experiencias excelentes. Preco justo, carros bem cuidados e pos-venda nota 10. Parabens a toda equipe!',
            date: '2024-03-20',
            helpful: 31
          },
        ])
        setStats({
          average: 4.8,
          total: 127,
          distribution: { 5: 89, 4: 28, 3: 7, 2: 2, 1: 1 }
        })
      }
    } catch (error) {
      console.error('Erro ao carregar reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  function renderStars(rating: number, size: 'sm' | 'md' | 'lg' = 'md') {
    const sizeClass = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-6' : 'size-4'
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClass,
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
    )
  }

  async function handleHelpful(reviewId: string) {
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' })
      setReviews(prev => prev.map(r => 
        r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
      ))
      toast.success('Obrigado pelo feedback!')
    } catch {
      toast.error('Erro ao registrar')
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <Card>
        <CardContent className="py-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Media geral */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-5xl font-bold">{stats.average.toFixed(1)}</div>
                {renderStars(Math.round(stats.average), 'lg')}
                <div className="text-sm text-muted-foreground mt-1">
                  {stats.total} avaliacoes
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating as keyof typeof stats.distribution]
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <button
                      key={rating}
                      onClick={() => setFilter(filter === String(rating) ? 'all' : String(rating) as any)}
                      className={cn(
                        "flex items-center gap-2 w-full group",
                        filter === String(rating) && "font-medium"
                      )}
                    >
                      <span className="text-sm w-3">{rating}</span>
                      <Star className="size-3 fill-yellow-400 text-yellow-400" />
                      <Progress 
                        value={percentage} 
                        className="flex-1 h-2 group-hover:h-3 transition-all" 
                      />
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Destaques */}
            <div className="flex flex-col justify-center">
              <h4 className="font-medium mb-3">Por que clientes nos escolhem:</h4>
              <div className="space-y-2">
                {[
                  { label: 'Transparencia', value: 98 },
                  { label: 'Atendimento', value: 96 },
                  { label: 'Qualidade dos Veiculos', value: 95 },
                  { label: 'Pos-Venda', value: 94 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <CheckCircle className="size-4 text-green-500" />
                    <span className="text-sm flex-1">{item.label}</span>
                    <Badge variant="secondary">{item.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar por:</span>
          <div className="flex gap-1">
            {['all', '5', '4', '3', '2', '1'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(f as any)}
              >
                {f === 'all' ? 'Todas' : `${f} estrelas`}
              </Button>
            ))}
          </div>
        </div>
        {showForm && (
          <WriteReviewDialog onSuccess={loadReviews} />
        )}
      </div>

      {/* Lista de Reviews */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar className="size-12">
                    <AvatarImage src={review.user.avatar} />
                    <AvatarFallback>
                      {review.user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{review.user.name}</span>
                      {review.user.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <CheckCircle className="size-3" />
                          Compra Verificada
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      {renderStars(review.rating, 'sm')}
                      <span>{new Date(review.date).toLocaleDateString('pt-BR')}</span>
                      {review.user.vehiclePurchased && (
                        <span className="hidden md:inline">
                          Comprou: {review.user.vehiclePurchased}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium mt-3">{review.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{review.content}</p>

                    {/* Fotos */}
                    {review.photos && review.photos.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.photos.map((photo, i) => (
                          <div key={i} className="relative size-20 rounded-lg overflow-hidden">
                            <Image src={photo} alt="" fill className="object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Resposta da loja */}
                    {review.response && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Quote className="size-4 text-primary" />
                          <span className="font-medium text-sm">{review.response.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.response.date).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.response.content}</p>
                      </div>
                    )}

                    {/* Acoes */}
                    <div className="flex items-center gap-4 mt-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleHelpful(review.id)}
                      >
                        <ThumbsUp className="size-4" />
                        Util ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selo de confianca */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="flex items-center gap-4 py-6">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="size-8 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold">Avaliacoes 100% Verificadas</h4>
            <p className="text-sm text-muted-foreground">
              Todas as avaliacoes sao de clientes reais que compraram veiculos conosco. 
              Nao manipulamos ou excluimos avaliacoes negativas.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Dialog para escrever review
function WriteReviewDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (rating === 0 || !title || !content) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, title, content })
      })
      if (res.ok) {
        toast.success('Avaliacao enviada! Sera publicada apos verificacao.')
        setOpen(false)
        onSuccess()
      } else {
        toast.error('Erro ao enviar avaliacao')
      }
    } catch {
      toast.error('Erro ao enviar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Star className="size-4" />
          Escrever Avaliacao
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avaliar sua experiencia</DialogTitle>
          <DialogDescription>
            Compartilhe sua experiencia para ajudar outros clientes
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sua nota</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "size-8 transition-colors",
                      (hoverRating || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Titulo</Label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Resuma sua experiencia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Sua avaliacao</Label>
            <Textarea
              className="mt-1"
              placeholder="Conte mais sobre sua experiencia..."
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Enviar Avaliacao
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
