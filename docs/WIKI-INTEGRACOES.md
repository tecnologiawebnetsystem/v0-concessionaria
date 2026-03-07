# Wiki de Integracoes

Este documento detalha as integracoes implementadas no sistema de concessionaria.

---

## 1. Integracao Instagram - Compartilhamento de Veiculos

### Visao Geral

A integracao com o Instagram permite compartilhar veiculos diretamente do painel administrativo, gerando imagens otimizadas (1080x1080) e legendas prontas para publicacao.

### Arquivos Criados/Modificados

| Arquivo | Descricao |
|---------|-----------|
| `components/admin/vehicles/instagram-share-dialog.tsx` | Componente principal do dialog de compartilhamento |
| `lib/instagram.ts` | Biblioteca para futura integracao com API do Instagram |
| `app/api/admin/vehicles/instagram-image/route.ts` | API para geracao de imagem (backup server-side) |
| `components/admin/vehicles/vehicles-table.tsx` | Tabela de veiculos com botao Instagram adicionado |
| `app/admin/vehicles/page.tsx` | Query atualizada para incluir imagem principal |

---

### Componente: InstagramShareDialog

**Localizacao:** `components/admin/vehicles/instagram-share-dialog.tsx`

#### Props

```typescript
interface InstagramShareDialogProps {
  vehicle: {
    id: string
    name: string
    model?: string
    year: number
    price: number
    mileage?: number
    color?: string
    fuel_type?: string
    transmission?: string
    description?: string
    brand_name?: string
    category_name?: string
    image_url?: string | null
  }
  trigger: React.ReactNode  // Botao que abre o dialog
}
```

#### Funcionalidades

1. **Geracao de Imagem (Canvas)**
   - Cria imagem 1080x1080 pixels (formato ideal para feed do Instagram)
   - Carrega a foto do veiculo como background
   - Aplica overlay escuro gradiente na parte inferior
   - Adiciona badge "DISPONIVEL" em vermelho
   - Exibe nome do veiculo, especificacoes e preco
   - Inclui CTA "Link na bio"

2. **Geracao de Legenda**
   - Gera automaticamente legenda com:
     - Nome completo do veiculo (marca + modelo)
     - Preco formatado em reais
     - Especificacoes (ano, km, combustivel, cambio, cor)
     - Descricao do veiculo (se houver)
     - Hashtags relevantes automaticas
     - CTA direcionando para link na bio

3. **Acoes Disponiveis**
   - Baixar imagem gerada (formato JPEG)
   - Copiar legenda para area de transferencia
   - Regenerar imagem com novos parametros

#### Fluxo de Uso

```
1. Usuario clica no icone do Instagram na tabela de veiculos
2. Dialog abre com preview do veiculo
3. Usuario clica em "Gerar Imagem para Instagram"
4. Sistema gera imagem usando Canvas API no navegador
5. Usuario pode baixar a imagem e copiar a legenda
6. Usuario posta manualmente no Instagram
```

#### Codigo de Geracao de Imagem

```typescript
async function handleGenerateImage() {
  // Cria canvas 1080x1080
  const canvas = document.createElement("canvas")
  canvas.width = 1080
  canvas.height = 1080
  const ctx = canvas.getContext("2d")

  // Background gradiente escuro
  const gradient = ctx.createLinearGradient(0, 0, 0, 1080)
  gradient.addColorStop(0, "#1f2937")
  gradient.addColorStop(1, "#111827")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1080, 1080)

  // Carrega e desenha imagem do veiculo
  if (vehicle.image_url) {
    const img = new Image()
    img.crossOrigin = "anonymous"
    await new Promise((resolve) => {
      img.onload = resolve
      img.src = vehicle.image_url
    })
    // Centraliza e cobre todo o canvas
    const scale = Math.max(1080 / img.width, 1080 / img.height)
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
  }

  // Overlay gradiente para legibilidade do texto
  const overlayGradient = ctx.createLinearGradient(0, 500, 0, 1080)
  overlayGradient.addColorStop(0, "rgba(0,0,0,0)")
  overlayGradient.addColorStop(1, "rgba(0,0,0,0.95)")
  ctx.fillStyle = overlayGradient
  ctx.fillRect(0, 0, 1080, 1080)

  // Badge, textos e preco...
  // Converte para blob e gera URL
  const blob = await canvas.toBlob()
  const url = URL.createObjectURL(blob)
}
```

---

### Biblioteca: Instagram API (Futura Integracao)

**Localizacao:** `lib/instagram.ts`

Esta biblioteca esta preparada para quando voce obtiver aprovacao do Meta para publicacao automatica.

