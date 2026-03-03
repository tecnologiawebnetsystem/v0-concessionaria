"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Loader2, TrendingDown, Star, RefreshCw, FileSearch, AlertTriangle } from "lucide-react"

interface Insight {
  vehicleName: string
  daysListed: number
  recommendation: string
  action: "discount" | "feature" | "repost" | "review"
  urgency: "high" | "medium" | "low"
}

interface InsightsData {
  insights: Insight[]
  summary: string
}

const ACTION_CONFIG = {
  discount: { label: "Reduzir Preço", icon: TrendingDown, color: "text-red-600 bg-red-50 border-red-200" },
  feature: { label: "Destacar", icon: Star, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  repost: { label: "Repostar", icon: RefreshCw, color: "text-blue-600 bg-blue-50 border-blue-200" },
  review: { label: "Revisar Anúncio", icon: FileSearch, color: "text-purple-600 bg-purple-50 border-purple-200" },
}

const URGENCY_BADGE = {
  high: "destructive" as const,
  medium: "secondary" as const,
  low: "outline" as const,
}

const URGENCY_LABEL = {
  high: "Urgente",
  medium: "Atenção",
  low: "Monitorar",
}

export function AIInsightsWidget() {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  async function loadInsights() {
    setLoading(true)
    try {
      const res = await fetch("/api/ai/insights")
      const json = await res.json()
      setData(json)
      setLoaded(true)
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-purple-100">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-100">
            <Sparkles className="size-4 text-purple-600" />
          </div>
          <CardTitle className="text-base">Insights de IA — Estoque Parado</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadInsights}
          disabled={loading}
          className="h-8 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
        >
          {loading ? <Loader2 className="size-3 animate-spin mr-1" /> : <Sparkles className="size-3 mr-1" />}
          {loaded ? "Atualizar" : "Analisar"}
        </Button>
      </CardHeader>

      <CardContent>
        {!loaded && !loading && (
          <div className="text-center py-6 text-sm text-gray-400">
            <AlertTriangle className="size-8 mx-auto mb-2 text-gray-300" />
            <p>Clique em "Analisar" para a IA identificar veículos parados e sugerir ações.</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center gap-2 py-6 text-sm text-purple-600">
            <Loader2 className="size-4 animate-spin" />
            Analisando estoque com inteligência artificial...
          </div>
        )}

        {loaded && data && (
          <div className="space-y-3">
            {data.summary && (
              <p className="text-sm text-gray-600 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                {data.summary}
              </p>
            )}

            {data.insights.length === 0 ? (
              <p className="text-sm text-green-600 text-center py-2">Nenhum veículo parado identificado.</p>
            ) : (
              data.insights.map((insight, idx) => {
                const cfg = ACTION_CONFIG[insight.action]
                const Icon = cfg.icon
                return (
                  <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.color}`}>
                    <Icon className="size-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm truncate">{insight.vehicleName}</span>
                        <Badge variant={URGENCY_BADGE[insight.urgency]} className="text-xs shrink-0">
                          {URGENCY_LABEL[insight.urgency]}
                        </Badge>
                        <span className="text-xs text-gray-500 shrink-0">{insight.daysListed}d parado</span>
                      </div>
                      <p className="text-xs mt-0.5 text-gray-700">{insight.recommendation}</p>
                    </div>
                    <span className="text-xs font-medium shrink-0">{cfg.label}</span>
                  </div>
                )
              })
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
