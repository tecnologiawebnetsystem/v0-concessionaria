import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold text-gray-900 sm:text-4xl">O Que Nossos Clientes Dizem</h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-gray-600">
            Depoimentos reais de clientes satisfeitos
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative">
              <CardContent className="p-6">
                <Quote className="mb-4 size-8 text-blue-900 opacity-20" />
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-gray-700">{testimonial.content}</p>
                <div className="flex items-center gap-3">
                  {testimonial.customer_photo ? (
                    <img
                      src={testimonial.customer_photo || "/placeholder.svg"}
                      alt={testimonial.customer_name}
                      className="size-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-900 text-white">
                      {testimonial.customer_name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.customer_name}</p>
                    {testimonial.vehicle_name && <p className="text-sm text-gray-600">{testimonial.vehicle_name}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
