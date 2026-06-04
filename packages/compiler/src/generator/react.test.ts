import { describe, it, expect } from "vitest"
import { lexer } from "../lexer.js"
import { parser } from "../parser.js"
import { gerarReact } from "./react.js"

function compilar(entrada: string): string {
  const tokens = lexer(entrada)
  const ast = parser(tokens)
  return gerarReact(ast)
}

describe("Code Generator - React", () => {
  it("gera componente de página com título", () => {
    const resultado = compilar('pagina Inicio { titulo "Bem-vindo" }')
    expect(resultado).toContain("export default function Inicio()")
    expect(resultado).toContain("<h1>Bem-vindo</h1>")
  })

  it("gera página com texto", () => {
    const resultado = compilar('pagina Sobre { texto "Olá mundo" }')
    expect(resultado).toContain("<p>Olá mundo</p>")
  })

  it("gera página com botão", () => {
    const resultado = compilar('pagina Home { botao { texto "Clica" } }')
    expect(resultado).toContain("<button>Clica</button>")
  })

  it("gera página com entrada", () => {
    const resultado = compilar("pagina Form { entrada email }")
    expect(resultado).toContain('<input type="email" />')
  })

  it("gera página com imagem", () => {
    const resultado = compilar('pagina Galeria { imagem { origem "/img.png" } }')
    expect(resultado).toContain('<img src="/img.png" />')
  })

  it("gera função", () => {
    const resultado = compilar("funcao somar(a, b) { retornar 42 }")
    expect(resultado).toContain("function somar(a, b) {")
  })

  it("gera condicional se/senao", () => {
    const resultado = compilar(
      'se logado { texto "OK" } senao { texto "Login" }',
    )
    expect(resultado).toContain("if (logado)")
    expect(resultado).toContain("else")
  })

  it("gera ciclo para cada", () => {
    const resultado = compilar(
      'para cada item em produtos { titulo "Item" }',
    )
    expect(resultado).toContain("produtos.map")
    expect(resultado).toContain("(item) =>")
  })

  it("gera modelo Prisma", () => {
    const resultado = compilar("modelo Utilizador { nome texto unico idade numero }")
    expect(resultado).toContain("model Utilizador {")
    expect(resultado).toContain("nome String @unique")
    expect(resultado).toContain("idade Int")
  })

  it("escapa HTML em strings", () => {
    const resultado = compilar('pagina Teste { texto "Texto <script>" }')
    expect(resultado).toContain("&lt;script&gt;")
    expect(resultado).not.toContain("<script>")
  })

  it("gera rota com métodos separados", () => {
    const resultado = compilar('rota "/api/user" { obter { } criar { } }')
    expect(resultado).toContain("// Rota: /api/user")
    expect(resultado).toContain("export async function GET(")
    expect(resultado).toContain("export async function POST(")
    expect(resultado).not.toContain("OBTER, CRIAR")
  })

  it("gera retornar com aspas nas strings", () => {
    const resultado = compilar('funcao saudacao(nome) { retornar "Olá " + nome }')
    expect(resultado).toContain('return "Olá " + nome')
  })

  it("gera retornar com número puro", () => {
    const resultado = compilar("funcao soma() { retornar 42 }")
    expect(resultado).toContain("return 42")
  })

  it("gera linha com className flex", () => {
    const resultado = compilar('pagina Home { linha { titulo "A" } }')
    expect(resultado).toContain('className="flex gap-4"')
  })

  it("gera coluna com className flex-col", () => {
    const resultado = compilar('pagina Home { coluna { texto "A" } }')
    expect(resultado).toContain('className="flex flex-col gap-4"')
  })

  it("gera cartao com classes tailwind", () => {
    const resultado = compilar('pagina Home { cartao { texto "A" } }')
    expect(resultado).toContain("card")
    expect(resultado).toContain("rounded-xl")
    expect(resultado).toContain("shadow-md")
  })

  // ─── Novas estruturas de controlo ───

  it("gera senao se (else if)", () => {
    const resultado = compilar('se a > 0 { texto "Pos" } senao se a < 0 { texto "Neg" } senao { texto "Zero" }')
    expect(resultado).toContain("if (a > 0)")
    expect(resultado).toContain("else if (a < 0)")
    expect(resultado).toContain("else {")
  })

  it("gera enquanto", () => {
    const resultado = compilar('enquanto verdadeiro { texto "Loop" }')
    expect(resultado).toContain("while (true)")
  })

  it("gera escolher/caso/padrao", () => {
    const resultado = compilar('escolher (x) { caso 1 { texto "Um" } padrao { texto "Outro" } }')
    expect(resultado).toContain("switch (x)")
    expect(resultado).toContain("case 1:")
    expect(resultado).toContain("break")
    expect(resultado).toContain("default:")
  })

  it("gera para numerico", () => {
    const resultado = compilar('para i = 0 ate 10 { texto "Loop" }')
    expect(resultado).toContain("for (let i = 0; i <= 10; i += 1)")
  })

  it("gera para numerico com passo", () => {
    const resultado = compilar('para i = 0 ate 10 passo 2 { texto "Loop" }')
    expect(resultado).toContain("for (let i = 0; i <= 10; i += 2)")
  })

  it("gera declaracao de variavel", () => {
    const resultado = compilar('var nome = "Joao"')
    expect(resultado).toContain('let nome = "Joao"')
  })

  it("gera atribuicao", () => {
    const resultado = compilar('funcao teste() { x = 42 }')
    expect(resultado).toContain("x = 42")
  })
})
