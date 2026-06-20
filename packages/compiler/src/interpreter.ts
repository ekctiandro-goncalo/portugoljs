import { No, Expressao, Caso } from "./ast.js"

// ─── Ambiente (variáveis) ───

class Ambiente {
  private variaveis: Map<string, any> = new Map()
  private pai?: Ambiente

  constructor(pai?: Ambiente) {
    this.pai = pai
  }

  definir(nome: string, valor: any): void {
    this.variaveis.set(nome, valor)
  }

  obter(nome: string): any {
    if (this.variaveis.has(nome)) return this.variaveis.get(nome)
    if (this.pai) return this.pai.obter(nome)
    return undefined
  }

  atribuir(nome: string, valor: any): void {
    if (this.variaveis.has(nome)) {
      this.variaveis.set(nome, valor)
      return
    }
    if (this.pai) {
      this.pai.atribuir(nome, valor)
      return
    }
    // Se não existe, cria no scope actual
    this.variaveis.set(nome, valor)
  }
}

// ─── Saída do interpreter ───

export interface SaidaInterpreter {
  tipo: "texto" | "erro" | "aviso"
  valor: string
}

// ─── Interpreter principal ───

export class Interpreter {
  private saida: SaidaInterpreter[] = []
  private ambiente: Ambiente = new Ambiente()
  private limiteIteracoes = 10000

  executar(ast: No[]): SaidaInterpreter[] {
    this.saida = []
    this.ambiente = new Ambiente()

    try {
      for (const no of ast) {
        this.executarNo(no, this.ambiente)
      }
    } catch (err: any) {
      if (err?.tipo !== "retornar") {
        this.saida.push({ tipo: "erro", valor: err?.message ?? String(err) })
      }
    }

    return this.saida
  }

  private executarNo(no: No, env: Ambiente): any {
    switch (no.tipo) {

      // ─── Página — executa o corpo ───
      case "Pagina":
        for (const filho of no.corpo) {
          this.executarNo(filho, env)
        }
        return

      // ─── Secção — executa o corpo ───
      case "Secao":
      case "Linha":
      case "Coluna":
      case "Cartao":
      case "Grade":
        for (const filho of no.corpo) {
          this.executarNo(filho, env)
        }
        return

      // ─── Componentes visuais — imprime texto ───
      case "Titulo":
        this.imprimir(`[TÍTULO] ${this.avaliarExpr(no.valor, env)}`)
        return

      case "Subtitulo":
        this.imprimir(`[SUBTÍTULO] ${this.avaliarExpr(no.valor, env)}`)
        return

      case "Texto":
        this.imprimir(`${this.avaliarExpr(no.valor, env)}`)
        return

      case "Botao":
        this.imprimir(`[BOTÃO] ${no.label}`)
        return

      case "Lista":
        for (const item of no.itens) {
          this.imprimir(`  → ${item}`)
        }
        return

      case "Citacao":
        this.imprimir(`"${no.texto}"`)
        if (no.autor) this.imprimir(`  — ${no.autor}`)
        return

      case "Distintivo":
        this.imprimir(`[${no.label}]`)
        return

      case "Espacador":
      case "Divisor":
      case "Imagem":
      case "Video":
      case "Ligacao":
      case "Icone":
        return

      // ─── Variável: var x = 10 ───
      case "Variavel": {
        const valor = no.valor ? this.avaliarExpr(no.valor, env) : undefined
        env.definir(no.nome, valor)
        return
      }

      // ─── Atribuição: x = x + 1 ───
      case "Atribuir": {
        const valor = this.avaliarExpr(no.valor, env)
        env.atribuir(no.nome, valor)
        return
      }

      // ─── Função ───
      case "Funcao":
        env.definir(no.nome, no)
        return

      // ─── Retornar ───
      case "Retornar": {
        const valor = this.avaliarExpr(no.valor, env)
        throw { tipo: "retornar", valor }
      }

      // ─── Se / Senao se / Senao ───
      case "Se": {
        const condicao = this.avaliarExpr(no.condicao, env)
        const escopo = new Ambiente(env)
        if (this.truthy(condicao)) {
          for (const filho of no.entao) {
            this.executarNo(filho, escopo)
          }
          return
        }
        const senaoSe = (no as any).senaoSe as { condicao: Expressao; corpo: No[] }[] | undefined
        if (senaoSe) {
          for (const ramo of senaoSe) {
            if (this.truthy(this.avaliarExpr(ramo.condicao, env))) {
              const escopoRamo = new Ambiente(env)
              for (const filho of ramo.corpo) {
                this.executarNo(filho, escopoRamo)
              }
              return
            }
          }
        }
        if (no.senao.length > 0) {
          for (const filho of no.senao) {
            this.executarNo(filho, escopo)
          }
        }
        return
      }

      // ─── Enquanto ───
      case "Enquanto": {
        let iteracoes = 0
        while (this.truthy(this.avaliarExpr(no.condicao, env))) {
          if (++iteracoes > this.limiteIteracoes) {
            this.saida.push({ tipo: "aviso", valor: `Loop infinito detectado após ${this.limiteIteracoes} iterações — parado.` })
            break
          }
          const escopo = new Ambiente(env)
          try {
            for (const filho of no.corpo) {
              this.executarNo(filho, escopo)
            }
          } catch (e: any) {
            if (e?.tipo === "parar") break
            if (e?.tipo === "continuar") continue
            throw e
          }
        }
        return
      }

      // ─── Para numérico: para i = 0 ate 10 ───
      case "Para": {
        let inicio = Number(this.avaliarExpr(no.inicio, env))
        const ate = Number(this.avaliarExpr(no.ate, env))
        const passo = no.passo ? Number(this.avaliarExpr(no.passo, env)) : 1
        let iteracoes = 0

        for (let i = inicio; passo > 0 ? i <= ate : i >= ate; i += passo) {
          if (++iteracoes > this.limiteIteracoes) {
            this.saida.push({ tipo: "aviso", valor: `Loop infinito detectado após ${this.limiteIteracoes} iterações.` })
            break
          }
          const escopo = new Ambiente(env)
          escopo.definir(no.variavel, i)
          try {
            for (const filho of no.corpo) {
              this.executarNo(filho, escopo)
            }
          } catch (e: any) {
            if (e?.tipo === "parar") break
            if (e?.tipo === "continuar") continue
            throw e
          }
        }
        return
      }

      // ─── Para Cada ───
      case "ParaCada": {
        const colecao = env.obter(no.colecao)
        if (!Array.isArray(colecao)) {
          this.saida.push({ tipo: "aviso", valor: `"${no.colecao}" não é uma lista — para cada ignorado.` })
          return
        }
        for (const item of colecao) {
          const escopo = new Ambiente(env)
          escopo.definir(no.variavel, item)
          try {
            for (const filho of no.corpo) {
              this.executarNo(filho, escopo)
            }
          } catch (e: any) {
            if (e?.tipo === "parar") break
            if (e?.tipo === "continuar") continue
            throw e
          }
        }
        return
      }

      // ─── Escolher / Caso ───
      case "Escolher": {
        const valor = this.avaliarExpr(no.expr, env)
        let encontrou = false
        for (const caso of no.casos) {
          const valorCaso = this.avaliarExpr(caso.valor, env)
          if (valor == valorCaso) {
            encontrou = true
            const escopo = new Ambiente(env)
            for (const filho of caso.corpo) {
              this.executarNo(filho, escopo)
            }
            break
          }
        }
        if (!encontrou && no.padrao) {
          const escopo = new Ambiente(env)
          for (const filho of no.padrao) {
            this.executarNo(filho, escopo)
          }
        }
        return
      }

      // ─── Modelo / Rota — ignorados no interpreter ───
      case "Modelo":
      case "Rota":
        return

      default:
        return
    }
  }