#### Configuracao Necessaria

```typescript
// Variaveis de ambiente necessarias (configurar em Admin > Configuracoes > Integracoes)
INSTAGRAM_ACCESS_TOKEN     // Token de acesso do Instagram Graph API
INSTAGRAM_BUSINESS_ACCOUNT_ID  // ID da conta business do Instagram
```

#### Funcoes Disponiveis

| Funcao | Descricao |
|--------|-----------|
| `getInstagramConfig()` | Busca configuracoes do banco de dados |
| `isInstagramConfigured()` | Verifica se as credenciais estao configuradas |
| `createMediaContainer()` | Cria container de midia para publicacao |
| `publishMedia()` | Publica a midia no feed |
| `publishToInstagram()` | Funcao completa que faz upload e publica |
| `generateVehicleCaption()` | Gera legenda formatada para o veiculo |

#### Fluxo de Publicacao Automatica (Quando Aprovado)

```
1. Upload da imagem para URL publica (ex: Vercel Blob)
2. Criar container de midia via Instagram Graph API
3. Aguardar processamento do container
4. Publicar o container no feed
```

#### Requisitos para Aprovacao do Meta

1. Conta Instagram Business ou Creator
2. Pagina do Facebook vinculada
3. Facebook App criado em developers.facebook.com
4. Permissoes solicitadas:
   - `instagram_basic`
   - `instagram_content_publish`
5. Envio para revisao do Meta (2-6 semanas)

---

### Integracao na Tabela de Veiculos

**Localizacao:** `components/admin/vehicles/vehicles-table.tsx`

```tsx
// Import adicionado
import { InstagramShareDialog } from "./instagram-share-dialog"

// Botao adicionado na coluna de acoes
<InstagramShareDialog
  vehicle={{
    id: vehicle.id,
    name: vehicle.name,
    model: vehicle.model,
    year: vehicle.year,
    price: Number(vehicle.price),
    mileage: vehicle.mileage ? Number(vehicle.mileage) : undefined,
    color: vehicle.color,
    fuel_type: vehicle.fuel_type,
    transmission: vehicle.transmission,
    description: vehicle.description,
    brand_name: vehicle.brand_name,
    category_name: vehicle.category_name,
    image_url: vehicle.primary_image_url,
  }}
  trigger={
    <Button variant="ghost" size="sm" title="Compartilhar no Instagram">
      <Instagram className="size-4 text-pink-600" />
    </Button>
  }
/>
```

### Query Atualizada

**Localizacao:** `app/admin/vehicles/page.tsx`

```sql
SELECT v.*, b.name as brand_name, c.name as category_name,
  (SELECT COUNT(*) FROM vehicle_images WHERE vehicle_id = v.id) as image_count,
  (SELECT url FROM vehicle_images 
   WHERE vehicle_id = v.id 
   ORDER BY is_primary DESC, display_order ASC 
   LIMIT 1) as primary_image_url
FROM vehicles v
LEFT JOIN brands b ON v.brand_id = b.id
LEFT JOIN vehicle_categories c ON v.category_id = c.id
ORDER BY v.created_at DESC
```

---

## 2. Integracao ViaCEP - Busca Automatica de Endereco

### Visao Geral

A integracao com a API ViaCEP permite buscar automaticamente o endereco completo ao digitar um CEP, preenchendo campos como logradouro, bairro, cidade e estado.

### Arquivos Criados/Modificados

| Arquivo | Descricao |
|---------|-----------|
| `components/ui/cep-input.tsx` | Componente reutilizavel de input de CEP |
| `app/seller/profile/page.tsx` | Perfil do vendedor com CEP integrado |

---

### Componente: CepInput

**Localizacao:** `components/ui/cep-input.tsx`

#### Props

```typescript
interface CepInputProps {
  defaultValue?: string           // Valor inicial do CEP
  onAddressFound?: (address: {    // Callback quando endereco e encontrado
    cep: string
    street: string
    neighborhood: string
    city: string
    state: string
    complement?: string
  }) => void
  onError?: (error: string) => void  // Callback em caso de erro
  showAddressPreview?: boolean       // Exibir preview do endereco encontrado
  disabled?: boolean                 // Desabilitar input
  required?: boolean                 // Campo obrigatorio
  className?: string                 // Classes CSS adicionais
}
```

#### Funcionalidades

1. **Mascara Automatica**
   - Formata o CEP no padrao brasileiro: `00000-000`
   - Remove caracteres nao numericos automaticamente

