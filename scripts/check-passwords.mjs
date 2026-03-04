import bcrypt from "bcryptjs"

const tests = [
  {
    email: "admin@nacionalveiculos.com.br",
    password: "admin123",
    hash: "$2b$10$p879/MD7l0jZii3U0EtqU.t1ZVC4yGl/gmM5qd33jlWk/bahAQW0e",
  },
  {
    email: "marcos.vendedor@nacionalveiculos.com.br",
    password: "senha123",
    hash: "$2b$10$sfvUuy7jU.Yqoenss2vaseNfFgZS2cgl6wtYKYBDWrlfzKBgzE.ga",
  },
  {
    email: "lucas.mendes@email.com",
    password: "senha123",
    hash: "$2b$10$sfvUuy7jU.Yqoenss2vaseNfFgZS2cgl6wtYKYBDWrlfzKBgzE.ga",
  },
]

for (const t of tests) {
  const ok = await bcrypt.compare(t.password, t.hash)
  console.log(`[v0] ${t.email} / "${t.password}" => ${ok ? "OK" : "FALHOU"}`)
}
