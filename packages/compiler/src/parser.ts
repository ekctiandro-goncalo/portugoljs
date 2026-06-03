import { Token } from "./token.js"
import { No, Campo, MetodoRota, Expressao, Estilos, PROPRIEDADES_ESTILO } from "./ast.js"

export class ErroParser extends Error {
  constructor(
    mensagem: string,
    public linha: number,
    public coluna: number,
  ) {
    super(`Linha ${linha}: ${mensagem}`)
  }
}

export function parser(tokens: Token[]): No[] {
  let pos = 0

  function peek(): Token {
    return tokens[pos] ?? { type: "EOF", value: "", linha: 0, coluna: 0 }
  }

  function consumir(tipo?: string): Token {
    const token = tokens[pos]
    if (!token) throw new ErroParser("Fim inesperado do ficheiro", 0, 0)
    if (tipo && token.type !== tipo) {
      throw new ErroParser(
        `Esperado ${tipo}, encontrado "${token.value}" (${token.type})`,
        token.linha,
        token.coluna,
      )
    }
    pos++
    return token
  }

  function parseBloco(): No[] {
    const nos: No[] = []
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      nos.push(parseNo())
    }
    return nos
  }

  // ─── Parse bloco com estilos misturados ───
  // Dentro de { }, reconhece propriedades de estilo E filhos normais

  function parseBlocoComEstilos(): { corpo: No[]; estilos: Estilos } {
    const corpo: No[] = []
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      // Verifica se o token actual é uma propriedade de estilo
      if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") {
          estilos.centralizar = true
        } else {
          const val = parseValorEstilo()
          ;(estilos as any)[prop] = val
        }
      } else {
        corpo.push(parseNo())
      }
    }
    return { corpo, estilos }
  }

  function parseValorEstilo(): string {
    const token = peek()
    if (token.type === "STRING") {
      return consumir("STRING").value
    }
    if (token.type === "NUMERO") {
      return consumir("NUMERO").value
    }
    if (token.type === "IDENT") {
      return consumir("IDENT").value
    }
    throw new ErroParser(
      `Valor de estilo inválido: "${token.value}" (${token.type})`,
      token.linha,
      token.coluna,
    )
  }

  function temEstilos(estilos: Estilos): boolean {
    return Object.keys(estilos).length > 0
  }

  function parseNo(): No {
    const token = peek()

    switch (token.type) {
      case "PAGINA":
        return parsePagina()
      case "TITULO":
        return parseTitulo()
      case "TEXTO":
        return parseTexto()
      case "BOTAO":
        return parseBotao()
      case "ENTRADA":
        return parseEntrada()
      case "IMAGEM":
        return parseImagem()
      case "FUNCAO":
        return parseFuncao()
      case "SE":
        return parseSe()
      case "PARA":
        return parseParaCada()
      case "ROTA":
        return parseRota()
      case "MODELO":
        return parseModelo()
      case "RETORNAR":
        return parseRetornar()
      case "LINHA":
        return parseLinha()
      case "COLUNA":
        return parseColuna()
      case "CARTAO":
        return parseCartao()
      // MVP Landing Page
      case "SECAO":
        return parseSecao()
      case "GRADE":
        return parseGrade()
      case "ESPACADOR":
        return parseEspacador()
      // Novos
      case "SUBTITULO":
        return parseSubtitulo()
      case "ICONE":
        return parseIcone()
      case "LIGACAO":
        return parseLigacao()
      case "DISTINTIVO":
        return parseDistintivo()
      case "DIVISOR":
        return parseDivisor()
      case "VIDEO":
        return parseVideo()
      case "LISTA":
        return parseLista()
      case "CITACAO":
        return parseCitacao()
      default:
        throw new ErroParser(
          `Token inesperado: "${token.value}" (${token.type})`,
          token.linha,
          token.coluna,
        )
    }
  }

  function parsePagina(): No {
    consumir("PAGINA")
    const nome = consumir("IDENT").value
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Pagina", nome, corpo }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Titulo: suporta inline E bloco ───
  // titulo "Hello"
  // titulo { texto "Hello" tamanho 72 peso 700 }

  function parseTitulo(): No {
    consumir("TITULO")
    // Bloco: titulo { texto "..." tamanho 72 }
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      const estilos: Estilos = {}
      let valor: Expressao = { tipo: "Str", valor: "" }
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "TEXTO") {
          consumir("TEXTO")
          valor = { tipo: "Str", valor: consumir("STRING").value }
        } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
          const prop = consumir("IDENT").value
          if (prop === "centralizar") {
            estilos.centralizar = true
          } else {
            ;(estilos as any)[prop] = parseValorEstilo()
          }
        } else {
          break
        }
      }
      consumir("RBRACE")
      const no: No = { tipo: "Titulo", valor }
      if (temEstilos(estilos)) no.estilos = estilos
      return no
    }
    // Inline: titulo "Hello"
    const valor = parseExpr(0)
    return { tipo: "Titulo", valor }
  }

  // ─── Texto: suporta inline E bloco ───

  function parseTexto(): No {
    consumir("TEXTO")
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      const estilos: Estilos = {}
      let valor: Expressao = { tipo: "Str", valor: "" }
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "STRING") {
          valor = { tipo: "Str", valor: consumir("STRING").value }
        } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
          const prop = consumir("IDENT").value
          if (prop === "centralizar") {
            estilos.centralizar = true
          } else {
            ;(estilos as any)[prop] = parseValorEstilo()
          }
        } else {
          break
        }
      }
      consumir("RBRACE")
      const no: No = { tipo: "Texto", valor }
      if (temEstilos(estilos)) no.estilos = estilos
      return no
    }
    const valor = parseExpr(0)
    return { tipo: "Texto", valor }
  }

  function parseBotao(): No {
    consumir("BOTAO")
    consumir("LBRACE")
    let label = ""
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "TEXTO") {
        consumir("TEXTO")
        label = consumir("STRING").value
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") {
          estilos.centralizar = true
        } else {
          ;(estilos as any)[prop] = parseValorEstilo()
        }
      } else {
        break
      }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Botao", label }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseEntrada(): No {
    consumir("ENTRADA")
    // Aceita IDENT ou qualquer palavra reservada como tipo de input
    // ex: entrada email, entrada texto, entrada numero, entrada senha
    const token = peek()
    const tiposAceites = new Set([
      "IDENT", "TEXTO", "NUMERO", "TITULO", "BOTAO", "IMAGEM",
    ])
    if (!tiposAceites.has(token.type) && token.type !== "STRING") {
      throw new ErroParser(
        `Tipo de entrada inválido: "${token.value}"`,
        token.linha,
        token.coluna,
      )
    }
    const tipoInput = consumir().value
    return { tipo: "Entrada", tipoInput }
  }

  function parseImagem(): No {
    consumir("IMAGEM")
    consumir("LBRACE")
    let origem = ""
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "IDENT" && peek().value === "origem") {
        consumir("IDENT")
        origem = consumir("STRING").value
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") {
          estilos.centralizar = true
        } else {
          ;(estilos as any)[prop] = parseValorEstilo()
        }
      } else {
        break
      }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Imagem", origem }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseFuncao(): No {
    consumir("FUNCAO")
    const nome = consumir("IDENT").value
    consumir("LPAREN")
    const params: string[] = []
    while (peek().type !== "RPAREN" && peek().type !== "EOF") {
      params.push(consumir("IDENT").value)
      if (peek().type === "COMMA") consumir("COMMA")
    }
    consumir("RPAREN")
    consumir("LBRACE")
    const corpo = parseBloco()
    consumir("RBRACE")
    return { tipo: "Funcao", nome, params, corpo }
  }

  function parseSe(): No {
    consumir("SE")
    const condicao = parseExpr(0)
    consumir("LBRACE")
    const entao = parseBloco()
    consumir("RBRACE")
    let senao: No[] = []
    if (peek().type === "SENAO") {
      consumir("SENAO")
      consumir("LBRACE")
      senao = parseBloco()
      consumir("RBRACE")
    }
    return { tipo: "Se", condicao, entao, senao }
  }

  function parseParaCada(): No {
    consumir("PARA")
    consumir("CADA")
    const variavel = consumir("IDENT").value
    consumir("EM")
    const colecao = consumir("IDENT").value
    consumir("LBRACE")
    const corpo = parseBloco()
    consumir("RBRACE")
    return { tipo: "ParaCada", variavel, colecao, corpo }
  }

  function parseRota(): No {
    consumir("ROTA")
    const caminho = consumir("STRING").value
    consumir("LBRACE")
    const metodos: MetodoRota[] = []
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (
        peek().type === "OBTER" ||
        peek().type === "CRIAR" ||
        peek().type === "ATUALIZAR" ||
        peek().type === "DELETAR"
      ) {
        const tipo = consumir().type.toLowerCase() as MetodoRota["tipo"]
        consumir("LBRACE")
        const corpo = parseBloco()
        consumir("RBRACE")
        metodos.push({ tipo: tipo as MetodoRota["tipo"], corpo })
      } else {
        break
      }
    }
    consumir("RBRACE")
    return { tipo: "Rota", caminho, metodos }
  }

  const MODIFICADORES = new Set(["unico", "opcional", "nao_nulo"])

  function parseModelo(): No {
    consumir("MODELO")
    const nome = consumir("IDENT").value
    consumir("LBRACE")
    const campos: Campo[] = []
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      const campo: Campo = { nome: "", tipo: "", modificadores: [] }
      campo.nome = consumir("IDENT").value
      campo.tipo = consumir().value
      while (MODIFICADORES.has(peek().value.toLowerCase())) {
        campo.modificadores.push(consumir().value)
      }
      campos.push(campo)
    }
    consumir("RBRACE")
    return { tipo: "Modelo", nome, campos }
  }

  function parseRetornar(): No {
    consumir("RETORNAR")
    const valor = parseExpr(0)
    return { tipo: "Retornar", valor }
  }

  function parseLinha(): No {
    consumir("LINHA")
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Linha", corpo }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseColuna(): No {
    consumir("COLUNA")
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Coluna", corpo }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseCartao(): No {
    consumir("CARTAO")
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Cartao", corpo }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── MVP Landing Page: Novos parsers ───

  function parseSecao(): No {
    consumir("SECAO")
    // Nome opcional: secao Hero { } ou secao { }
    let nome: string | undefined
    if (peek().type === "IDENT") {
      nome = consumir("IDENT").value
    }
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Secao", corpo }
    if (nome) no.nome = nome
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseGrade(): No {
    consumir("GRADE")
    // Número de colunas: grade 3 { }
    let colunas = 3
    if (peek().type === "NUMERO") {
      colunas = parseInt(consumir("NUMERO").value, 10)
    }
    consumir("LBRACE")
    const { corpo, estilos } = parseBlocoComEstilos()
    consumir("RBRACE")
    const no: No = { tipo: "Grade", colunas, corpo }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  function parseEspacador(): No {
    consumir("ESPACADOR")
    let tamanho = "40"
    if (peek().type === "NUMERO") {
      tamanho = consumir("NUMERO").value
    }
    return { tipo: "Espacador", tamanho }
  }

  // ─── Subtitulo ───
  function parseSubtitulo(): No {
    consumir("SUBTITULO")
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      const estilos: Estilos = {}
      let valor: Expressao = { tipo: "Str", valor: "" }
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "TEXTO") {
          consumir("TEXTO")
          valor = { tipo: "Str", valor: consumir("STRING").value }
        } else if (peek().type === "STRING") {
          valor = { tipo: "Str", valor: consumir("STRING").value }
        } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
          const prop = consumir("IDENT").value
          if (prop === "centralizar") estilos.centralizar = true
          else (estilos as any)[prop] = parseValorEstilo()
        } else { break }
      }
      consumir("RBRACE")
      const no: No = { tipo: "Subtitulo", valor }
      if (temEstilos(estilos)) no.estilos = estilos
      return no
    }
    const valor = parseExpr(0)
    return { tipo: "Subtitulo", valor }
  }

  // ─── Icone ───
  function parseIcone(): No {
    consumir("ICONE")
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      const estilos: Estilos = {}
      let valor = ""
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "STRING") {
          valor = consumir("STRING").value
        } else if (peek().type === "IDENT") {
          // Pode ser nome de ícone ou propriedade de estilo
          if (PROPRIEDADES_ESTILO.has(peek().value)) {
            const prop = consumir("IDENT").value
            if (prop === "centralizar") estilos.centralizar = true
            else (estilos as any)[prop] = parseValorEstilo()
          } else {
            valor = consumir("IDENT").value
          }
        } else { break }
      }
      consumir("RBRACE")
      const no: No = { tipo: "Icone", valor }
      if (temEstilos(estilos)) no.estilos = estilos
      return no
    }
    // Aceita: icone "nome" OU icone nome (sem aspas)
    if (peek().type === "STRING") {
      return { tipo: "Icone", valor: consumir("STRING").value }
    }
    // IDENT sem aspas — ex: icone verificar, icone foguete
    return { tipo: "Icone", valor: consumir("IDENT").value }
  }

  // ─── Ligacao ───
  function parseLigacao(): No {
    consumir("LIGACAO")
    consumir("LBRACE")
    let label = ""
    let para = "#"
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "TEXTO") {
        consumir("TEXTO")
        label = consumir("STRING").value
      } else if (peek().type === "PARA") {
        // "para" é palavra reservada — aceitar como keyword de destino
        consumir("PARA")
        para = consumir("STRING").value
      } else if (peek().type === "IDENT" && peek().value === "para") {
        consumir("IDENT")
        para = consumir("STRING").value
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") estilos.centralizar = true
        else (estilos as any)[prop] = parseValorEstilo()
      } else { break }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Ligacao", label, para }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Distintivo ───
  function parseDistintivo(): No {
    consumir("DISTINTIVO")
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      const estilos: Estilos = {}
      let label = ""
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "TEXTO") {
          consumir("TEXTO")
          label = consumir("STRING").value
        } else if (peek().type === "STRING") {
          label = consumir("STRING").value
        } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
          const prop = consumir("IDENT").value
          if (prop === "centralizar") estilos.centralizar = true
          else (estilos as any)[prop] = parseValorEstilo()
        } else { break }
      }
      consumir("RBRACE")
      const no: No = { tipo: "Distintivo", label }
      if (temEstilos(estilos)) no.estilos = estilos
      return no
    }
    const label = consumir("STRING").value
    return { tipo: "Distintivo", label }
  }

  // ─── Divisor ───
  function parseDivisor(): No {
    consumir("DIVISOR")
    const estilos: Estilos = {}
    if (peek().type === "LBRACE") {
      consumir("LBRACE")
      while (peek().type !== "RBRACE" && peek().type !== "EOF") {
        if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
          const prop = consumir("IDENT").value
          if (prop === "centralizar") estilos.centralizar = true
          else (estilos as any)[prop] = parseValorEstilo()
        } else { break }
      }
      consumir("RBRACE")
    }
    const no: No = { tipo: "Divisor" }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Video ───
  function parseVideo(): No {
    consumir("VIDEO")
    consumir("LBRACE")
    let origem = ""
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "IDENT" && peek().value === "origem") {
        consumir("IDENT")
        origem = consumir("STRING").value
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") estilos.centralizar = true
        else (estilos as any)[prop] = parseValorEstilo()
      } else { break }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Video", origem }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Lista ───
  function parseLista(): No {
    consumir("LISTA")
    consumir("LBRACE")
    const itens: string[] = []
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "ITEM") {
        consumir("ITEM")
        itens.push(consumir("STRING").value)
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") estilos.centralizar = true
        else (estilos as any)[prop] = parseValorEstilo()
      } else { break }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Lista", itens }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Citacao ───
  function parseCitacao(): No {
    consumir("CITACAO")
    consumir("LBRACE")
    let texto = ""
    let autor: string | undefined
    const estilos: Estilos = {}
    while (peek().type !== "RBRACE" && peek().type !== "EOF") {
      if (peek().type === "TEXTO") {
        consumir("TEXTO")
        texto = consumir("STRING").value
      } else if (peek().type === "STRING") {
        texto = consumir("STRING").value
      } else if (peek().type === "IDENT" && peek().value === "autor") {
        consumir("IDENT")
        autor = consumir("STRING").value
      } else if (peek().type === "IDENT" && PROPRIEDADES_ESTILO.has(peek().value)) {
        const prop = consumir("IDENT").value
        if (prop === "centralizar") estilos.centralizar = true
        else (estilos as any)[prop] = parseValorEstilo()
      } else { break }
    }
    consumir("RBRACE")
    const no: No = { tipo: "Citacao", texto, autor }
    if (temEstilos(estilos)) no.estilos = estilos
    return no
  }

  // ─── Expression Parser (Precedence Climbing) ───

  const PRECEDENCIA: Record<string, number> = {
    OR: 1, AND: 2,
    EQ_EQ: 3, NOT_EQ: 3, GREATER: 3, LESS: 3, GREATER_EQ: 3, LESS_EQ: 3,
    PLUS: 4, MINUS: 4,
    STAR: 5, SLASH: 5,
  }

  function prefixo(): Expressao {
    const token = peek()
    switch (token.type) {
      case "STRING":
        consumir()
        return { tipo: "Str", valor: token.value }
      case "NUMERO":
        consumir()
        return { tipo: "Num", valor: token.value }
      case "IDENT":
        consumir()
        return { tipo: "Ident", nome: token.value }
      case "NOT":
        consumir()
        return { tipo: "Unaria", oper: "!", expr: parseExpr(6) }
      case "MINUS":
        consumir()
        return { tipo: "Unaria", oper: "-", expr: parseExpr(6) }
      case "LPAREN":
        consumir()
        const expr = parseExpr(0)
        consumir("RPAREN")
        return expr
      case "TRUE":
        consumir()
        return { tipo: "Bool", valor: true }
      case "FALSE":
        consumir()
        return { tipo: "Bool", valor: false }
      default:
        throw new ErroParser(
          `Expressão inválida: "${token.value}"`,
          token.linha,
          token.coluna,
        )
    }
  }

  function parseExpr(minPrec: number): Expressao {
    let esq = prefixo()

    while (true) {
      const token = peek()
      const prec = PRECEDENCIA[token.type]
      if (prec === undefined || prec < minPrec) break

      const operToken = consumir()
      const dir = parseExpr(prec + 1)
      esq = { tipo: "Binaria", esq, oper: operToken.value, dir }
    }

    return esq
  }

  // Início
  const nos: No[] = []
  while (peek().type !== "EOF") {
    nos.push(parseNo())
  }
  return nos
}