2. **Busca Automatica**
   - Inicia busca automaticamente ao completar 8 digitos
   - Indicador de carregamento durante a busca
   - Tratamento de erros (CEP invalido, nao encontrado)

3. **Preview de Endereco**
   - Exibe card com endereco encontrado (opcional)
   - Mostra logradouro, bairro, cidade e estado

4. **Estados Visuais**
   - Loading: Spinner durante busca
   - Sucesso: Borda verde + icone de check
   - Erro: Borda vermelha + mensagem de erro

#### API Utilizada

```
GET https://viacep.com.br/ws/{cep}/json/
```

**Exemplo de Resposta:**
```json
{
  "cep": "12345-678",
  "logradouro": "Rua das Flores",
  "complemento": "",
  "bairro": "Centro",
  "localidade": "Sao Jose dos Campos",
  "uf": "SP",
  "ibge": "3549904",
  "gia": "6452",
  "ddd": "12",
  "siafi": "7099"
}
```

#### Codigo Principal

```typescript
async function fetchAddress(cep: string) {
  setLoading(true)
  setError(null)
  setAddress(null)

  try {
    // Remove caracteres nao numericos
    const cleanCep = cep.replace(/\D/g, "")
    
    if (cleanCep.length !== 8) {
      throw new Error("CEP deve ter 8 digitos")
    }

    const response = await fetch(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    )
    
    if (!response.ok) {
      throw new Error("Erro ao buscar CEP")
    }

    const data = await response.json()

    if (data.erro) {
      throw new Error("CEP nao encontrado")
    }

    const addressData = {
      cep: data.cep,
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
      complement: data.complemento,
    }

    setAddress(addressData)
    onAddressFound?.(addressData)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro ao buscar CEP"
    setError(message)
    onError?.(message)
  } finally {
    setLoading(false)
  }
}
```

#### Mascara de CEP

```typescript
function formatCep(value: string): string {
  // Remove tudo que nao e numero
  const numbers = value.replace(/\D/g, "")
  
  // Limita a 8 digitos
  const limited = numbers.slice(0, 8)
  
  // Aplica mascara 00000-000
  if (limited.length > 5) {
    return `${limited.slice(0, 5)}-${limited.slice(5)}`
  }
  
  return limited
}
```

---

### Exemplo de Uso

```tsx
import { CepInput } from "@/components/ui/cep-input"

function MeuFormulario() {
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    cidade: "",
    estado: "",
  })

  const handleCepFound = (address) => {
    setEndereco({
      cep: address.cep,
      logradouro: address.street,
      cidade: address.city,
      estado: address.state,
    })
  }

  return (
    <form>
      <CepInput
        defaultValue={endereco.cep}
        onAddressFound={handleCepFound}
        showAddressPreview={true}
      />
      
      <input 
        value={endereco.logradouro} 
        onChange={(e) => setEndereco(prev => ({ 
          ...prev, 
          logradouro: e.target.value 
        }))}
        placeholder="Logradouro"
      />
      
      <input 
        value={endereco.cidade} 
        readOnly 
        placeholder="Cidade"
      />
      
      <input 
        value={endereco.estado} 
        readOnly 
        placeholder="Estado"
      />
    </form>
  )
}
```

---

### Integracao no Perfil do Vendedor

**Localizacao:** `app/seller/profile/page.tsx`

```tsx
// Import adicionado
import { CepInput } from "@/components/ui/cep-input"

// Handler para atualizar formulario quando CEP e encontrado
const handleCepFound = (address) => {
  setForm((prev) => ({
    ...prev,
    zip_code: address.cep,
    address: address.street || prev.address,
    city: address.city,
    state: address.state,
  }))
}

// Componente no formulario
<CepInput
  defaultValue={form.zip_code}
  onAddressFound={handleCepFound}
  showAddressPreview={true}
/>
```

---

## Proximos Passos

### Instagram
1. Criar conta em [developers.facebook.com](https://developers.facebook.com)
2. Criar Facebook App do tipo "Business"
3. Adicionar produto "Instagram Graph API"
4. Conectar pagina do Facebook e conta Instagram Business
5. Solicitar permissoes e enviar para revisao
6. Apos aprovacao, configurar tokens em Admin > Configuracoes > Integracoes

### ViaCEP
- Integracao ja esta funcional e pronta para uso
- Pode ser adicionada em outros formularios do sistema conforme necessario
- Nao requer configuracao adicional (API publica e gratuita)

---

## Suporte

Para duvidas ou problemas com as integracoes, verifique:
1. Console do navegador para erros de JavaScript
2. Aba Network para falhas de requisicao
3. Logs do servidor para erros de API
