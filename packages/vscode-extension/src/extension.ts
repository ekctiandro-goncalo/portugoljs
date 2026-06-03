import * as vscode from "vscode"
import * as path from "path"
import * as fs from "fs"
import * as cp from "child_process"

// ─── Todas as palavras-chave da linguagem para autocomplete ───

const COMPONENTES = [
  "pagina", "secao", "titulo", "subtitulo", "texto",
  "botao", "entrada", "imagem", "video",
  "linha", "coluna", "grade", "cartao", "espacador",
  "icone", "ligacao", "distintivo", "divisor",
  "lista", "item", "citacao",
]

const LOGICA = [
  "funcao", "se", "senao", "para", "cada", "em", "retornar",
  "modelo", "rota", "obter", "criar", "atualizar", "deletar",
]

const ESTILOS = [
  "cor", "fundo", "largura", "altura", "padding", "margem",
  "borda", "raio", "sombra", "tamanho", "peso", "alinhamento",
  "espacamento", "opacidade", "justificar", "centralizar",
  "animacao", "cursor", "overflow", "transicao", "decoracao", "maiusculas",
  "origem", "para", "autor",
]

const TIPOS_MODELO = [
  "texto", "numero", "booleano", "decimal", "data",
  "unico", "opcional", "nao_nulo",
]

const ICONES = [
  "foguete", "codigo", "terminal", "relampago", "escudo", "globo",
  "pacote", "relogio", "grafico", "livro", "lampada", "pesquisar",
  "utilizador", "utilizadores", "verificar", "erro", "aviso",
  "estrela", "coracao", "github", "mail", "seta_direita",
  "seta_esquerda", "seta_cima", "seta_baixo", "copiar",
  "descarregar", "partilhar", "editar", "casa", "menu",
  "fechar", "notificacao", "definicoes", "twitter", "externo",
  "apagar", "informacao",
]

const TIPOS_ENTRADA = [
  "email", "texto", "numero", "senha", "telefone", "data", "url",
]

const VALORES_ALINHAMENTO = [
  "centro", "esquerda", "direita", "inicio", "fim", "entre", "ao_redor",
]

// ─── Descrições para hover e autocomplete ───

const DESCRICOES: Record<string, string> = {
  pagina:      "Define uma página web. Sintaxe: `pagina Nome { ... }`",
  secao:       "Secção da página. Suporta `centralizar`, `padding`, estilos. Sintaxe: `secao Nome { ... }`",
  titulo:      "Título principal (h1). Inline: `titulo \"texto\"` ou bloco com estilos.",
  subtitulo:   "Título secundário (h2). Sintaxe: `subtitulo \"texto\"`",
  texto:       "Parágrafo de texto (p). Suporta estilos inline.",
  botao:       "Botão clicável. Sintaxe: `botao { texto \"Label\" }`",
  entrada:     "Campo de input. Tipos: email, texto, numero, senha. Ex: `entrada email`",
  imagem:      "Imagem com origem e estilos. Sintaxe: `imagem { origem \"/img.png\" }`",
  video:       "Embed de vídeo YouTube/Vimeo. Sintaxe: `video { origem \"https://...\" }`",
  linha:       "Layout flex horizontal. Sintaxe: `linha { ... }`",
  coluna:      "Layout flex vertical. Sintaxe: `coluna { ... }`",
  grade:       "Grid CSS. Sintaxe: `grade 3 { ... }` (número de colunas)",
  cartao:      "Card com sombra e hover. Sintaxe: `cartao { ... }`",
  espacador:   "Espaço vertical. Sintaxe: `espacador 24` (px)",
  icone:       "Ícone Lucide em português. Ex: `icone foguete`, `icone coracao`",
  ligacao:     "Link/âncora. Sintaxe: `ligacao { texto \"Ver\" para \"https://...\" }`",
  distintivo:  "Badge/tag. Sintaxe: `distintivo \"Novo\"`",
  divisor:     "Linha horizontal (hr). Sintaxe: `divisor`",
  lista:       "Lista de itens. Sintaxe: `lista { item \"Texto\" item \"Texto\" }`",
  citacao:     "Blockquote com autor. Sintaxe: `citacao { texto \"...\" autor \"Nome\" }`",
  funcao:      "Definir função. Sintaxe: `funcao nome(params) { ... }`",
  modelo:      "Modelo de dados Prisma. Sintaxe: `modelo Nome { campo tipo }`",
  rota:        "Rota HTTP. Sintaxe: `rota \"/api/rota\" { obter { } criar { } }`",
  cor:         "Cor do texto. Ex: `cor \"#333\"` ou `cor red`",
  fundo:       "Cor/imagem de fundo. Ex: `fundo \"#f5f5f5\"`",
  tamanho:     "Tamanho da fonte em px. Ex: `tamanho 24`",
  peso:        "Peso da fonte. Ex: `peso 700` ou `peso bold`",
  padding:     "Espaçamento interno em px. Ex: `padding 40`",
  centralizar: "Centraliza conteúdo com flexbox (display:flex + center)",
  alinhamento: "Alinhamento de texto. Valores: centro, esquerda, direita",
}

