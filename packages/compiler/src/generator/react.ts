import { No, Campo, MetodoRota, Expressao } from "../ast.js"

export function gerarReact(ast: No[]): string {
  return ast.map(gerarNo).join("\n\n")
}

export function gerarPaginaNext(no: No & { tipo: "Pagina" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  return [
    `export default function ${no.nome}() {`,
    `  return (`,
    `    <main className="min-h-screen p-8">`,
    corpo,
    `    </main>`,
    `  )`,
    `}`,
  ].join("\n")
}

// Versão sem JSX para webpack loader (usa React.createElement)
// Emite "use client" para compatibilidade com Next.js App Router
export function gerarPaginaLoader(no: No & { tipo: "Pagina" }): string {
  const estilosPagina = no.estilos ? estilosCE(no.estilos) : null
  const propsMain = estilosPagina
    ? `{ className: "min-h-screen p-8", style: ${estilosPagina} }`
    : `{ className: "min-h-screen p-8" }`

  const itens = no.corpo.map((n) => gerarNoCE(n, 2)).join(",\n")
  return [
    `"use client"`,
    ``,
    `import React from "react"`,
    ``,
    `export default function ${no.nome}() {`,
    `  return React.createElement("main", ${propsMain},`,
    itens,
    `  )`,
    `}`,
  ].join("\n")
}

function gerarNoCE(no: any, depth = 2): string {
  if (!no || !no.tipo) return `${"  ".repeat(depth)}null`
  const pad = "  ".repeat(depth)
  const pad1 = "  ".repeat(depth + 1)

  switch (no.tipo) {
    case "Titulo": {
      const props = no.estilos
        ? `{ className: "titulo", style: ${estilosCE(no.estilos)} }`
        : `{ className: "titulo" }`
      return `${pad}React.createElement("h1", ${props}, ${gerarExprCE(no.valor)})`
    }
    case "Texto": {
      const props = no.estilos
        ? `{ className: "texto", style: ${estilosCE(no.estilos)} }`
        : `{ className: "texto" }`
      return `${pad}React.createElement("p", ${props}, ${gerarExprCE(no.valor)})`
    }
    case "Botao": {
      const props = no.estilos
        ? `{ className: "botao", style: ${estilosCE(no.estilos)} }`
        : `{ className: "botao" }`
      return `${pad}React.createElement("button", ${props}, ${JSON.stringify(no.label)})`
    }
    case "Entrada": {
      return `${pad}React.createElement("input", { type: ${JSON.stringify(no.tipoInput)}, className: "entrada" })`
    }
    case "Imagem": {
      const props = no.estilos
        ? `{ src: ${JSON.stringify(no.origem)}, alt: "", className: "imagem", style: ${estilosCE(no.estilos)} }`
        : `{ src: ${JSON.stringify(no.origem)}, alt: "", className: "imagem" }`
      return `${pad}React.createElement("img", ${props})`
    }
    case "Linha": {
      const props = no.estilos
        ? `{ className: "linha", style: ${estilosCE(no.estilos)} }`
        : `{ className: "linha" }`
      const filhos = no.corpo.map((n: any) => gerarNoCE(n, depth + 1)).join(",\n")
      return `${pad}React.createElement("div", ${props},\n${filhos}\n${pad})`
    }
    case "Coluna": {
      const props = no.estilos
        ? `{ className: "coluna", style: ${estilosCE(no.estilos)} }`
        : `{ className: "coluna" }`
      const filhos = no.corpo.map((n: any) => gerarNoCE(n, depth + 1)).join(",\n")
      return `${pad}React.createElement("div", ${props},\n${filhos}\n${pad})`
    }
    case "Cartao": {
      const props = no.estilos
        ? `{ className: "cartao", style: ${estilosCE(no.estilos)} }`
        : `{ className: "cartao" }`
      const filhos = no.corpo.map((n: any) => gerarNoCE(n, depth + 1)).join(",\n")
      return `${pad}React.createElement("div", ${props},\n${filhos}\n${pad})`
    }
    case "Secao": {
      const cls = no.nome ? `secao secao-${slugCE(no.nome)}` : "secao"
      const props = no.estilos
        ? `{ className: ${JSON.stringify(cls)}, style: ${estilosCE(no.estilos)} }`
        : `{ className: ${JSON.stringify(cls)} }`
      const filhos = no.corpo.map((n: any) => gerarNoCE(n, depth + 1)).join(",\n")
      return `${pad}React.createElement("section", ${props},\n${filhos}\n${pad})`
    }
    case "Grade": {
      const baseStyle = `{ display: "grid", gridTemplateColumns: "repeat(${no.colunas}, 1fr)", gap: "24px" }`
      const style = no.estilos
        ? `Object.assign({}, ${baseStyle}, ${estilosCE(no.estilos)})`
        : baseStyle
      const filhos = no.corpo.map((n: any) => gerarNoCE(n, depth + 1)).join(",\n")
      return `${pad}React.createElement("div", { style: ${style} },\n${filhos}\n${pad})`
    }
    case "Espacador": {
      const valor = /[%a-z]/.test(no.tamanho) ? no.tamanho : `${no.tamanho}px`
      return `${pad}React.createElement("div", { className: "espacador", style: { height: "${valor}" } })`
    }
    case "Subtitulo": {
      const props = no.estilos
        ? `{ className: "subtitulo", style: ${estilosCE(no.estilos)} }`
        : `{ className: "subtitulo" }`
      return `${pad}React.createElement("h2", ${props}, ${gerarExprCE(no.valor)})`
    }
    case "Icone": {
      const props = no.estilos
        ? `{ className: "icone", style: ${estilosCE(no.estilos)} }`
        : `{ className: "icone" }`
      return `${pad}React.createElement("span", ${props}, ${JSON.stringify(no.valor)})`
    }
    case "Ligacao": {
      const externo = no.para.startsWith("http")
        ? `, target: "_blank", rel: "noopener noreferrer"`
        : ""
      const props = no.estilos
        ? `{ className: "ligacao", href: ${JSON.stringify(no.para)}${externo}, style: ${estilosCE(no.estilos)} }`
        : `{ className: "ligacao", href: ${JSON.stringify(no.para)}${externo} }`
      return `${pad}React.createElement("a", ${props}, ${JSON.stringify(no.label)})`
    }
    case "Distintivo": {
      const props = no.estilos
        ? `{ className: "distintivo", style: ${estilosCE(no.estilos)} }`
        : `{ className: "distintivo" }`
      return `${pad}React.createElement("span", ${props}, ${JSON.stringify(no.label)})`
    }
    case "Divisor": {
      const props = no.estilos
        ? `{ className: "divisor", style: ${estilosCE(no.estilos)} }`
        : `{ className: "divisor" }`
      return `${pad}React.createElement("hr", ${props})`
    }
    case "Video": {
      const src = converterUrlVideoCE(no.origem)
      const props = no.estilos
        ? `{ className: "video-contentor", style: ${estilosCE(no.estilos)} }`
        : `{ className: "video-contentor" }`
      return `${pad}React.createElement("div", ${props},\n${pad}  React.createElement("iframe", { src: ${JSON.stringify(src)}, className: "video", allowFullScreen: true, loading: "lazy", title: "vídeo" })\n${pad})`
    }
    case "Lista": {
      const props = no.estilos
        ? `{ className: "lista", style: ${estilosCE(no.estilos)} }`
        : `{ className: "lista" }`
      const itens = no.itens
        .map((item: string) => `${pad}  React.createElement("li", { className: "lista-item" }, ${JSON.stringify(item)})`)
        .join(",\n")
      return `${pad}React.createElement("ul", ${props},\n${itens}\n${pad})`
    }
    case "Citacao": {
      const props = no.estilos
        ? `{ className: "citacao", style: ${estilosCE(no.estilos)} }`
        : `{ className: "citacao" }`
      const autor = no.autor
        ? `,\n${pad}  React.createElement("cite", { className: "citacao-autor" }, ${JSON.stringify("— " + no.autor)})`
        : ""
      return `${pad}React.createElement("blockquote", ${props},\n${pad}  React.createElement("p", null, ${JSON.stringify(no.texto)})${autor}\n${pad})`
    }
    case "Funcao":
    case "Se":
    case "Enquanto":
    case "Escolher":
    case "ParaCada":
    case "Para":
    case "Atribuir":
    case "Variavel":
    case "Rota":
    case "Modelo":
    case "Retornar":
      return `${pad}// ${no.tipo}: omitido na geração CE`
    default:
      return `${pad}null`
  }
}

function converterUrlVideoCE(url: string): string {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  return url
}

function estilosCE(estilos: any): string {
  const obj: Record<string, string> = {}
  if (estilos.cor) obj.color = estilos.cor
  if (estilos.fundo) obj.background = estilos.fundo
  if (estilos.largura) obj.width = /[%a-z]/.test(estilos.largura) ? estilos.largura : `${estilos.largura}px`
  if (estilos.altura) obj.height = /[%a-z]/.test(estilos.altura) ? estilos.altura : `${estilos.altura}px`
  if (estilos.padding) obj.padding = /[%a-z]/.test(estilos.padding) ? estilos.padding : `${estilos.padding}px`
  if (estilos.margem) obj.margin = /[%a-z]/.test(estilos.margem) ? estilos.margem : `${estilos.margem}px`
  if (estilos.borda) obj.border = estilos.borda
  if (estilos.raio) obj.borderRadius = /[%a-z]/.test(estilos.raio) ? estilos.raio : `${estilos.raio}px`
  if (estilos.sombra) obj.boxShadow = estilos.sombra
  if (estilos.opacidade) obj.opacity = estilos.opacidade
  if (estilos.espacamento) obj.gap = /[%a-z]/.test(estilos.espacamento) ? estilos.espacamento : `${estilos.espacamento}px`
  if (estilos.tamanho) obj.fontSize = /[%a-z]/.test(estilos.tamanho) ? estilos.tamanho : `${estilos.tamanho}px`
  if (estilos.peso) obj.fontWeight = estilos.peso
  if (estilos.alinhamento) obj.textAlign = traduzirAlinhamentoCE(estilos.alinhamento)
  if (estilos.justificar) obj.justifyContent = traduzirAlinhamentoCE(estilos.justificar)
  if (estilos.centralizar) {
    obj.display = "flex"
    obj.justifyContent = "center"
    obj.alignItems = "center"
    obj.flexDirection = "column"
  }
  if (estilos.animacao) obj.animation = estilos.animacao
  if (estilos.cursor) obj.cursor = estilos.cursor
  if (estilos.overflow) obj.overflow = estilos.overflow
  if (estilos.transicao) obj.transition = estilos.transicao
  if (estilos.decoracao) obj.textDecoration = estilos.decoracao
  if (estilos.maiusculas) obj.textTransform = estilos.maiusculas
  return JSON.stringify(obj)
}

function traduzirAlinhamentoCE(valor: string): string {
  const mapa: Record<string, string> = {
    centro: "center",
    esquerda: "left",
    direita: "right",
    inicio: "flex-start",
    fim: "flex-end",
    entre: "space-between",
    ao_redor: "space-around",
  }
  return mapa[valor] ?? valor
}

function slugCE(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function gerarExprCE(expr: any): string {
  if (!expr) return '""'
  if (expr.tipo === "Str") return JSON.stringify(expr.valor)
  if (expr.tipo === "Num") return expr.valor
  if (expr.tipo === "Bool") return expr.valor ? "true" : "false"
  if (expr.tipo === "Ident") return expr.nome
  if (expr.tipo === "Chamada") return `${expr.nome}(${expr.args.map(gerarExprCE).join(", ")})`
  return JSON.stringify(String(expr))
}

function gerarNo(no: No): string {
  switch (no.tipo) {
    case "Pagina":
      return gerarPagina(no)
    case "Titulo":
      return `      <h1>${gerarJSXConteudo(no.valor)}</h1>`
    case "Texto":
      return `      <p>${gerarJSXConteudo(no.valor)}</p>`
    case "Botao":
      return `      <button>${escaparHTML(no.label)}</button>`
    case "Entrada":
      return `      <input type="${escaparHTML(no.tipoInput)}" />`
    case "Imagem":
      return `      <img src="${escaparHTML(no.origem)}" />`
    case "Linha":
      return `      <div className="flex gap-4">\n${no.corpo.map(gerarNo).join("\n")}\n      </div>`
    case "Coluna":
      return `      <div className="flex flex-col gap-4">\n${no.corpo.map(gerarNo).join("\n")}\n      </div>`
    case "Cartao":
      return `      <div className="card p-6 rounded-xl shadow-md bg-white">\n${no.corpo.map(gerarNo).join("\n")}\n      </div>`
    case "Funcao":
      return gerarFuncao(no)
    case "Se":
      return gerarSe(no)
    case "Enquanto":
      return gerarEnquanto(no)
    case "Escolher":
      return gerarEscolher(no)
    case "ParaCada":
      return gerarParaCada(no)
    case "Para":
      return gerarPara(no)
    case "Atribuir":
      return gerarAtribuir(no)
    case "Variavel":
      return gerarVariavel(no)
    case "Rota":
      return gerarRota(no)
    case "Modelo":
      return gerarModeloPrisma(no)
    case "Retornar":
      return `      return ${gerarExpr(no.valor)}`
    // MVP Landing Page: novos nós
    case "Secao":
      return `      <section>\n${no.corpo.map(gerarNo).join("\n")}\n      </section>`
    case "Grade":
      return `      <div style={{display: "grid", gridTemplateColumns: "repeat(${no.colunas}, 1fr)", gap: "24px"}}>\n${no.corpo.map(gerarNo).join("\n")}\n      </div>`
    case "Espacador":
      return `      <div style={{height: "${no.tamanho}px"}} />`
    // Novos nós
    case "Subtitulo":
      return `      <h2 className="subtitulo">${gerarJSXConteudo(no.valor)}</h2>`
    case "Icone":
      return `      <span className="icone">${escaparHTML(no.valor)}</span>`
    case "Ligacao": {
      const externo = no.para.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
      return `      <a href="${escaparHTML(no.para)}" className="ligacao"${externo}>${escaparHTML(no.label)}</a>`
    }
    case "Distintivo":
      return `      <span className="distintivo">${escaparHTML(no.label)}</span>`
    case "Divisor":
      return `      <hr className="divisor" />`
    case "Video": {
      const src = converterUrlVideoCE(no.origem)
      return `      <div className="video-contentor">\n        <iframe src="${escaparHTML(src)}" className="video" allowFullScreen loading="lazy" title="vídeo" />\n      </div>`
    }
    case "Lista":
      return `      <ul className="lista">\n${no.itens.map((i) => `        <li className="lista-item">${escaparHTML(i)}</li>`).join("\n")}\n      </ul>`
    case "Citacao": {
      const autor = no.autor ? `\n        <cite className="citacao-autor">— ${escaparHTML(no.autor)}</cite>` : ""
      return `      <blockquote className="citacao">\n        <p>${escaparHTML(no.texto)}</p>${autor}\n      </blockquote>`
    }
  }
}

function gerarPagina(no: No & { tipo: "Pagina" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  return [
    `export default function ${no.nome}() {`,
    `  return (`,
    `    <>`,
    corpo,
    `    </>`,
    `  )`,
    `}`,
  ].join("\n")
}

function gerarFuncao(no: No & { tipo: "Funcao" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  const params = no.params.join(", ")
  return [
    `function ${no.nome}(${params}) {`,
    corpo,
    `}`,
  ].join("\n")
}

function gerarSe(no: No & { tipo: "Se" }): string {
  const entao = no.entao.map(gerarNo).join("\n")
  let senaoSe = ""
  if ((no as any).senaoSe) {
    senaoSe = (no as any).senaoSe.map(
      (ss: { condicao: any; corpo: No[] }) =>
        `    } else if (${gerarExpr(ss.condicao)}) {\n${ss.corpo.map(gerarNo).join("\n")}`
    ).join("\n")
  }
  const senao = no.senao.length
    ? `    } else {\n${no.senao.map(gerarNo).join("\n")}\n    }`
    : senaoSe ? `    }` : ""
  const inicio = senaoSe ? `\n${senaoSe}\n${senao}` : senao
  return [
    `    if (${gerarExpr(no.condicao)}) {`,
    entao,
    inicio,
    `    }`,
  ].join("\n")
}

function gerarEnquanto(no: No & { tipo: "Enquanto" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  return [
    `    while (${gerarExpr(no.condicao)}) {`,
    corpo,
    `    }`,
  ].join("\n")
}

function gerarEscolher(no: No & { tipo: "Escolher" }): string {
  const casos = no.casos.map((c) => {
    const corpo = c.corpo.map(gerarNo).join("\n")
    return `    case ${gerarExpr(c.valor)}:\n${corpo}\n      break`
  }).join("\n")
  const padrao = (no as any).padrao
    ? `\n    default:\n${(no as any).padrao.map((n: No) => gerarNo(n)).join("\n")}`
    : ""
  return [
    `    switch (${gerarExpr(no.expr)}) {`,
    casos,
    padrao,
    `    }`,
  ].join("\n")
}

function gerarPara(no: No & { tipo: "Para" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  const passo = (no as any).passo ? gerarExpr((no as any).passo) : "1"
  return [
    `    for (let ${no.variavel} = ${gerarExpr(no.inicio)}; ${no.variavel} <= ${gerarExpr(no.ate)}; ${no.variavel} += ${passo}) {`,
    corpo,
    `    }`,
  ].join("\n")
}

function gerarAtribuir(no: No & { tipo: "Atribuir" }): string {
  return `    ${no.nome} = ${gerarExpr(no.valor)}`
}

function gerarVariavel(no: No & { tipo: "Variavel" }): string {
  if ((no as any).valor) {
    return `    let ${no.nome} = ${gerarExpr((no as any).valor)}`
  }
  return `    let ${no.nome}`
}

const OPERADOR_PARA_JS: Record<string, string> = {
  e: "&&",
  ou: "||",
  nao: "!",
}

function gerarExpr(expr: Expressao): string {
  switch (expr.tipo) {
    case "Str":
      return JSON.stringify(expr.valor)
    case "Num":
      return expr.valor
    case "Bool":
      return expr.valor ? "true" : "false"
    case "Ident":
      return expr.nome
    case "Binaria":
      const oper = OPERADOR_PARA_JS[expr.oper] ?? expr.oper
      return `${gerarExpr(expr.esq)} ${oper} ${gerarExpr(expr.dir)}`
    case "Unaria":
      const op = expr.oper === "nao" ? "!" : expr.oper
      return `${op}${gerarExpr(expr.expr)}`
    case "Chamada":
      return `${expr.nome}(${expr.args.map(gerarExpr).join(", ")})`
  }
}

function gerarJSXConteudo(expr: Expressao): string {
  if (expr.tipo === "Str") {
    return escaparHTML(expr.valor)
  }
  return `{${gerarExpr(expr)}}`
}

function gerarParaCada(no: No & { tipo: "ParaCada" }): string {
  const corpo = no.corpo.map(gerarNo).join("\n")
  return [
    `    {${no.colecao}.map((${no.variavel}) => (`,
    `      <>`,
    corpo,
    `      </>`,
    `    ))}`,
  ].join("\n")
}

function gerarRota(no: No & { tipo: "Rota" }): string {
  const metodos = no.metodos.map(gerarMetodoRota).join("\n\n")
  return [
    `// Rota: ${no.caminho}`,
    metodos,
  ].join("\n")
}

const METODO_PARA_HTTP: Record<string, string> = {
  obter: "GET",
  criar: "POST",
  atualizar: "PUT",
  deletar: "DELETE",
}

function gerarMetodoRota(metodo: MetodoRota): string {
  const verbo = METODO_PARA_HTTP[metodo.tipo] ?? metodo.tipo.toUpperCase()
  return [
    `export async function ${verbo}(request: Request) {`,
    `  // TODO: implementar ${metodo.tipo}`,
    `  return Response.json({})`,
    `}`,
  ].join("\n")
}

function gerarModeloPrisma(no: No & { tipo: "Modelo" }): string {
  const campos = no.campos.map(gerarCampoPrisma).join("\n")
  return [
    `model ${no.nome} {`,
    `  id    Int     @id @default(autoincrement())`,
    campos,
    `}`,
  ].join("\n")
}

function gerarCampoPrisma(campo: Campo): string {
  const tipoPrisma = mapearTipo(campo.tipo)
  const modificadores = campo.modificadores.map((m) => {
    switch (m) {
      case "unico":
        return "@unique"
      case "opcional":
        return "?"
      case "nao_nulo":
        return ""
      default:
        return ""
    }
  }).filter(Boolean).join(" ")
  const opcional = campo.modificadores.includes("opcional") ? "?" : ""
  return `  ${campo.nome} ${tipoPrisma}${opcional} ${modificadores}`
}

function mapearTipo(tipo: string): string {
  const mapa: Record<string, string> = {
    texto: "String",
    numero: "Int",
    booleano: "Boolean",
    decimal: "Float",
    data: "DateTime",
  }
  return mapa[tipo] ?? "String"
}

function escaparHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}
