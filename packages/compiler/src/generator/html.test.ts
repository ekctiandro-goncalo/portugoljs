import { describe, it, expect } from "vitest"
import { lexer } from "../lexer.js"
import { parser } from "../parser.js"
import { gerarHTML } from "./html.js"

function compilar(entrada: string) {
  const tokens = lexer(entrada)
  const ast = parser(tokens)
  return gerarHTML(ast)
}

describe("Gerador HTML", () => {
  it("gera documento HTML completo", () => {
    const { html } = compilar('pagina Inicio { titulo "Olá" }')
    expect(html).toContain("<!DOCTYPE html>")
    expect(html).toContain('<html lang="pt">')
    expect(html).toContain("<head>")
    expect(html).toContain("<body>")
    expect(html).toContain("</html>")
  })

  it("inclui Google Fonts (Cormorant Garamond + Inter)", () => {
    const { html } = compilar('pagina Inicio { titulo "Olá" }')
    expect(html).toContain("Cormorant+Garamond")
    expect(html).toContain("Inter")
    expect(html).toContain("fonts.googleapis.com")
  })

  it("usa o nome da página como título", () => {
    const { html } = compilar('pagina MeuSite { titulo "Olá" }')
    expect(html).toContain("<title>MeuSite</title>")
  })

  it("referencia styles.css externo", () => {
    const { html } = compilar('pagina Inicio { titulo "Olá" }')
    expect(html).toContain('rel="stylesheet"')
    expect(html).toContain('href="styles.css"')
  })

  // ─── Componentes ───

  it("gera titulo como h1", () => {
    const { html } = compilar('pagina Inicio { titulo "Bem-vindo" }')
    expect(html).toContain('<h1 class="titulo">Bem-vindo</h1>')
  })

  it("gera texto como p", () => {
    const { html } = compilar('pagina Inicio { texto "Olá mundo" }')
    expect(html).toContain('<p class="texto">Olá mundo</p>')
  })

  it("gera botao como button", () => {
    const { html } = compilar('pagina Inicio { botao { texto "Clica" } }')
    expect(html).toContain('<button class="botao">Clica</button>')
  })

  it("gera imagem como img", () => {
    const { html } = compilar('pagina Inicio { imagem { origem "/img.png" } }')
    expect(html).toContain('src="/img.png"')
    expect(html).toContain('class="imagem"')
  })

  it("gera secao como section", () => {
    const { html } = compilar('pagina Inicio { secao { titulo "Hero" } }')
    expect(html).toContain('<section class="secao">')
    expect(html).toContain("</section>")
  })

  it("gera secao com nome como classe", () => {
    const { html } = compilar('pagina Inicio { secao Hero { titulo "Olá" } }')
    expect(html).toContain('class="secao secao-hero"')
  })

  it("gera grade com N colunas", () => {
    const { html } = compilar('pagina Inicio { grade 3 { cartao { titulo "A" } } }')
    expect(html).toContain('class="grade grade-3"')
  })

  it("gera espacador com altura", () => {
    const { html } = compilar('pagina Inicio { espacador 40 }')
    expect(html).toContain('style="height: 40px"')
    expect(html).toContain('class="espacador"')
  })

  it("gera linha como div flex", () => {
    const { html } = compilar('pagina Inicio { linha { texto "A" } }')
    expect(html).toContain('class="linha"')
  })

  it("gera coluna como div flex-col", () => {
    const { html } = compilar('pagina Inicio { coluna { texto "A" } }')
    expect(html).toContain('class="coluna"')
  })

  it("gera cartao como div", () => {
    const { html } = compilar('pagina Inicio { cartao { titulo "Card" } }')
    expect(html).toContain('class="cartao"')
  })

  // ─── Estilos inline ───

  it("aplica cor como style inline", () => {
    const { html } = compilar('pagina Inicio { secao { cor "#ff0000" titulo "X" } }')
    expect(html).toContain('style="color: #ff0000"')
  })

  it("aplica fundo como style inline", () => {
    const { html } = compilar('pagina Inicio { cartao { fundo "#111" titulo "X" } }')
    expect(html).toContain("background: #111")
  })

  it("aplica padding com px automático", () => {
    const { html } = compilar('pagina Inicio { secao { padding 80 titulo "X" } }')
    expect(html).toContain("padding: 80px")
  })

  it("aplica centralizar como flex center", () => {
    const { html } = compilar('pagina Inicio { secao { centralizar titulo "X" } }')
    expect(html).toContain("justify-content: center")
    expect(html).toContain("align-items: center")
  })

  it("aplica raio com px automático", () => {
    const { html } = compilar('pagina Inicio { botao { texto "OK" raio 30 } }')
    expect(html).toContain("border-radius: 30px")
  })

  it("mantém valores com % sem adicionar px", () => {
    const { html } = compilar('pagina Inicio { secao { largura "100%" titulo "X" } }')
    expect(html).toContain("width: 100%")
    expect(html).not.toContain("100%px")
  })

  // ─── Titulo/Texto bloco ───

  it("gera titulo em modo bloco com estilos", () => {
    const { html } = compilar('pagina Inicio { titulo { texto "Big" tamanho 72 peso 700 } }')
    expect(html).toContain("Big")
    expect(html).toContain("font-size: 72px")
    expect(html).toContain("font-weight: 700")
  })

  it("gera titulo inline como antes", () => {
    const { html } = compilar('pagina Inicio { titulo "Hello" }')
    expect(html).toContain('<h1 class="titulo">Hello</h1>')
  })

  // ─── CSS ───

  it("gera CSS com variáveis de tema neutro", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain("--cor-fundo: #ffffff")
    expect(css).toContain("--cor-texto: #111111")
    expect(css).toContain("--cor-borda: #e5e5e5")
  })

  it("gera CSS com fontes Cormorant Garamond e Inter", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain("Cormorant Garamond")
    expect(css).toContain("Inter")
  })

  it("gera CSS com media queries responsivas", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain("@media (max-width: 768px)")
    expect(css).toContain("@media (max-width: 480px)")
  })

  it("gera CSS com classes de grade", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain(".grade-3")
    expect(css).toContain("grid-template-columns")
  })

  it("gera CSS com hover no cartão", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain(".cartao:hover")
    expect(css).toContain("translateY")
  })

  it("gera CSS com hover no botão", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain(".botao:hover")
  })

  it("gera CSS com responsividade de grade (1fr em mobile)", () => {
    const { css } = compilar('pagina Inicio { titulo "X" }')
    expect(css).toContain(".grade-3")
    // Em mobile deve colapsar para 1 coluna
    expect(css).toMatch(/grade.*\{[^}]*1fr/s)
  })

  // ─── Escaping ───

  it("escapa HTML em conteúdo", () => {
    const { html } = compilar('pagina Inicio { texto "Texto <script>" }')
    expect(html).toContain("&lt;script&gt;")
    expect(html).not.toContain("<script>")
  })
})
