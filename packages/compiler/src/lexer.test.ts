import { describe, it, expect } from "vitest"
import { lexer } from "./lexer.js"

describe("Lexer Portugol", () => {
  it("reconhece palavra-chave 'pagina'", () => {
    const tokens = lexer("pagina Inicio { }")
    expect(tokens[0].type).toBe("PAGINA")
    expect(tokens[1].type).toBe("IDENT")
    expect(tokens[1].value).toBe("Inicio")
  })

  it("reconhece strings com conteúdo", () => {
    const tokens = lexer('titulo "Olá Mundo"')
    expect(tokens[0].type).toBe("TITULO")
    expect(tokens[1].type).toBe("STRING")
    expect(tokens[1].value).toBe("Olá Mundo")
  })

  it("reconhece chaves e parênteses", () => {
    const tokens = lexer("funcao somar(a, b) { }")
    expect(tokens[0].type).toBe("FUNCAO")
    expect(tokens[2].type).toBe("LPAREN")
    expect(tokens[4].type).toBe("COMMA")
    expect(tokens[6].type).toBe("RPAREN")
    expect(tokens[7].type).toBe("LBRACE")
    expect(tokens[8].type).toBe("RBRACE")
  })

  it("reporta linha e coluna correctamente", () => {
    const tokens = lexer("pagina\n  titulo")
    expect(tokens[0].linha).toBe(1)
    expect(tokens[0].coluna).toBe(1)
    expect(tokens[1].linha).toBe(2)
    expect(tokens[1].coluna).toBe(3)
  })

  it("ignora comentários (#)", () => {
    const tokens = lexer("pagina # isto é um comentário\n Inicio { }")
    expect(tokens[0].type).toBe("PAGINA")
    expect(tokens[1].type).toBe("IDENT")
    expect(tokens[1].value).toBe("Inicio")
  })

  it("reconhece números", () => {
    const tokens = lexer("entrada 42")
    expect(tokens[0].type).toBe("ENTRADA")
    expect(tokens[1].type).toBe("NUMERO")
    expect(tokens[1].value).toBe("42")
  })

  it("reconhece palavras acentuadas em português", () => {
    const tokens = lexer("funcao configuração( ) { }")
    expect(tokens[0].type).toBe("FUNCAO")
    expect(tokens[1].type).toBe("IDENT")
    expect(tokens[1].value).toBe("configuração")
  })

  it("produz token EOF no final", () => {
    const tokens = lexer(" ")
    expect(tokens.length).toBe(1)
    expect(tokens[0].type).toBe("EOF")
  })

  it("marca erro para carácter inválido", () => {
    const tokens = lexer("pagina @")
    expect(tokens.some((t) => t.type === "ERRO")).toBe(true)
  })

  // ─── MVP Landing Page ───

  it("reconhece palavra-chave 'secao'", () => {
    const tokens = lexer("secao Hero { }")
    expect(tokens[0].type).toBe("SECAO")
    expect(tokens[1].type).toBe("IDENT")
    expect(tokens[1].value).toBe("Hero")
  })

  it("reconhece palavra-chave 'grade'", () => {
    const tokens = lexer("grade 3 { }")
    expect(tokens[0].type).toBe("GRADE")
    expect(tokens[1].type).toBe("NUMERO")
    expect(tokens[1].value).toBe("3")
  })

  it("reconhece palavra-chave 'espacador'", () => {
    const tokens = lexer("espacador 40")
    expect(tokens[0].type).toBe("ESPACADOR")
    expect(tokens[1].type).toBe("NUMERO")
    expect(tokens[1].value).toBe("40")
  })

  it("reconhece números com %", () => {
    const tokens = lexer("100%")
    expect(tokens[0].type).toBe("NUMERO")
    expect(tokens[0].value).toBe("100%")
  })

  it("reconhece número decimal com %", () => {
    const tokens = lexer("50.5%")
    expect(tokens[0].type).toBe("NUMERO")
    expect(tokens[0].value).toBe("50.5%")
  })
})
