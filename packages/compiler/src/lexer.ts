import { Token, TokenType } from "./token.js"

const PALAVRAS_RESERVADAS: Record<string, TokenType> = {
  pagina: "PAGINA",
  titulo: "TITULO",
  subtitulo: "SUBTITULO",
  texto: "TEXTO",
  botao: "BOTAO",
  imagem: "IMAGEM",
  entrada: "ENTRADA",
  funcao: "FUNCAO",
  se: "SE",
  senao: "SENAO",
  para: "PARA",
  cada: "CADA",
  em: "EM",
  rota: "ROTA",
  obter: "OBTER",
  criar: "CRIAR",
  atualizar: "ATUALIZAR",
  deletar: "DELETAR",
  modelo: "MODELO",
  retornar: "RETORNAR",
  linha: "LINHA",
  coluna: "COLUNA",
  cartao: "CARTAO",
  secao: "SECAO",
  grade: "GRADE",
  espacador: "ESPACADOR",
  // Novos
  icone: "ICONE",
  ligacao: "LIGACAO",
  distintivo: "DISTINTIVO",
  divisor: "DIVISOR",
  video: "VIDEO",
  lista: "LISTA",
  item: "ITEM",
  citacao: "CITACAO",
  // Novas estruturas de controlo
  enquanto: "ENQUANTO",
  escolher: "ESCOLHER",
  caso: "CASO",
  padrao: "PADRAO",
  ate: "ATE",
  passo: "PASSO",
  var: "VAR",
  // Operadores lógicos
  e: "AND",
  ou: "OR",
  nao: "NOT",
  verdadeiro: "TRUE",
  falso: "FALSE",
}

export function lexer(entrada: string): Token[] {
  const tokens: Token[] = []

  // Ignorar BOM (UTF-8 \uFEFF ou UTF-16 corrompido) no início
  if (entrada.charCodeAt(0) === 0xFEFF || entrada.charCodeAt(0) === 0xFFFD) {
    entrada = entrada.slice(1)
  }
  // Ignorar bytes nulos (UTF-16 LE sem conversão)
  entrada = entrada.replace(/\x00/g, '')

  let i = 0
  let linha = 1
  let coluna = 1

  function avancar(n = 1) {
    i += n
    coluna += n
  }

  function adicionarToken(tipo: TokenType, valor: string) {
    tokens.push({ type: tipo, value: valor, linha, coluna })
  }

  while (i < entrada.length) {
    const char = entrada[i]

    // Ignorar espaços em branco
    if (/\s/.test(char)) {
      if (char === "\n") {
        linha++
        coluna = 1
      } else {
        coluna++
      }
      i++
      continue
    }

    // Comentários: # até ao fim da linha
    if (char === "#") {
      while (i < entrada.length && entrada[i] !== "\n") {
        i++
      }
      continue
    }

    // Símbolos
    if (char === "{") {
      adicionarToken("LBRACE", "{")
      avancar()
      continue
    }
    if (char === "}") {
      adicionarToken("RBRACE", "}")
      avancar()
      continue
    }
    if (char === "(") {
      adicionarToken("LPAREN", "(")
      avancar()
      continue
    }
    if (char === ")") {
      adicionarToken("RPAREN", ")")
      avancar()
      continue
    }
    if (char === ",") {
      adicionarToken("COMMA", ",")
      avancar()
      continue
    }

    // Operadores (multi-char primeiro)
    if (char === ">" && entrada[i + 1] === "=") { adicionarToken("GREATER_EQ", ">="); avancar(2); continue }
    if (char === "<" && entrada[i + 1] === "=") { adicionarToken("LESS_EQ", "<="); avancar(2); continue }
    if (char === "=" && entrada[i + 1] === "=") { adicionarToken("EQ_EQ", "=="); avancar(2); continue }
    if (char === "!" && entrada[i + 1] === "=") { adicionarToken("NOT_EQ", "!="); avancar(2); continue }
    if (char === ">") { adicionarToken("GREATER", ">"); avancar(); continue }
    if (char === "<") { adicionarToken("LESS", "<"); avancar(); continue }
    if (char === "=") { adicionarToken("EQUALS", "="); avancar(); continue }
    if (char === "+") { adicionarToken("PLUS", "+"); avancar(); continue }
    if (char === "-") { adicionarToken("MINUS", "-"); avancar(); continue }
    if (char === "*") { adicionarToken("STAR", "*"); avancar(); continue }
    if (char === "/") { adicionarToken("SLASH", "/"); avancar(); continue }

    // Strings: "texto"
    if (char === '"') {
      const inicioCol = coluna
      avancar() // skip opening quote
      let valor = ""
      while (i < entrada.length && entrada[i] !== '"') {
        if (entrada[i] === "\\" && i + 1 < entrada.length) {
          valor += entrada[i + 1]
          avancar(2)
        } else {
          valor += entrada[i]
          avancar()
        }
      }
      if (i >= entrada.length) {
        tokens.push({
          type: "ERRO",
          value: 'String não fechada',
          linha,
          coluna: inicioCol,
        })
        continue
      }
      avancar() // skip closing quote
      adicionarToken("STRING", valor)
      continue
    }

    // Números (suporta % para valores CSS como "100%")
    if (/[0-9]/.test(char)) {
      let valor = ""
      while (i < entrada.length && /[0-9.]/.test(entrada[i])) {
        valor += entrada[i]
        avancar()
      }
      // Suporte a sufixo % (ex: 100%)
      if (i < entrada.length && entrada[i] === "%") {
        valor += "%"
        avancar()
      }
      adicionarToken("NUMERO", valor)
      continue
    }

    // Identificadores e palavras-chave (suporta caracteres portugueses)
    if (/[a-zA-ZÀ-ÿÀ-ÖØ-öø-ÿ_]/.test(char)) {
      const inicioCol = coluna
      let palavra = ""
      while (
        i < entrada.length &&
        /[a-zA-ZÀ-ÿÀ-ÖØ-öø-ÿ_0-9]/.test(entrada[i])
      ) {
        palavra += entrada[i]
        avancar()
      }

      const tipo =
        PALAVRAS_RESERVADAS[palavra.toLowerCase()] ?? "IDENT"
      tokens.push({ type: tipo, value: palavra, linha, coluna: inicioCol })
      continue
    }

    // Carácter não reconhecido
    adicionarToken("ERRO", char)
    avancar()
  }

  adicionarToken("EOF", "")
  return tokens
}
