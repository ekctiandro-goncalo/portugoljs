import { describe, it, expect } from "vitest"
import { parser } from "./parser.js"
import { lexer } from "./lexer.js"

function parse(entrada: string) {
  return parser(lexer(entrada))
}

describe("Parser Portugol", () => {
  it("parseia pagina com titulo", () => {
    const ast = parse('pagina Inicio { titulo "Bem-vindo" }')
    expect(ast).toHaveLength(1)
    const titulo = (ast[0] as any).corpo[0]
    expect(titulo.tipo).toBe("Titulo")
    expect(titulo.valor).toMatchObject({ tipo: "Str", valor: "Bem-vindo" })
  })

  it("parseia pagina com texto", () => {
    const ast = parse('pagina Sobre { texto "Olá mundo" }')
    const texto = (ast[0] as any).corpo[0]
    expect(texto.tipo).toBe("Texto")
    expect(texto.valor).toMatchObject({ tipo: "Str", valor: "Olá mundo" })
  })

  it("parseia botao com label", () => {
    const ast = parse('pagina Home { botao { texto "Clica aqui" } }')
    const botao = (ast[0] as any).corpo[0]
    expect(botao.tipo).toBe("Botao")
    expect(botao.label).toBe("Clica aqui")
  })

  it("parseia entrada de email", () => {
    const ast = parse("pagina Form { entrada email }")
    const entrada = (ast[0] as any).corpo[0]
    expect(entrada.tipo).toBe("Entrada")
    expect(entrada.tipoInput).toBe("email")
  })

  it("parseia funcao com parametros", () => {
    const ast = parse("funcao somar(a, b) { retornar 42 }")
    expect(ast[0]).toMatchObject({
      tipo: "Funcao",
      nome: "somar",
      params: ["a", "b"],
    })
  })

  it("parseia se/senao", () => {
    const ast = parse('se logado { texto "OK" } senao { texto "Login" }')
    expect(ast[0].tipo).toBe("Se")
    const se = ast[0] as any
    expect(se.condicao).toMatchObject({ tipo: "Ident", nome: "logado" })
    expect(se.entao).toHaveLength(1)
    expect(se.senao).toHaveLength(1)
  })

  it("parseia para cada", () => {
    const ast = parse('para cada item em produtos { titulo "Item" }')
    expect(ast[0].tipo).toBe("ParaCada")
    const pc = ast[0] as any
    expect(pc.variavel).toBe("item")
    expect(pc.colecao).toBe("produtos")
    expect(pc.corpo).toHaveLength(1)
  })

  it("parseia modelo com campos", () => {
    const ast = parse("modelo Utilizador { nome texto unico email texto }")
    expect(ast[0].tipo).toBe("Modelo")
    const modelo = ast[0] as any
    expect(modelo.nome).toBe("Utilizador")
    expect(modelo.campos).toHaveLength(2)
    expect(modelo.campos[0].nome).toBe("nome")
    expect(modelo.campos[0].tipo).toBe("texto")
    expect(modelo.campos[0].modificadores).toContain("unico")
  })

  it("parseia rota com metodos", () => {
    const ast = parse('rota "/api/user" { obter { } criar { } }')
    expect(ast[0].tipo).toBe("Rota")
    const rota = ast[0] as any
    expect(rota.caminho).toBe("/api/user")
    expect(rota.metodos).toHaveLength(2)
    expect(rota.metodos[0].tipo).toBe("obter")
  })

  it("parseia imagem com origem", () => {
    const ast = parse('pagina Galeria { imagem { origem "/img.png" } }')
    const imagem = (ast[0] as any).corpo[0]
    expect(imagem.tipo).toBe("Imagem")
    expect(imagem.origem).toBe("/img.png")
  })

  it("parseia paginas multiplas", () => {
    const ast = parse(
      'pagina Home { titulo "Home" } pagina About { texto "About" }',
    )
    expect(ast).toHaveLength(2)
    expect(ast[0]).toMatchObject({ tipo: "Pagina", nome: "Home" })
    expect(ast[1]).toMatchObject({ tipo: "Pagina", nome: "About" })
  })

  it("lança erro para token inesperado", () => {
    expect(() => parse("pagina { }")).toThrow("Linha 1")
  })

  // ─── Testes de Expressões ───

  it("parseia expressão aritmética", () => {
    const ast = parse('funcao calc() { retornar 1 + 2 * 3 }')
    const ret = (ast[0] as any).corpo[0].valor
    expect(ret.tipo).toBe("Binaria")
    expect(ret.oper).toBe("+")
    expect(ret.esq.tipo).toBe("Num")
    expect(ret.dir.oper).toBe("*")
  })

  it("parseia expressão com parênteses", () => {
    const ast = parse('funcao calc() { retornar (1 + 2) * 3 }')
    const ret = (ast[0] as any).corpo[0].valor
    expect(ret.tipo).toBe("Binaria")
    expect(ret.oper).toBe("*")
    expect(ret.esq.tipo).toBe("Binaria")
    expect(ret.esq.oper).toBe("+")
  })

  it("parseia expressão de comparação", () => {
    const ast = parse('se idade >= 18 { titulo "Maior" }')
    const se = ast[0] as any
    expect(se.condicao.tipo).toBe("Binaria")
    expect(se.condicao.oper).toBe(">=")
    expect(se.condicao.esq).toMatchObject({ tipo: "Ident", nome: "idade" })
    expect(se.condicao.dir).toMatchObject({ tipo: "Num", valor: "18" })
  })

  it("parseia expressão lógica (e / ou)", () => {
    const ast = parse('se logado e admin ou owner { }')
    const cond = (ast[0] as any).condicao
    expect(cond.tipo).toBe("Binaria")
  })

  it("parseia negação (nao)", () => {
    const ast = parse('se nao logado { }')
    const cond = (ast[0] as any).condicao
    expect(cond.tipo).toBe("Unaria")
    expect(cond.oper).toBe("!")
  })

  it("parseia string literal em expressão", () => {
    const ast = parse('funcao saudar(nome) { retornar "Olá " + nome }')
    const ret = (ast[0] as any).corpo[0].valor
    expect(ret.tipo).toBe("Binaria")
    expect(ret.oper).toBe("+")
    expect(ret.esq).toMatchObject({ tipo: "Str", valor: "Olá " })
    expect(ret.dir).toMatchObject({ tipo: "Ident", nome: "nome" })
  })

  it("parseia true/false", () => {
    const ast = parse('se verdadeiro { }')
    expect((ast[0] as any).condicao).toMatchObject({ tipo: "Bool", valor: true })
  })

  // ─── Testes de Layout ───

  it("parseia linha com filhos", () => {
    const ast = parse('pagina Home { linha { titulo "A" } }')
    const linha = (ast[0] as any).corpo[0]
    expect(linha.tipo).toBe("Linha")
    expect(linha.corpo).toHaveLength(1)
  })

  it("parseia coluna com filhos", () => {
    const ast = parse('pagina Home { coluna { titulo "A" texto "B" } }')
    const coluna = (ast[0] as any).corpo[0]
    expect(coluna.tipo).toBe("Coluna")
    expect(coluna.corpo).toHaveLength(2)
  })

  it("parseia cartao com filhos", () => {
    const ast = parse('pagina Home { cartao { titulo "Card" } }')
    const cartao = (ast[0] as any).corpo[0]
    expect(cartao.tipo).toBe("Cartao")
    expect(cartao.corpo).toHaveLength(1)
  })

  // ─── MVP Landing Page ───

  it("parseia secao sem nome", () => {
    const ast = parse('pagina Home { secao { titulo "Hero" } }')
    const secao = (ast[0] as any).corpo[0]
    expect(secao.tipo).toBe("Secao")
    expect(secao.nome).toBeUndefined()
    expect(secao.corpo).toHaveLength(1)
  })

  it("parseia secao com nome", () => {
    const ast = parse('pagina Home { secao Hero { titulo "Olá" } }')
    const secao = (ast[0] as any).corpo[0]
    expect(secao.tipo).toBe("Secao")
    expect(secao.nome).toBe("Hero")
  })

  it("parseia grade com número de colunas", () => {
    const ast = parse('pagina Home { grade 3 { cartao { titulo "A" } } }')
    const grade = (ast[0] as any).corpo[0]
    expect(grade.tipo).toBe("Grade")
    expect(grade.colunas).toBe(3)
    expect(grade.corpo).toHaveLength(1)
  })

  it("parseia grade sem número (default 3)", () => {
    const ast = parse('pagina Home { grade { cartao { titulo "A" } } }')
    const grade = (ast[0] as any).corpo[0]
    expect(grade.tipo).toBe("Grade")
    expect(grade.colunas).toBe(3)
  })

  it("parseia espacador com tamanho", () => {
    const ast = parse('pagina Home { espacador 40 }')
    const esp = (ast[0] as any).corpo[0]
    expect(esp.tipo).toBe("Espacador")
    expect(esp.tamanho).toBe("40")
  })

  it("parseia espacador sem tamanho (default 40)", () => {
    const ast = parse('pagina Home { espacador }')
    const esp = (ast[0] as any).corpo[0]
    expect(esp.tipo).toBe("Espacador")
    expect(esp.tamanho).toBe("40")
  })

  it("parseia estilos inline em secao", () => {
    const ast = parse('pagina Home { secao { padding 80 fundo "#f8f8f8" titulo "X" } }')
    const secao = (ast[0] as any).corpo[0]
    expect(secao.tipo).toBe("Secao")
    expect(secao.estilos).toBeDefined()
    expect(secao.estilos.padding).toBe("80")
    expect(secao.estilos.fundo).toBe("#f8f8f8")
    expect(secao.corpo).toHaveLength(1) // titulo
  })

  it("parseia estilos inline em cartao", () => {
    const ast = parse('pagina Home { cartao { fundo "#111" cor "#fff" titulo "X" } }')
    const cartao = (ast[0] as any).corpo[0]
    expect(cartao.estilos.fundo).toBe("#111")
    expect(cartao.estilos.cor).toBe("#fff")
    expect(cartao.corpo).toHaveLength(1) // titulo
  })

  it("parseia estilos inline em botao", () => {
    const ast = parse('pagina Home { botao { texto "OK" raio 30 fundo "#c8a96e" } }')
    const botao = (ast[0] as any).corpo[0]
    expect(botao.tipo).toBe("Botao")
    expect(botao.label).toBe("OK")
    expect(botao.estilos.raio).toBe("30")
    expect(botao.estilos.fundo).toBe("#c8a96e")
  })

  it("parseia centralizar como booleano", () => {
    const ast = parse('pagina Home { secao { centralizar titulo "X" } }')
    const secao = (ast[0] as any).corpo[0]
    expect(secao.estilos.centralizar).toBe(true)
  })

  it("parseia titulo em modo bloco com estilos", () => {
    const ast = parse('pagina Home { titulo { texto "Big" tamanho 72 peso 700 } }')
    const titulo = (ast[0] as any).corpo[0]
    expect(titulo.tipo).toBe("Titulo")
    expect(titulo.valor).toMatchObject({ tipo: "Str", valor: "Big" })
    expect(titulo.estilos.tamanho).toBe("72")
    expect(titulo.estilos.peso).toBe("700")
  })

  it("parseia texto em modo bloco com estilos", () => {
    const ast = parse('pagina Home { texto { "Subtítulo" cor "#555" } }')
    const texto = (ast[0] as any).corpo[0]
    expect(texto.tipo).toBe("Texto")
    expect(texto.valor).toMatchObject({ tipo: "Str", valor: "Subtítulo" })
    expect(texto.estilos.cor).toBe("#555")
  })
})
