/**
 * Instagram Graph API Integration
 * 
 * REQUISITOS PARA USO:
 * 1. Conta Instagram Business ou Creator
 * 2. Página do Facebook conectada
 * 3. Facebook App com permissões aprovadas:
 *    - instagram_basic
 *    - instagram_content_publish
 *    - pages_read_engagement
 * 
 * VARIÁVEIS DE AMBIENTE NECESSÁRIAS:
 * - INSTAGRAM_ACCESS_TOKEN: Token de acesso de longa duração
 * - INSTAGRAM_BUSINESS_ACCOUNT_ID: ID da conta Instagram Business
 * - FACEBOOK_PAGE_ID: ID da página do Facebook conectada
 * 
 * DOCUMENTAÇÃO:
 * https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */

type InstagramMediaType = "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"

type CreateMediaContainerParams = {
  imageUrl: string
  caption?: string
  mediaType?: InstagramMediaType
}

type PublishMediaParams = {
  containerId: string
}

type InstagramApiResponse = {
  id?: string
  error?: {
    message: string
    code: number
    error_subcode?: number
  }
}

const INSTAGRAM_GRAPH_API_URL = "https://graph.facebook.com/v19.0"

/**
 * Verifica se a integração com Instagram está configurada
 */
export function isInstagramConfigured(): boolean {
  return !!(
    process.env.INSTAGRAM_ACCESS_TOKEN &&
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  )
}

/**
 * Cria um container de mídia (primeiro passo para publicar)
 * O Instagram processa a imagem de forma assíncrona
 */
export async function createMediaContainer({
  imageUrl,
  caption,
  mediaType = "IMAGE",
}: CreateMediaContainerParams): Promise<{ containerId: string } | { error: string }> {
  if (!isInstagramConfigured()) {
    return { error: "Instagram não está configurado. Configure as variáveis de ambiente." }
  }

  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  try {
    const params = new URLSearchParams({
      image_url: imageUrl,
      access_token: accessToken!,
    })

    if (caption) {
      params.append("caption", caption)
    }

    if (mediaType !== "IMAGE") {
      params.append("media_type", mediaType)
    }

    const response = await fetch(`${INSTAGRAM_GRAPH_API_URL}/${accountId}/media`, {
      method: "POST",
      body: params,
    })

    const data: InstagramApiResponse = await response.json()

    if (data.error) {
      console.error("Instagram API Error:", data.error)
      return { error: data.error.message }
    }

    if (!data.id) {
      return { error: "Falha ao criar container de mídia" }
    }

    return { containerId: data.id }
  } catch (error) {
    console.error("Instagram createMediaContainer error:", error)
    return { error: "Erro de conexão com a API do Instagram" }
  }
}

/**
 * Verifica o status do container de mídia
 * O Instagram pode levar alguns segundos para processar a imagem
 */
export async function checkMediaStatus(containerId: string): Promise<"IN_PROGRESS" | "FINISHED" | "ERROR"> {
  if (!isInstagramConfigured()) {
    return "ERROR"
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  try {
    const response = await fetch(
      `${INSTAGRAM_GRAPH_API_URL}/${containerId}?fields=status_code&access_token=${accessToken}`
    )

    const data = await response.json()

    if (data.status_code === "FINISHED") {
      return "FINISHED"
    } else if (data.status_code === "IN_PROGRESS") {
      return "IN_PROGRESS"
    }

    return "ERROR"
  } catch {
    return "ERROR"
  }
}

/**
 * Publica o container de mídia (segundo passo)
 * Só deve ser chamado após o container estar com status FINISHED
 */
export async function publishMedia({
  containerId,
}: PublishMediaParams): Promise<{ mediaId: string } | { error: string }> {
  if (!isInstagramConfigured()) {
    return { error: "Instagram não está configurado. Configure as variáveis de ambiente." }
  }

  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN

  try {
    const params = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken!,
    })

    const response = await fetch(`${INSTAGRAM_GRAPH_API_URL}/${accountId}/media_publish`, {
      method: "POST",
      body: params,
    })

    const data: InstagramApiResponse = await response.json()

    if (data.error) {
      console.error("Instagram API Error:", data.error)
      return { error: data.error.message }
    }

    if (!data.id) {
      return { error: "Falha ao publicar mídia" }
    }

    return { mediaId: data.id }
  } catch (error) {
    console.error("Instagram publishMedia error:", error)
    return { error: "Erro de conexão com a API do Instagram" }
  }
}

/**
 * Função completa para publicar uma imagem no Instagram
 * Faz todo o fluxo: criar container -> aguardar processamento -> publicar
 */
export async function publishToInstagram(
  imageUrl: string,
  caption: string
): Promise<{ success: true; mediaId: string } | { success: false; error: string }> {
  // 1. Criar container
  const containerResult = await createMediaContainer({ imageUrl, caption })
  
  if ("error" in containerResult) {
    return { success: false, error: containerResult.error }
  }

  // 2. Aguardar processamento (máximo 30 segundos)
  let status: "IN_PROGRESS" | "FINISHED" | "ERROR" = "IN_PROGRESS"
  let attempts = 0
  const maxAttempts = 10

  while (status === "IN_PROGRESS" && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Aguarda 3 segundos
    status = await checkMediaStatus(containerResult.containerId)
    attempts++
  }

  if (status !== "FINISHED") {
    return { success: false, error: "Tempo limite excedido no processamento da imagem" }
  }

  // 3. Publicar
  const publishResult = await publishMedia({ containerId: containerResult.containerId })

  if ("error" in publishResult) {
    return { success: false, error: publishResult.error }
  }

  return { success: true, mediaId: publishResult.mediaId }
}