// ─── Provider de Autocomplete ───

class PortugolCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.CompletionItem[] {
    const linha = document.lineAt(position).text
    const textoBefore = linha.substring(0, position.character).trim()
    const items: vscode.CompletionItem[] = []

    // Contexto: após "icone" → sugerir nomes de ícones
    if (/\bicone\s+\w*$/.test(textoBefore)) {
      return ICONES.map((nome) => {
        const item = new vscode.CompletionItem(nome, vscode.CompletionItemKind.Constant)
        item.detail = `Ícone Lucide: ${nome}`
        item.documentation = new vscode.MarkdownString(`**Ícone:** \`${nome}\`\n\nUso: \`icone ${nome}\``)
        return item
      })
    }

    // Contexto: após "entrada" → sugerir tipos
    if (/\bentrada\s+\w*$/.test(textoBefore)) {
      return TIPOS_ENTRADA.map((tipo) => {
        const item = new vscode.CompletionItem(tipo, vscode.CompletionItemKind.EnumMember)
        item.detail = `Tipo de entrada: ${tipo}`
        return item
      })
    }

    // Contexto: após "alinhamento" → sugerir valores
    if (/\balinhamento\s+\w*$/.test(textoBefore)) {
      return VALORES_ALINHAMENTO.map((v) => {
        const item = new vscode.CompletionItem(`"${v}"`, vscode.CompletionItemKind.EnumMember)
        item.filterText = v
        return item
      })
    }

    // Componentes UI
    COMPONENTES.forEach((kw) => {
      const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Class)
      item.detail = `Portugol — componente`
      if (DESCRICOES[kw]) {
        item.documentation = new vscode.MarkdownString(DESCRICOES[kw])
      }

      // Snippets de inserção inteligente
      const snippets: Record<string, string> = {
        pagina:     "pagina ${1:Nome} {\n\t$0\n}",
        secao:      "secao ${1:Nome} {\n\t$0\n}",
        cartao:     "cartao {\n\t$0\n}",
        grade:      "grade ${1:3} {\n\t$0\n}",
        linha:      "linha {\n\t$0\n}",
        coluna:     "coluna {\n\t$0\n}",
        botao:      'botao {\n\ttexto "${1:Label}"\n}',
        imagem:     'imagem {\n\torigem "${1:/img.png}"\n}',
        video:      'video {\n\torigem "${1:https://youtube.com/watch?v=}"\n}',
        lista:      'lista {\n\titem "${1:Primeiro}"\n\titem "${2:Segundo}"\n}',
        citacao:    'citacao {\n\ttexto "${1:Citação.}"\n\tautor "${2:Autor}"\n}',
        ligacao:    'ligacao {\n\ttexto "${1:Ver mais}"\n\tpara "${2:https://}"\n}',
        titulo:     'titulo "${1:Título}"',
        subtitulo:  'subtitulo "${1:Subtítulo}"',
        texto:      'texto "${1:Conteúdo}"',
        espacador:  "espacador ${1:24}",
        distintivo: 'distintivo "${1:Badge}"',
        divisor:    "divisor",
        icone:      "icone ${1:foguete}",
        entrada:    "entrada ${1:email}",
      }

      if (snippets[kw]) {
        item.insertText = new vscode.SnippetString(snippets[kw])
      }
      items.push(item)
    })

    // Lógica
    LOGICA.forEach((kw) => {
      const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword)
      item.detail = `Portugol — lógica`
      if (DESCRICOES[kw]) {
        item.documentation = new vscode.MarkdownString(DESCRICOES[kw])
      }
      items.push(item)
    })

    // Propriedades de estilo
    ESTILOS.forEach((kw) => {
      const item = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Property)
      item.detail = `Portugol — propriedade de estilo`
      if (DESCRICOES[kw]) {
        item.documentation = new vscode.MarkdownString(DESCRICOES[kw])
      }
      items.push(item)
    })

    // Tipos de modelo
    TIPOS_MODELO.forEach((t) => {
      const item = new vscode.CompletionItem(t, vscode.CompletionItemKind.TypeParameter)
      item.detail = `Portugol — tipo de campo`
      items.push(item)
    })

    return items
  }
}

