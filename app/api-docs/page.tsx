"use client"

import { useEffect, useState } from "react"
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default function APIDocsPage() {
  const [spec, setSpec] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/docs")
      .then(res => res.json())
      .then(data => {
        setSpec(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading API spec:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
          <p className="mt-4 text-white text-lg">Carregando documentacao...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Nacional Veiculos API</h1>
              <p className="text-blue-200">Documentacao completa da API REST</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-200 text-sm">Versao</p>
              <p className="text-xl font-semibold">1.0.0</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-200 text-sm">Base URL</p>
              <p className="text-xl font-semibold">/api</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-200 text-sm">Autenticacao</p>
              <p className="text-xl font-semibold">Cookie JWT</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <p className="text-blue-200 text-sm">Formato</p>
              <p className="text-xl font-semibold">JSON</p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a 
              href="/api/docs" 
              target="_blank"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download OpenAPI JSON
            </a>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao Site
            </a>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="swagger-container">
        {spec && <SwaggerUI spec={spec} />}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .swagger-ui .topbar {
          display: none;
        }
        .swagger-ui .info {
          margin: 30px 0;
        }
        .swagger-ui .info .title {
          font-size: 28px;
          color: #1e293b;
        }
        .swagger-ui .info .description {
          font-size: 14px;
          color: #475569;
        }
        .swagger-ui .scheme-container {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        .swagger-ui .opblock-tag {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
        }
        .swagger-ui .opblock {
          border-radius: 8px;
          margin-bottom: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .swagger-ui .opblock.opblock-get {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }
        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #3b82f6;
        }
        .swagger-ui .opblock.opblock-post {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }
        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #22c55e;
        }
        .swagger-ui .opblock.opblock-put {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #f59e0b;
        }
        .swagger-ui .opblock.opblock-delete {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #ef4444;
        }
        .swagger-ui .opblock.opblock-patch {
          border-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }
        .swagger-ui .opblock.opblock-patch .opblock-summary-method {
          background: #8b5cf6;
        }
        .swagger-ui .opblock-summary-method {
          border-radius: 4px;
          font-weight: 600;
          min-width: 70px;
        }
        .swagger-ui .btn {
          border-radius: 6px;
        }
        .swagger-ui .btn.execute {
          background: #3b82f6;
          border-color: #3b82f6;
        }
        .swagger-ui .btn.execute:hover {
          background: #2563eb;
        }
        .swagger-ui table tbody tr td {
          padding: 12px 10px;
        }
        .swagger-ui .model-box {
          background: #f8fafc;
          border-radius: 8px;
        }
        .swagger-ui section.models {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .swagger-ui section.models h4 {
          font-size: 16px;
          color: #1e293b;
        }
        .swagger-ui .response-col_status {
          font-weight: 600;
        }
        .swagger-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
      `}</style>
    </div>
  )
}
