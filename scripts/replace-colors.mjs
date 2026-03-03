import fs from "fs"
import path from "path"
import { glob } from "glob"

// Mapeamento de substituições (ordem importa — mais específico primeiro)
const replacements = [
  // Gradientes blue→cyan para red
  ["from-blue-900 to-blue-700", "from-red-800 to-red-600"],
  ["from-blue-900 to-blue-800", "from-gray-900 to-red-900"],
  ["from-blue-800 to-blue-700", "from-red-800 to-red-700"],
  ["from-blue-600 to-indigo-600", "from-red-600 to-red-700"],
  ["from-blue-600 to-cyan-600", "from-red-600 to-red-700"],
  ["from-blue-500 to-cyan-500", "from-red-600 to-red-500"],
  ["from-blue-500 to-indigo-500", "from-red-600 to-red-500"],
  ["from-blue-700 to-indigo-700", "from-red-700 to-red-800"],
  ["hover:from-blue-700 hover:to-indigo-700", "hover:from-red-700 hover:to-red-800"],
  ["hover:from-blue-500 hover:to-cyan-500", "hover:from-red-500 hover:to-red-400"],
  ["to-blue-900", "to-gray-900"],
  ["to-blue-800", "to-red-900"],
  ["to-cyan-400", "to-red-400"],
  ["to-cyan-500", "to-red-500"],
  ["to-cyan-600", "to-red-600"],
  ["from-cyan-400", "from-red-400"],
  ["from-cyan-500", "from-red-500"],
  ["from-cyan-600", "from-red-600"],
  ["via-blue-900", "via-gray-900"],
  ["via-indigo-900", "via-red-950"],
  ["via-blue-600", "via-red-700"],

  // Slate → gray
  ["slate-950", "gray-950"],
  ["slate-900", "gray-900"],
  ["slate-800", "gray-800"],
  ["slate-700", "gray-700"],
  ["slate-600", "gray-600"],
  ["slate-500", "gray-500"],
  ["slate-400", "gray-400"],
  ["slate-300", "gray-300"],
  ["slate-200", "gray-200"],
  ["slate-100", "gray-100"],
  ["slate-50", "gray-50"],

  // Blue especificos → red
  ["bg-blue-950", "bg-gray-950"],
  ["bg-blue-900", "bg-gray-900"],
  ["bg-blue-800", "bg-red-900"],
  ["bg-blue-700", "bg-red-700"],
  ["bg-blue-600", "bg-red-600"],
  ["bg-blue-500", "bg-red-500"],
  ["bg-blue-100", "bg-red-100"],
  ["bg-blue-50", "bg-red-50"],
  ["bg-blue-500/10", "bg-red-500/10"],
  ["bg-blue-500/20", "bg-red-500/20"],
  ["bg-blue-600/10", "bg-red-600/10"],
  ["bg-blue-600/20", "bg-red-600/20"],
  ["bg-blue-400/20", "bg-red-400/20"],
  ["text-blue-950", "text-gray-950"],
  ["text-blue-900", "text-red-700"],
  ["text-blue-800", "text-red-700"],
  ["text-blue-700", "text-red-600"],
  ["text-blue-600", "text-red-600"],
  ["text-blue-500", "text-red-500"],
  ["text-blue-400", "text-red-400"],
  ["text-blue-300", "text-red-300"],
  ["text-blue-200", "text-red-200"],
  ["text-blue-100", "text-gray-100"],
  ["text-cyan-400", "text-red-400"],
  ["text-cyan-500", "text-red-500"],
  ["text-cyan-300", "text-red-300"],
  ["border-blue-900", "border-red-800"],
  ["border-blue-800", "border-red-800"],
  ["border-blue-700", "border-red-700"],
  ["border-blue-600", "border-red-600"],
  ["border-blue-500", "border-red-500"],
  ["border-blue-500/20", "border-red-500/20"],
  ["border-blue-500/30", "border-red-500/30"],
  ["border-blue-400/30", "border-red-400/30"],
  ["border-blue-300/30", "border-red-300/30"],
  ["border-blue-200", "border-red-200"],
  ["hover:bg-blue-900", "hover:bg-gray-900"],
  ["hover:bg-blue-800", "hover:bg-red-800"],
  ["hover:bg-blue-700", "hover:bg-red-700"],
  ["hover:bg-blue-600", "hover:bg-red-600"],
  ["hover:bg-blue-50", "hover:bg-red-50"],
  ["hover:text-blue-900", "hover:text-red-700"],
  ["hover:text-blue-800", "hover:text-red-700"],
  ["hover:text-blue-600", "hover:text-red-600"],
  ["hover:text-blue-400", "hover:text-red-400"],
  ["hover:text-blue-300", "hover:text-red-300"],
  ["hover:border-blue-500", "hover:border-red-500"],
  ["hover:border-blue-500/50", "hover:border-red-500/50"],
  ["focus:ring-blue-500", "focus:ring-red-500"],
  ["focus:border-blue-500", "focus:border-red-500"],
  ["ring-blue-500", "ring-red-500"],
  ["shadow-blue-500/10", "shadow-red-500/10"],
  ["shadow-blue-500/20", "shadow-red-500/20"],
  ["shadow-blue-500/25", "shadow-red-500/25"],
  ["shadow-blue-500/30", "shadow-red-500/30"],
  ["shadow-blue-600/25", "shadow-red-600/25"],
  ["shadow-blue-600/30", "shadow-red-600/30"],
  ["data-[state=active]:bg-blue-600", "data-[state=active]:bg-red-600"],
  ["data-[state=active]:text-blue-600", "data-[state=active]:text-red-600"],
  ["checked:bg-blue-600", "checked:bg-red-600"],

  // Indigo → red/gray
  ["bg-indigo-900", "bg-gray-900"],
  ["bg-indigo-800", "bg-red-900"],
  ["bg-indigo-600", "bg-red-600"],
  ["bg-indigo-500", "bg-red-500"],
  ["bg-indigo-100", "bg-red-100"],
  ["bg-indigo-50", "bg-red-50"],
  ["text-indigo-900", "text-red-700"],
  ["text-indigo-600", "text-red-600"],
  ["text-indigo-400", "text-red-400"],
  ["border-indigo-600", "border-red-600"],
  ["hover:bg-indigo-700", "hover:bg-red-700"],
  ["hover:to-indigo-700", "hover:to-red-700"],
  ["from-indigo-600", "from-red-600"],
  ["from-indigo-900", "from-gray-900"],
  ["via-indigo-600", "via-red-600"],

  // Violet/purple → red
  ["bg-violet-600", "bg-red-600"],
  ["bg-purple-600", "bg-red-600"],
  ["bg-purple-100", "bg-red-100"],
  ["text-violet-600", "text-red-600"],
  ["text-purple-600", "text-red-600"],
  ["from-violet-600", "from-red-600"],
  ["from-purple-600", "from-red-600"],
  ["to-violet-600", "to-red-600"],
  ["to-purple-600", "to-red-600"],

  // Nome da empresa em templates/seeds
  ["Nacional Veículos", "GT Veículos"],
  ["Nacional Veiculos", "GT Veículos"],
  ["nacional veículos", "gt veículos"],
  ["nacional veiculos", "gt veículos"],
  ["@nacionalveiculos.com.br", "@gtveiculos.com.br"],
  ["nacionalveiculos.com.br", "gtveiculos.com.br"],
]

const extensions = ["tsx", "ts", "jsx", "js", "css"]
const pattern = `**/*.{${extensions.join(",")}}`
const ignore = ["**/node_modules/**", "**/.next/**", "**/scripts/**"]

const files = await glob(pattern, { ignore, absolute: true })

let totalFiles = 0
let totalReplacements = 0

for (const file of files) {
  let content = fs.readFileSync(file, "utf8")
  let original = content
  let count = 0

  for (const [from, to] of replacements) {
    while (content.includes(from)) {
      content = content.replace(from, to)
      count++
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8")
    totalFiles++
    totalReplacements += count
    console.log(`[v0] Atualizado: ${path.relative("/vercel/share/v0-project", file)} (${count} substituições)`)
  }
}

console.log(`\n[v0] ✓ ${totalFiles} arquivo(s) atualizado(s) com ${totalReplacements} substituição(ões) no total.`)