// ─── Provider de Hover ───

class PortugolHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Hover | null {
    const range = document.getWordRangeAtPosition(position)
    if (!range) return null
    const palavra = document.getText(range)
    const desc = DESCRICOES[palavra]
    if (!desc) return null
    const md = new vscode.MarkdownString()
    md.appendMarkdown(`**\`${palavra}\`** — Portugol.js\n\n${desc}`)
    return new vscode.Hover(md, range)
  }
}

// ─── Activação da extensão ───

export function activate(context: vscode.ExtensionContext) {
  const selector: vscode.DocumentSelector = { language: "portugol", scheme: "file" }

  // Autocomplete
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      selector,
      new PortugolCompletionProvider(),
      " ", "\n", "{"
    )
  )

  // Hover
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(selector, new PortugolHoverProvider())
  )

  // ─── Comando: Iniciar servidor ───
  context.subscriptions.push(
    vscode.commands.registerCommand("portugol.iniciar", () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showErrorMessage("Nenhum ficheiro .pjs aberto.")
        return
      }
      const ficheiro = editor.document.fileName
      const pasta = path.dirname(ficheiro)
      const nome = path.basename(ficheiro)
      const config = vscode.workspace.getConfiguration("portugol")
      const porta = config.get<number>("portaServidor", 3000)
      const abrirBrowser = config.get<boolean>("abrirBrowserAutomaticamente", true)

      const terminal = vscode.window.createTerminal({
        name: `Portugol — ${nome}`,
        cwd: pasta,
      })
      terminal.show()
      terminal.sendText(`portugol iniciar ${nome} --porta ${porta}`)

      if (abrirBrowser) {
        setTimeout(() => {
          vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${porta}`))
        }, 1500)
      }

      vscode.window.showInformationMessage(
        `Portugol.js — Servidor iniciado em http://localhost:${porta}`,
        "Abrir browser"
      ).then((sel) => {
        if (sel === "Abrir browser") {
          vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${porta}`))
        }
      })
    })
  )

  // ─── Comando: Construir HTML ───
  context.subscriptions.push(
    vscode.commands.registerCommand("portugol.construir", () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) {
        vscode.window.showErrorMessage("Nenhum ficheiro .pjs aberto.")
        return
      }
      const ficheiro = editor.document.fileName
      const pasta = path.dirname(ficheiro)
      const nome = path.basename(ficheiro)
      const config = vscode.workspace.getConfiguration("portugol")
      const dir = config.get<string>("directorioSaida", "dist")

      const terminal = vscode.window.createTerminal({
        name: `Portugol — build`,
        cwd: pasta,
      })
      terminal.show()
      terminal.sendText(`portugol construir ${nome} -o ${dir}`)
    })
  )

  // ─── Comando: Pré-visualizar ───
  context.subscriptions.push(
    vscode.commands.registerCommand("portugol.previsualizar", () => {
      const editor = vscode.window.activeTextEditor
      if (!editor) return
      const ficheiro = editor.document.fileName
      const pasta = path.dirname(ficheiro)
      const nome = path.basename(ficheiro)

      // Compila para dist/ e abre o HTML
      const config = vscode.workspace.getConfiguration("portugol")
      const dir = config.get<string>("directorioSaida", "dist")

      cp.exec(`portugol construir ${nome} -o ${dir}`, { cwd: pasta }, (err) => {
        if (err) {
          vscode.window.showErrorMessage(`Erro ao compilar: ${err.message}`)
          return
        }
        const htmlPath = path.join(pasta, dir, "index.html")
        if (fs.existsSync(htmlPath)) {
          vscode.env.openExternal(vscode.Uri.file(htmlPath))
        }
      })
    })
  )

  // Status bar
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100)
  statusBar.text = "$(code) Portugol.js"
  statusBar.tooltip = "Portugol.js — by Eketiandro Gonçalo"
  statusBar.command = "portugol.iniciar"

  context.subscriptions.push(statusBar)

  // Mostrar status bar apenas em ficheiros .pjs
  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor?.document.languageId === "portugol") {
      statusBar.show()
    } else {
      statusBar.hide()
    }
  }, null, context.subscriptions)

  if (vscode.window.activeTextEditor?.document.languageId === "portugol") {
    statusBar.show()
  }
}

export function deactivate() {}