  // ─── Avaliador de expressões ───

  private avaliarExpr(expr: Expressao, env: Ambiente): any {
    switch (expr.tipo) {
      case "Num":   return Number(expr.valor)
      case "Str":   return expr.valor
      case "Bool":  return expr.valor

      case "Ident": {
        const val = env.obter(expr.nome)
        if (val === undefined) return expr.nome // retorna o nome como string se não definida
        return val
      }

      case "Unaria": {
        const val = this.avaliarExpr(expr.expr, env)
        if (expr.oper === "!") return !this.truthy(val)
        if (expr.oper === "-") return -Number(val)
        return val
      }

      case "Binaria": {
        // Lazy evaluation para e/ou
        if (expr.oper === "&&" || expr.oper === "e") {
          return this.truthy(this.avaliarExpr(expr.esq, env)) && this.truthy(this.avaliarExpr(expr.dir, env))
        }
        if (expr.oper === "||" || expr.oper === "ou") {
          return this.truthy(this.avaliarExpr(expr.esq, env)) || this.truthy(this.avaliarExpr(expr.dir, env))
        }

        const esq = this.avaliarExpr(expr.esq, env)
        const dir = this.avaliarExpr(expr.dir, env)

        switch (expr.oper) {
          case "+":  return typeof esq === "string" || typeof dir === "string"
                        ? String(esq) + String(dir)
                        : Number(esq) + Number(dir)
          case "-":  return Number(esq) - Number(dir)
          case "*":  return Number(esq) * Number(dir)
          case "/":  return dir !== 0 ? Number(esq) / Number(dir) : (this.saida.push({ tipo: "erro", valor: "Divisão por zero" }), 0)
          case "==": return esq == dir
          case "!=": return esq != dir
          case ">":  return esq > dir
          case "<":  return esq < dir
          case ">=": return esq >= dir
          case "<=": return esq <= dir
          default:   return esq
        }
      }

      case "Chamada": {
        const fn = env.obter(expr.nome)
        if (!fn || fn.tipo !== "Funcao") {
          this.saida.push({ tipo: "erro", valor: `Função "${expr.nome}" não está definida.` })
          return undefined
        }

        const argsAvaliados = expr.args.map((a) => this.avaliarExpr(a, env))

        if (argsAvaliados.length !== fn.params.length) {
          this.saida.push({
            tipo: "erro",
            valor: `Função "${expr.nome}" espera ${fn.params.length} argumento(s), recebeu ${argsAvaliados.length}.`,
          })
          return undefined
        }

        const escopoFuncao = new Ambiente(env)
        fn.params.forEach((paramNome: string, i: number) => {
          escopoFuncao.definir(paramNome, argsAvaliados[i])
        })

        try {
          for (const stmt of fn.corpo) {
            this.executarNo(stmt, escopoFuncao)
          }
        } catch (e: any) {
          if (e?.tipo === "retornar") return e.valor
          throw e
        }
        return undefined // função sem 'retornar' explícito
      }
    }
  }

  private truthy(val: any): boolean {
    if (val === false || val === null || val === undefined || val === 0 || val === "") return false
    if (val === "falso") return false
    if (val === "verdadeiro") return true
    return true
  }

  private imprimir(texto: string): void {
    this.saida.push({ tipo: "texto", valor: String(texto) })
  }
}
