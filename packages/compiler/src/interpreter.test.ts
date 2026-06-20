import { describe, it, expect } from "vitest"
import { lexer } from "./lexer.js"
import { parser } from "./parser.js"
import { Interpreter } from "./interpreter.js"

function correr(codigo: string) {
  const ast = parser(lexer(codigo))
  return new Interpreter().executar(ast)
}

function textos(codigo: string) {
  return correr(codigo)
    .filter((l) => l.tipo === "texto")
    .map((l) => l.valor)
}

describe("Interpreter — básico", () => {
  it("var + texto imprime o valor", () => {
    expect(textos(`pagina T { var x = 5 texto x }`)).toEqual(["5"])
  })

  it("aritmética respeita precedência", () => {
    expect(textos(`pagina T { texto 2 + 3 * 4 }`)).toEqual(["14"])
  })

  it("concatenação de string com número", () => {
    expect(textos(`pagina T { var n = 3 texto "n=" + n }`)).toEqual(["n=3"])
  })
})

describe("Interpreter — se / senao se / senao", () => {
  it("entra no ramo 'se' quando verdadeiro", () => {
    expect(textos(`pagina T { se 1 == 1 { texto "a" } senao { texto "b" } }`)).toEqual(["a"])
  })

  it("entra no ramo 'senao' quando falso e não há senao-se", () => {
    expect(textos(`pagina T { se 1 == 2 { texto "a" } senao { texto "b" } }`)).toEqual(["b"])
  })

  it("REGRESSÃO: 'senao se' do meio é avaliado, não salta para o 'senao' final", () => {
    const codigo = `
      pagina T {
        var x = 7
        se x > 10 {
          texto "grande"
        } senao se x > 5 {
          texto "medio"
        } senao {
          texto "pequeno"
        }
      }
    `
    expect(textos(codigo)).toEqual(["medio"])
  })

  it("REGRESSÃO: cadeia com vários 'senao se', cai no correto", () => {
    const codigo = `
      pagina T {
        var nota = 6
        se nota >= 9 {
          texto "A"
        } senao se nota >= 7 {
          texto "B"
        } senao se nota >= 5 {
          texto "C"
        } senao {
          texto "D"
        }
      }
    `
    expect(textos(codigo)).toEqual(["C"])
  })

  it("cai no 'senao' final quando nenhuma condição bate", () => {
    const codigo = `
      pagina T {
        var x = 1
        se x > 10 { texto "a" } senao se x > 5 { texto "b" } senao { texto "c" }
      }
    `
    expect(textos(codigo)).toEqual(["c"])
  })
})

describe("Interpreter — funções (chamada)", () => {
  it("REGRESSÃO: função simples sem parâmetros é chamável", () => {
    const codigo = `
      pagina T {
        funcao ola() { retornar "ola" }
        texto ola()
      }
    `
    expect(textos(codigo)).toEqual(["ola"])
  })

  it("REGRESSÃO: função com parâmetros e retorno é chamável", () => {
    const codigo = `
      pagina T {
        funcao saudar(nome) { retornar "Ola " + nome }
        texto saudar("Mundo")
      }
    `
    expect(textos(codigo)).toEqual(["Ola Mundo"])
  })

  it("função com lógica interna (soma de dois parâmetros)", () => {
    const codigo = `
      pagina T {
        funcao somar(a, b) { retornar a + b }
        texto somar(2, 3)
      }
    `
    expect(textos(codigo)).toEqual(["5"])
  })

  it("chamar função não definida gera erro em vez de rebentar", () => {
    const saida = correr(`pagina T { texto naoexiste() }`)
    expect(saida.some((l) => l.tipo === "erro")).toBe(true)
  })

  it("chamar com número errado de argumentos gera erro", () => {
    const codigo = `
      pagina T {
        funcao somar(a, b) { retornar a + b }
        texto somar(1)
      }
    `
    const saida = correr(codigo)
    expect(saida.some((l) => l.tipo === "erro")).toBe(true)
  })
})

describe("Interpreter — loops", () => {
  it("para ... ate ... conta corretamente", () => {
    expect(textos(`pagina T { para i = 1 ate 3 { texto i } }`)).toEqual(["1", "2", "3"])
  })

  it("enquanto pára quando a condição deixa de ser verdadeira", () => {
    const codigo = `
      pagina T {
        var c = 1
        enquanto c <= 3 {
          texto c
          c = c + 1
        }
      }
    `
    expect(textos(codigo)).toEqual(["1", "2", "3"])
  })

  it("enquanto com loop infinito é cortado pelo limite de iterações", () => {
    const saida = correr(`pagina T { enquanto verdadeiro { texto "x" } }`)
    expect(saida.some((l) => l.tipo === "aviso")).toBe(true)
  })
})

describe("Interpreter — escolher/caso", () => {
  it("entra no caso certo", () => {
    const codigo = `
      pagina T {
        var dia = 3
        escolher (dia) {
          caso 1 { texto "Segunda" }
          caso 3 { texto "Quarta" }
          padrao { texto "Outro" }
        }
      }
    `
    expect(textos(codigo)).toEqual(["Quarta"])
  })

  it("cai no padrão quando nenhum caso bate", () => {
    const codigo = `
      pagina T {
        var dia = 9
        escolher (dia) {
          caso 1 { texto "Segunda" }
          padrao { texto "Outro" }
        }
      }
    `
    expect(textos(codigo)).toEqual(["Outro"])
  })
})

describe("Interpreter — operadores lógicos", () => {
  it("'e' (AND) só é verdadeiro se ambos forem", () => {
    expect(textos(`pagina T { se verdadeiro e falso { texto "sim" } senao { texto "nao" } }`)).toEqual(["nao"])
  })

  it("'ou' (OR) é verdadeiro se um dos dois for", () => {
    expect(textos(`pagina T { se verdadeiro ou falso { texto "sim" } senao { texto "nao" } }`)).toEqual(["sim"])
  })
})
