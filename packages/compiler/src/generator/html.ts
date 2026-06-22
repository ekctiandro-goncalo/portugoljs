import { No, Estilos, Expressao } from "../ast.js"

// â”€â”€â”€ Tipos de saÃ­da â”€â”€â”€

export interface SaidaHTML {
  html: string
  css: string
}

// â”€â”€â”€ Ãcones Lucide em PortuguÃªs â”€â”€â”€
// SVG inline â€” zero dependÃªncias, funciona em HTML estÃ¡tico e React
// Nomes em portuguÃªs mapeados para SVGs Lucide originais

const ICONES_LUCIDE: Record<string, string> = {
  // Setas & NavegaÃ§Ã£o
  seta_direita: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  seta_esquerda: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  seta_cima: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
  seta_baixo: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 12-7 7-7-7"/><path d="M12 5v14"/></svg>`,
  externo: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  fechar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  // AcÃ§Ãµes
  copiar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  descarregar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  partilhar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
  editar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  apagar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  // Estado & Feedback
  verificar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  erro: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  aviso: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  informacao: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  estrela: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  coracao: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  // Interface
  pesquisar: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  definicoes: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  utilizador: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
  utilizadores: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  notificacao: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  casa: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  // Tecnologia & Dev
  codigo: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  terminal: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  pacote: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
  foguete: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  relampago: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
  escudo: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  globo: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  relogio: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  grafico: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>`,
  livro: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>`,
  lampada: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  // Social
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
}

// Aliases em portuguÃªs para facilitar escrita
const ALIASES_ICONES: Record<string, string> = {
  // Formas curtas
  seta: "seta_direita",
  ok: "verificar",
  x: "fechar",
  mais: "seta_direita",
  // VariaÃ§Ãµes
  "seta-direita": "seta_direita",
  "seta-esquerda": "seta_esquerda",
  "seta-cima": "seta_cima",
  "seta-baixo": "seta_baixo",
}

export function resolverIcone(nome: string): string | null {
  const chave = nome.toLowerCase().replace(/\s+/g, "_")
  const svg = ICONES_LUCIDE[chave] ?? ICONES_LUCIDE[ALIASES_ICONES[chave] ?? ""] ?? null
  return svg
}

// â”€â”€â”€ Gerador principal â”€â”€â”€

export function gerarHTML(ast: No[]): SaidaHTML {
  const paginas = ast.filter((n) => n.tipo === "Pagina") as (No & { tipo: "Pagina" })[]

  if (paginas.length === 0) {
    // Se nÃ£o tem pagina, trata tudo como corpo de uma pÃ¡gina anÃ³nima
    const corpo = gerarCorpoHTML(ast, 2)
    return {
      html: montarDocumento("Portugol", corpo),
      css: gerarCSS(),
    }
  }

  // Gera para a primeira pÃ¡gina (MVP: uma pÃ¡gina por ficheiro)
  const pagina = paginas[0]
  const corpo = gerarCorpoHTML(pagina.corpo, 2)
  return {
    html: montarDocumento(pagina.nome, corpo),
    css: gerarCSS(),
  }
}

// â”€â”€â”€ Montar documento HTML completo â”€â”€â”€

function montarDocumento(titulo: string, corpo: string): string {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="author" content="Eketiandro Gonçalo">
  <meta name="generator" content="Portugol.js — by Eketiandro Gonçalo">
  <title>${escaparHTML(titulo)}</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
${corpo}
</body>
</html>`
}

// â”€â”€â”€ Gerar corpo HTML recursivo â”€â”€â”€

function gerarCorpoHTML(nos: No[], indent: number): string {
  return nos.map((no) => gerarNoHTML(no, indent)).join("\n")
}

function gerarNoHTML(no: No, indent: number): string {
  const pad = "  ".repeat(indent)

  switch (no.tipo) {
    case "Pagina":
      return gerarCorpoHTML(no.corpo, indent)

    case "Secao": {
      const cls = no.nome ? `secao secao-${slug(no.nome)}` : "secao"
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1)
      return `${pad}<section class="${classesComExtra(cls, no.estilos)}"${style}>\n${corpo}\n${pad}</section>`
    }

    case "Titulo": {
      const conteudo = expressaoParaTexto(no.valor)
      const estilo = estilosParaTipografia(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<h1 class="${classesComExtra('titulo', no.estilos)}"${style}>${conteudo}</h1>`
    }

    case "Texto": {
      const conteudo = expressaoParaTexto(no.valor)
      const estilo = estilosParaTipografia(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<p class="${classesComExtra('texto', no.estilos)}"${style}>${conteudo}</p>`
    }

    case "Botao": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<button class="${classesComExtra('botao', no.estilos)}"${style}>${escaparHTML(no.label)}</button>`
    }

    case "Entrada": {
      let attrs = `type="${escaparHTML(no.tipoInput)}" class="entrada"` // entrada nao tem estilos p/ classe extra
      if (no.placeholder) attrs += ` placeholder="${escaparHTML(no.placeholder)}"`
      if (no.rotulo) attrs += ` aria-label="${escaparHTML(no.rotulo)}"`
      return `${pad}<input ${attrs} />`
    }

    case "Imagem": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const alt = no.alt ? ` alt="${escaparHTML(no.alt)}"` : ' alt=""'
      return `${pad}<img src="${escaparHTML(no.origem)}"${alt} class="${classesComExtra('imagem', no.estilos)}"${style} />`
    }

    case "Linha": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1)
      return `${pad}<div class="${classesComExtra('linha', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Coluna": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1)
      return `${pad}<div class="${classesComExtra('coluna', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Grade": {
      const cls = no.colunas === 0 ? "grade grade-auto" : `grade grade-${no.colunas}`
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1)
      return `${pad}<div class="${classesComExtra(cls, no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Cartao": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1)
      return `${pad}<div class="${classesComExtra('cartao', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Espacador": {
      const valor = unidadeCSS(no.tamanho)
      return `${pad}<div class="espacador" style="height: ${valor}"></div>`
    }

    case "Subtitulo": {
      const conteudo = expressaoParaTexto(no.valor)
      const estilo = estilosParaTipografia(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<h2 class="${classesComExtra('subtitulo', no.estilos)}"${style}>${conteudo}</h2>`
    }

    case "Icone": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      // Tenta resolver como Ã­cone Lucide; senÃ£o usa como emoji/texto
      const svg = resolverIcone(no.valor)
      if (svg) {
        return `${pad}<span class="${classesComExtra('icone lucide', no.estilos)}"${style} aria-hidden="true">${svg}</span>`
      }
      return `${pad}<span class="${classesComExtra('icone', no.estilos)}"${style}>${escaparHTML(no.valor)}</span>`
    }

    case "Ligacao": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const externo = no.para.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
      return `${pad}<a href="${escaparHTML(no.para)}" class="${classesComExtra('ligacao', no.estilos)}"${style}${externo}>${escaparHTML(no.label)}</a>`
    }

    case "Distintivo": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<span class="${classesComExtra('distintivo', no.estilos)}"${style}>${escaparHTML(no.label)}</span>`
    }

    case "Divisor": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<hr class="${classesComExtra('divisor', no.estilos)}"${style} />`
    }

    case "Video": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      // Suporta YouTube, Vimeo e src directo
      const src = converterUrlVideo(no.origem)
      return `${pad}<div class="video-contentor"${style}>\n${pad}  <iframe src="${escaparHTML(src)}" class="video" allowfullscreen loading="lazy" title="vÃ­deo"></iframe>\n${pad}</div>`
    }

    case "Lista": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const itens = no.itens
        .map((item) => `${pad}  <li class="lista-item">${escaparHTML(item)}</li>`)
        .join("\n")
      return `${pad}<ul class="${classesComExtra('lista', no.estilos)}"${style}>\n${itens}\n${pad}</ul>`
    }

    case "Citacao": {
      const estilo = estilosParaCSS(no.estilos)
      const style = estilo ? ` style="${estilo}"` : ""
      const autor = no.autor
        ? `\n${pad}  <cite class="citacao-autor">â€” ${escaparHTML(no.autor)}</cite>`
        : ""
      return `${pad}<blockquote class="${classesComExtra('citacao', no.estilos)}"${style}>\n${pad}  <p>${escaparHTML(no.texto)}</p>${autor}\n${pad}</blockquote>`
    }

    // NÃ³s nÃ£o-visuais: ignorar no HTML
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
    case "Parar":
    case "Continuar":
    case "Escrever":
      return `${pad}<!-- ${no.tipo}: nÃ£o suportado em HTML estÃ¡tico -->`

    default:
      return ""
  }
}

// â”€â”€â”€ Converter estilos da AST para CSS inline â”€â”€â”€

// ─── Concatenar classes base + extra (propriedade classe) ───

function classesComExtra(base: string, estilos?: Estilos): string {
  if (!estilos?.classe) return base
  return `${base} ${estilos.classe}`
}

function estilosParaCSS(estilos?: Estilos): string {
  if (!estilos) return ""
  const partes: string[] = []

  if (estilos.cor) partes.push(`color: ${estilos.cor}`)
  if (estilos.fundo) partes.push(`background: ${estilos.fundo}`)
  if (estilos.largura) partes.push(`width: ${unidadeCSS(estilos.largura)}`)
  if (estilos.altura) partes.push(`height: ${unidadeCSS(estilos.altura)}`)
  if (estilos.padding) partes.push(`padding: ${unidadeCSS(estilos.padding)}`)
  if (estilos.margem) partes.push(`margin: ${unidadeCSS(estilos.margem)}`)
  if (estilos.borda) partes.push(`border: ${estilos.borda}`)
  if (estilos.raio) partes.push(`border-radius: ${unidadeCSS(estilos.raio)}`)
  if (estilos.sombra) partes.push(`box-shadow: ${estilos.sombra}`)
  if (estilos.opacidade) partes.push(`opacity: ${estilos.opacidade}`)
  if (estilos.espacamento) partes.push(`gap: ${unidadeCSS(estilos.espacamento)}`)
  if (estilos.justificar) partes.push(`justify-content: ${traduzirAlinhamento(estilos.justificar)}`)
  if (estilos.centralizar) {
    partes.push("display: flex", "justify-content: center", "align-items: center", "flex-direction: column")
  }
  // Tipografia
  if (estilos.tamanho) partes.push(`font-size: ${unidadeCSS(estilos.tamanho)}`)
  if (estilos.peso) partes.push(`font-weight: ${estilos.peso}`)
  if (estilos.alinhamento) partes.push(`text-align: ${traduzirAlinhamento(estilos.alinhamento)}`)
  // Novos
  if (estilos.animacao) partes.push(`animation: ${estilos.animacao}`)
  if (estilos.cursor) partes.push(`cursor: ${estilos.cursor}`)
  if (estilos.overflow) partes.push(`overflow: ${estilos.overflow}`)
  if (estilos.transicao) partes.push(`transition: ${estilos.transicao}`)
  if (estilos.decoracao) partes.push(`text-decoration: ${estilos.decoracao}`)
  if (estilos.maiusculas) partes.push(`text-transform: ${estilos.maiusculas}`)

  return partes.join("; ")
}

function estilosParaTipografia(estilos?: Estilos): string {
  if (!estilos) return ""
  return estilosParaCSS(estilos)
}

// â”€â”€â”€ UtilitÃ¡rios â”€â”€â”€

function unidadeCSS(valor: string): string {
  // Se jÃ¡ tem unidade (%, px, em, rem, vh, vw), mantÃ©m
  if (/[%a-z]/.test(valor)) return valor
  // SenÃ£o, assume px
  return `${valor}px`
}

function traduzirAlinhamento(valor: string): string {
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

function expressaoParaTexto(expr: Expressao): string {
  if (expr.tipo === "Str") return escaparHTML(expr.valor)
  if (expr.tipo === "Num") return expr.valor
  if (expr.tipo === "Bool") return expr.valor ? "verdadeiro" : "falso"
  if (expr.tipo === "Ident") return escaparHTML(expr.nome)
  return ""
}

function converterUrlVideo(url: string): string {
  // YouTube: https://www.youtube.com/watch?v=ID â†’ embed
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
  // Vimeo: https://vimeo.com/ID â†’ embed
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  // URL directa (mp4, etc.)
  return url
}

function slug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function escaparHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

// â”€â”€â”€ CSS Premium Default â”€â”€â”€


// ─── CSS Premium Default ───

function gerarCSS(): string {
  return `/* ═══════════════════════════════════════════════════════════
   Portugol.js — Design System v4 (Tailwind-style)
   by Eketiandro Gonçalo
   ═══════════════════════════════════════════════════════════ */

/* ─── Reset ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; }
body { font-family: var(--fonte-ui); color: var(--texto); background: var(--fundo); line-height: 1.6; overflow-x: hidden; min-height: 100dvh; }
img, video, canvas, svg { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: inherit; }
button { cursor: pointer; font: inherit; color: inherit; }
ul, ol { list-style: none; }

/* ─── Design Tokens ─── */
:root {
  --fundo:           #ffffff;
  --fundo-elevado:   #fafafa;
  --fundo-subtil:    #f4f4f5;
  --superfice:       #ffffff;
  --borda:           rgba(0,0,0,0.07);
  --borda-forte:     rgba(0,0,0,0.13);
  --texto:           #0a0a0a;
  --texto-2:         #3f3f46;
  --texto-3:         #71717a;
  --texto-inv:       #ffffff;
  --acento:          #0a0a0a;
  --acento-hover:    #27272a;
  --acento-suave:    rgba(10,10,10,0.05);
  --info:            #3b82f6;
  --sucesso:         #22c55e;
  --aviso:           #f59e0b;
  --erro:            #ef4444;
  --gradiente-hero:  linear-gradient(160deg, #fafafa 0%, #ffffff 40%, #f5f5f7 100%);
  --gradiente-acento: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --gradiente-colorido: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  --brilho:          rgba(255,255,255,0.6);
  --fonte-display:   'Cormorant Garamond', Georgia, serif;
  --fonte-ui:        'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --fonte-mono:      'JetBrains Mono', 'Fira Code', monospace;
  --raio-sm: 6px; --raio: 10px; --raio-lg: 16px; --raio-xl: 24px; --raio-full: 9999px;
  --sombra-xs: 0 1px 2px rgba(0,0,0,0.04);
  --sombra-sm: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --sombra:    0 4px 16px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  --sombra-md: 0 8px 32px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05);
  --sombra-lg: 0 20px 60px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.06);
  --sombra-xl: 0 32px 80px rgba(0,0,0,0.13), 0 12px 24px rgba(0,0,0,0.07);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 120ms; --dur: 220ms; --dur-slow: 380ms;
  --max: 1200px; --padding-x: clamp(20px, 5vw, 48px);
  --espaco-1: 4px; --espaco-2: 8px; --espaco-3: 12px; --espaco-4: 16px;
  --espaco-5: 24px; --espaco-6: 32px; --espaco-8: 48px; --espaco-10: 64px; --espaco-12: 80px;
}

/* ─── Dark mode (sistema + classe manual) ─── */
@media (prefers-color-scheme: dark) {
  :root, :root.light { --fundo: #080810; --fundo-elevado: #0e0e18; --fundo-subtil: #14141f; --superfice: #1a1a28; --borda: rgba(255,255,255,0.07); --borda-forte: rgba(255,255,255,0.13); --texto: #f0f0f8; --texto-2: #c4c4d4; --texto-3: #8888aa; --texto-inv: #080810; --acento: #e8e8ff; --acento-hover: #ffffff; --acento-suave: rgba(232,232,255,0.08); --gradiente-hero: linear-gradient(160deg, #080810 0%, #0e0e1a 50%, #080810 100%); --brilho: rgba(255,255,255,0.03); --sombra-sm: 0 2px 8px rgba(0,0,0,0.5); --sombra-md: 0 8px 32px rgba(0,0,0,0.6); --sombra-lg: 0 20px 60px rgba(0,0,0,0.7); --sombra-xl: 0 32px 80px rgba(0,0,0,0.8); }
}
:root.dark { --fundo: #080810; --fundo-elevado: #0e0e18; --fundo-subtil: #14141f; --superfice: #1a1a28; --borda: rgba(255,255,255,0.07); --borda-forte: rgba(255,255,255,0.13); --texto: #f0f0f8; --texto-2: #c4c4d4; --texto-3: #8888aa; --texto-inv: #080810; --acento: #e8e8ff; --acento-hover: #ffffff; --acento-suave: rgba(232,232,255,0.08); --gradiente-hero: linear-gradient(160deg, #080810 0%, #0e0e1a 50%, #080810 100%); --brilho: rgba(255,255,255,0.03); --sombra-sm: 0 2px 8px rgba(0,0,0,0.5); --sombra-md: 0 8px 32px rgba(0,0,0,0.6); --sombra-lg: 0 20px 60px rgba(0,0,0,0.7); --sombra-xl: 0 32px 80px rgba(0,0,0,0.8); }
:root.light { --fundo: #ffffff; --fundo-elevado: #fafafa; --fundo-subtil: #f4f4f5; --superfice: #ffffff; --borda: rgba(0,0,0,0.07); --borda-forte: rgba(0,0,0,0.13); --texto: #0a0a0a; --texto-2: #3f3f46; --texto-3: #71717a; --texto-inv: #ffffff; --acento: #0a0a0a; --acento-hover: #27272a; --acento-suave: rgba(10,10,10,0.05); --gradiente-hero: linear-gradient(160deg, #fafafa 0%, #ffffff 40%, #f5f5f7 100%); --brilho: rgba(255,255,255,0.6); --sombra-sm: 0 2px 8px rgba(0,0,0,0.06); --sombra-md: 0 8px 32px rgba(0,0,0,0.09); --sombra-lg: 0 20px 60px rgba(0,0,0,0.11); --sombra-xl: 0 32px 80px rgba(0,0,0,0.13); }

/* ═══════════════════════════════════════════════════════
   KEYFRAMES
   ═══════════════════════════════════════════════════════ */
@keyframes entrar-baixo { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes entrar-cima { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes aparecer { from { opacity: 0; } to { opacity: 1; } }
@keyframes escalar { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
@keyframes brilho-sweep { 0% { left: -100%; } 100% { left: 200%; } }
@keyframes pulsar { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes rodar { to { transform: rotate(360deg); } }

/* ═══════════════════════════════════════════════════════
   COMPONENTES
   ═══════════════════════════════════════════════════════ */

/* ─── Secção ─── */
.secao { width: 100%; max-width: var(--max); margin: 0 auto; padding: 80px var(--padding-x); animation: entrar-baixo var(--dur-slow) var(--ease) both; }
.secao-Nav { position: sticky; top: 0; z-index: 100; padding: 16px var(--padding-x); background: rgba(255,255,255,0.8); backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%); border-bottom: 1px solid var(--borda); animation: entrar-cima var(--dur-slow) var(--ease) both; }
:root.dark .secao-Nav, @media (prefers-color-scheme: dark) { .secao-Nav { background: rgba(8,8,16,0.85); } }
.secao-Hero { background: var(--gradiente-hero); position: relative; overflow: hidden; padding: 140px var(--padding-x); }
.secao-Hero::before { content: ''; position: absolute; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%); top: -200px; right: -100px; pointer-events: none; }
.secao-Hero::after { content: ''; position: absolute; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; }
.secao-Numeros { background: var(--fundo-subtil); padding: 64px var(--padding-x); }
.secao-CTA { background: var(--gradiente-acento); border-radius: var(--raio-xl); margin: 0 var(--padding-x) 80px; max-width: calc(var(--max) - var(--padding-x) * 2); }
.secao-CTA .titulo, .secao-CTA .subtitulo { color: rgba(255,255,255,0.96); }
.secao-CTA .texto { color: rgba(255,255,255,0.65); }
.secao-CTA .distintivo { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.secao-CTA .botao { background: #ffffff; color: #0a0a0a; }
.secao-CTA .botao:hover { background: #f0f0f0; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.secao-CTA .lista-item { color: rgba(255,255,255,0.65); }
.secao-CTA .lista-item::before { background: rgba(255,255,255,0.35); }
.secao-CTA .icone.lucide { color: rgba(255,255,255,0.75); }
.secao-Rodape { background: var(--fundo-subtil); border-top: 1px solid var(--borda); padding: 64px var(--padding-x) 40px; }
.secao-Features { background: var(--fundo); }
.secao-Testemunhas { background: var(--fundo-subtil); }

/* ─── Títulos & Texto ─── */
.titulo { font-family: var(--fonte-display); font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 600; line-height: 1.04; letter-spacing: -0.03em; color: var(--texto); margin-bottom: 16px; animation: entrar-baixo var(--dur-slow) var(--ease) both; }
.subtitulo { font-family: var(--fonte-display); font-size: clamp(1.2rem, 2.5vw, 1.9rem); font-weight: 500; line-height: 1.25; letter-spacing: -0.015em; color: var(--texto-2); margin-bottom: 12px; }
.texto { font-family: var(--fonte-ui); font-size: 1.05rem; line-height: 1.75; color: var(--texto-3); margin-bottom: 8px; }

/* ─── Botão ─── */
.botao { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 28px; font-family: var(--fonte-ui); font-size: 0.9rem; font-weight: 500; letter-spacing: 0.01em; color: var(--texto-inv); background: var(--acento); border: 1px solid transparent; border-radius: var(--raio); cursor: pointer; text-decoration: none; white-space: nowrap; position: relative; overflow: hidden; transition: background var(--dur) var(--ease), transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease); -webkit-user-select: none; user-select: none; }
.botao::after { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); transform: skewX(-20deg); }
.botao:hover::after { animation: brilho-sweep 0.5s var(--ease) forwards; }
.botao:hover { background: var(--acento-hover); transform: translateY(-2px) scale(1.01); box-shadow: var(--sombra-md); }
.botao:active { transform: translateY(0) scale(0.99); box-shadow: var(--sombra-sm); }
.botao:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; }

/* Botão Outline */
.botao-outline { background: transparent; color: var(--acento); border-color: var(--acento); }
.botao-outline::after { display: none; }
.botao-outline:hover { background: var(--acento-suave); color: var(--acento-hover); border-color: var(--acento-hover); transform: translateY(-2px); box-shadow: none; }

/* Botão Ghost */
.botao-ghost { background: transparent; color: var(--texto-2); border-color: transparent; }
.botao-ghost::after { display: none; }
.botao-ghost:hover { background: var(--acento-suave); color: var(--texto); transform: translateY(-1px); box-shadow: none; }

/* Botão Gradiente */
.botao-gradiente { background: var(--gradiente-colorido); color: #ffffff; border: none; }
.botao-gradiente:hover { background: var(--gradiente-colorido); filter: saturate(1.2) brightness(1.1); transform: translateY(-2px) scale(1.01); box-shadow: 0 8px 32px rgba(99,102,241,0.3); }

/* Botão Tamanhos */
.botao-sm { padding: 8px 16px; font-size: 0.8rem; border-radius: var(--raio-sm); }
.botao-lg { padding: 16px 36px; font-size: 1.05rem; }

/* ─── Entrada ─── */
.entrada { display: block; width: 100%; max-width: 400px; padding: 12px 16px; font-family: var(--fonte-ui); font-size: 1rem; color: var(--texto); background: var(--fundo); border: 1px solid var(--borda-forte); border-radius: var(--raio); transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); outline: none; appearance: none; }
.entrada::placeholder { color: var(--texto-3); }
.entrada:hover { border-color: var(--texto-3); }
.entrada:focus { border-color: var(--acento); box-shadow: 0 0 0 3px var(--acento-suave); }
.entrada-erro { border-color: var(--erro); }
.entrada-erro:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }
.entrada-sucesso { border-color: var(--sucesso); }
.entrada-sucesso:focus { box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }

/* ─── Imagem ─── */
.imagem { width: 100%; height: auto; border-radius: var(--raio-lg); object-fit: cover; }
.imagem-redonda { border-radius: var(--raio-full); }
.imagem-sombra { box-shadow: var(--sombra-md); }
.imagem-borda { border: 1px solid var(--borda); }

/* ─── Layout ─── */
.linha { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.coluna { display: flex; flex-direction: column; gap: 16px; flex: 1; min-width: 0; }
.grade { display: grid; gap: 24px; width: 100%; }
.grade-1 { grid-template-columns: 1fr; }
.grade-2 { grid-template-columns: repeat(2, 1fr); }
.grade-3 { grid-template-columns: repeat(3, 1fr); }
.grade-4 { grid-template-columns: repeat(4, 1fr); }
.grade-5 { grid-template-columns: repeat(5, 1fr); }
.grade-6 { grid-template-columns: repeat(6, 1fr); }
.grade-auto { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grade-auto-pq { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }

/* ─── Cartão ─── */
.cartao { background: var(--superfice); border: 1px solid var(--borda); border-radius: var(--raio-lg); padding: 32px; position: relative; overflow: hidden; transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease); box-shadow: var(--sombra-sm); animation: escalar var(--dur-slow) var(--ease) both; }
.cartao::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, var(--brilho) 0%, transparent 50%); pointer-events: none; }
.cartao::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); pointer-events: none; }
.cartao:hover { transform: translateY(-4px) scale(1.005); box-shadow: var(--sombra-lg); border-color: var(--borda-forte); }
.cartao .titulo { font-size: clamp(1.1rem, 2vw, 1.5rem); margin-bottom: 8px; }
.cartao .subtitulo { font-size: 1.1rem; margin-bottom: 8px; }
.cartao .texto { font-size: 0.95rem; margin-bottom: 0; }
.cartao .imagem { margin: -32px -32px 24px; width: calc(100% + 64px); max-width: none; border-radius: var(--raio-lg) var(--raio-lg) 0 0; }

/* Variantes de Cartão */
.cartao-plano { box-shadow: none; border-color: var(--borda); background: transparent; animation: none; }
.cartao-plano::before, .cartao-plano::after { display: none; }
.cartao-plano:hover { transform: none; box-shadow: none; }
.cartao-borda { border-left: 3px solid var(--acento); box-shadow: none; }
.cartao-borda::before, .cartao-borda::after { display: none; }
.cartao-borda:hover { transform: translateX(4px); box-shadow: none; }
.cartao-destaque { background: linear-gradient(135deg, var(--acento-suave) 0%, transparent 80%); border-color: var(--acento); }
.cartao-destaque::after { background: linear-gradient(90deg, transparent, var(--acento-suave), transparent); }
.cartao-interativo { cursor: pointer; }
.cartao-interativo:active { transform: translateY(-2px) scale(0.99); }

/* ─── Espaçador ─── */
.espacador { display: block; flex-shrink: 0; }

/* ─── Ícone ─── */
.icone { display: inline-flex; align-items: center; justify-content: center; line-height: 1; vertical-align: middle; flex-shrink: 0; }
.icone.lucide { width: 1.2em; height: 1.2em; color: var(--texto-2); }
.icone.lucide svg { width: 100%; height: 100%; display: block; }
.cartao > .icone.lucide, .cartao .coluna > .icone.lucide { width: 2rem; height: 2rem; color: var(--texto); padding: 10px; background: var(--fundo-subtil); border: 1px solid var(--borda); border-radius: var(--raio); box-sizing: content-box; }
.icone-acento { color: var(--acento); }
.icone-info { color: var(--info); }
.icone-sucesso { color: var(--sucesso); }
.icone-aviso { color: var(--aviso); }
.icone-erro { color: var(--erro); }
.icone-lg { width: 2em; height: 2em; }
.icone-xl { width: 3em; height: 3em; }

/* ─── Ligação ─── */
.ligacao { display: inline-flex; align-items: center; gap: 4px; color: var(--texto-2); text-decoration: none; font-family: var(--fonte-ui); font-size: 0.9rem; font-weight: 450; padding-bottom: 1px; border-bottom: 1px solid transparent; transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.ligacao:hover { color: var(--texto); border-bottom-color: var(--texto); }
.ligacao:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; border-radius: 2px; }
.ligacao-acento { color: var(--info); }
.ligacao-acento:hover { color: var(--info); border-bottom-color: var(--info); }
.ligacao-seta::after { content: ' →'; transition: transform var(--dur) var(--ease); display: inline-block; }
.ligacao-seta:hover::after { transform: translateX(4px); }
.ligacao-externo::after { content: ' ↗'; font-size: 0.8em; }

/* ─── Distintivo ─── */
.distintivo { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; font-family: var(--fonte-ui); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--texto-2); background: var(--fundo-subtil); border: 1px solid var(--borda-forte); border-radius: var(--raio-full); white-space: nowrap; animation: aparecer var(--dur-slow) var(--ease) both; }
.distintivo-acento { background: var(--acento); color: var(--texto-inv); border-color: var(--acento); }
.distintivo-info { background: rgba(59,130,246,0.1); color: var(--info); border-color: rgba(59,130,246,0.2); }
.distintivo-sucesso { background: rgba(34,197,94,0.1); color: var(--sucesso); border-color: rgba(34,197,94,0.2); }
.distintivo-aviso { background: rgba(245,158,11,0.1); color: var(--aviso); border-color: rgba(245,158,11,0.2); }
.distintivo-erro { background: rgba(239,68,68,0.1); color: var(--erro); border-color: rgba(239,68,68,0.2); }
.distintivo-sm { padding: 3px 10px; font-size: 0.65rem; }
.distintivo-lg { padding: 8px 20px; font-size: 0.8rem; }

/* ─── Divisor ─── */
.divisor { display: block; width: 100%; height: 1px; background: var(--borda); border: none; margin: 0; }
.divisor-texto { display: flex; align-items: center; gap: 16px; color: var(--texto-3); font-size: 0.82rem; font-weight: 500; }
.divisor-texto::before, .divisor-texto::after { content: ''; flex: 1; height: 1px; background: var(--borda); }
.divisor-espaco { margin: var(--espaco-6) 0; }

/* ─── Vídeo ─── */
.video-contentor { position: relative; width: 100%; padding-bottom: 56.25%; border-radius: var(--raio-lg); overflow: hidden; background: var(--fundo-subtil); box-shadow: var(--sombra-md); }
.video { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

/* ─── Lista ─── */
.lista { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; }
.lista-item { display: flex; align-items: flex-start; gap: 10px; font-family: var(--fonte-ui); font-size: 0.95rem; line-height: 1.6; color: var(--texto-2); }
.lista-item::before { content: ''; display: block; width: 5px; height: 5px; min-width: 5px; border-radius: 50%; background: var(--texto-3); margin-top: 8px; }
.lista-icone .lista-item::before { display: none; }
.lista-ordenada { counter-reset: item; }
.lista-ordenada .lista-item { counter-increment: item; }
.lista-ordenada .lista-item::before { content: counter(item); width: auto; height: auto; min-width: 24px; background: var(--acento-suave); color: var(--acento); border-radius: var(--raio-sm); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; padding: 2px 0; margin-top: 0; }

/* ─── Citação ─── */
.citacao { position: relative; padding: 32px; background: var(--fundo-subtil); border: 1px solid var(--borda); border-radius: var(--raio-lg); overflow: hidden; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.citacao:hover { transform: translateY(-2px); box-shadow: var(--sombra-md); }
.citacao::before { content: '"'; position: absolute; top: -16px; left: 20px; font-family: var(--fonte-display); font-size: 7rem; line-height: 1; color: var(--borda-forte); pointer-events: none; user-select: none; }
.citacao p { font-family: var(--fonte-display); font-size: 1.1rem; font-style: italic; line-height: 1.75; color: var(--texto); margin-bottom: 16px; position: relative; }
.citacao-autor { display: block; font-family: var(--fonte-ui); font-size: 0.82rem; font-style: normal; font-weight: 500; color: var(--texto-3); letter-spacing: 0.02em; }
.citacao-destaque { background: linear-gradient(135deg, var(--acento-suave) 0%, transparent 80%); border-left: 3px solid var(--acento); }
.citacao-destaque::before { color: var(--acento); opacity: 0.2; }

/* ═══════════════════════════════════════════════════════
   UTILITÁRIOS (Tailwind-style)
   ═══════════════════════════════════════════════════════ */

/* Display */
.d-bloco { display: block; }
.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.d-grid { display: grid; }
.d-inline { display: inline; }
.d-oculto { display: none; }

/* Flex */
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }
.flex-auto { flex: 1 1 auto; }
.flex-inicial { flex: 0 1 auto; }
.flex-none { flex: none; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.justify-start { justify-content: flex-start; }
.gap-1 { gap: var(--espaco-1); }
.gap-2 { gap: var(--espaco-2); }
.gap-3 { gap: var(--espaco-3); }
.gap-4 { gap: var(--espaco-4); }
.gap-5 { gap: var(--espaco-5); }
.gap-6 { gap: var(--espaco-6); }
.gap-8 { gap: var(--espaco-8); }
.gap-10 { gap: var(--espaco-10); }

/* Grid */
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Padding */
.p-0 { padding: 0; }
.p-1 { padding: var(--espaco-1); }
.p-2 { padding: var(--espaco-2); }
.p-3 { padding: var(--espaco-3); }
.p-4 { padding: var(--espaco-4); }
.p-5 { padding: var(--espaco-5); }
.p-6 { padding: var(--espaco-6); }
.p-8 { padding: var(--espaco-8); }
.px-0 { padding-left: 0; padding-right: 0; }
.px-2 { padding-left: var(--espaco-2); padding-right: var(--espaco-2); }
.px-4 { padding-left: var(--espaco-4); padding-right: var(--espaco-4); }
.px-6 { padding-left: var(--espaco-6); padding-right: var(--espaco-6); }
.py-2 { padding-top: var(--espaco-2); padding-bottom: var(--espaco-2); }
.py-4 { padding-top: var(--espaco-4); padding-bottom: var(--espaco-4); }
.py-6 { padding-top: var(--espaco-6); padding-bottom: var(--espaco-6); }
.py-8 { padding-top: var(--espaco-8); padding-bottom: var(--espaco-8); }

/* Margin */
.m-0 { margin: 0; }
.m-auto { margin: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mt-0 { margin-top: 0; }
.mt-2 { margin-top: var(--espaco-2); }
.mt-4 { margin-top: var(--espaco-4); }
.mt-6 { margin-top: var(--espaco-6); }
.mt-8 { margin-top: var(--espaco-8); }
.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: var(--espaco-2); }
.mb-4 { margin-bottom: var(--espaco-4); }
.mb-6 { margin-bottom: var(--espaco-6); }
.mb-8 { margin-bottom: var(--espaco-8); }

/* Largura / Altura */
.w-full { width: 100%; }
.w-max { width: 100%; max-width: var(--max); }
.w-auto { width: auto; }
.w-metade { width: 50%; }
.h-full { height: 100%; }
.h-dvh { min-height: 100dvh; }
.h-auto { height: auto; }

/* Tipografia */
.text-esquerda { text-align: left; }
.text-centro { text-align: center; }
.text-direita { text-align: right; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 2rem; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-display { font-family: var(--fonte-display); }
.font-ui { font-family: var(--fonte-ui); }
.font-mono { font-family: var(--fonte-mono); }
.text-maiusculas { text-transform: uppercase; }
.text-minusculas { text-transform: lowercase; }
.text-capitalizar { text-transform: capitalize; }
.text-mono { font-variant-numeric: tabular-nums; }

/* Cores de texto */
.c-texto { color: var(--texto); }
.c-texto2 { color: var(--texto-2); }
.c-texto3 { color: var(--texto-3); }
.c-acento { color: var(--acento); }
.c-info { color: var(--info); }
.c-sucesso { color: var(--sucesso); }
.c-aviso { color: var(--aviso); }
.c-erro { color: var(--erro); }
.c-inv { color: var(--texto-inv); }

/* Cores de fundo */
.bg-fundo { background: var(--fundo); }
.bg-elevado { background: var(--fundo-elevado); }
.bg-subtil { background: var(--fundo-subtil); }
.bg-superfice { background: var(--superfice); }
.bg-acento { background: var(--acento); }
.bg-acento-suave { background: var(--acento-suave); }

/* Gradientes */
.gradiente-hero { background: var(--gradiente-hero); }
.gradiente-escuro { background: var(--gradiente-acento); }
.gradiente-colorido { background: var(--gradiente-colorido); }

/* Bordas & Raio */
.borda { border: 1px solid var(--borda); }
.borda-forte { border: 1px solid var(--borda-forte); }
.borda-0 { border: none; }
.borda-t { border-top: 1px solid var(--borda); }
.borda-b { border-bottom: 1px solid var(--borda); }
.raio-sm { border-radius: var(--raio-sm); }
.raio { border-radius: var(--raio); }
.raio-lg { border-radius: var(--raio-lg); }
.raio-xl { border-radius: var(--raio-xl); }
.raio-full { border-radius: var(--raio-full); }

/* Sombras */
.sombra-xs { box-shadow: var(--sombra-xs); }
.sombra-sm { box-shadow: var(--sombra-sm); }
.sombra { box-shadow: var(--sombra); }
.sombra-md { box-shadow: var(--sombra-md); }
.sombra-lg { box-shadow: var(--sombra-lg); }
.sombra-xl { box-shadow: var(--sombra-xl); }
.sombra-0 { box-shadow: none; }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-scroll { overflow: scroll; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

/* Posição */
.relativo { position: relative; }
.absoluto { position: absolute; }
.fixo { position: fixed; }
.sticky { position: sticky; }
.inset-0 { inset: 0; }
.z-1 { z-index: 1; }
.z-10 { z-index: 10; }
.z-50 { z-index: 50; }
.z-100 { z-index: 100; }

/* Opacidade */
.op-0 { opacity: 0; }
.op-25 { opacity: 0.25; }
.op-50 { opacity: 0.5; }
.op-75 { opacity: 0.75; }
.op-100 { opacity: 1; }

/* Glassmorphism */
.vidro { background: rgba(255,255,255,0.6); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border: 1px solid rgba(255,255,255,0.2); }
:root.dark .vidro, @media (prefers-color-scheme: dark) { .vidro { background: rgba(8,8,16,0.6); border-color: rgba(255,255,255,0.08); } }
.vidro-forte { background: rgba(255,255,255,0.85); backdrop-filter: blur(24px) saturate(200%); -webkit-backdrop-filter: blur(24px) saturate(200%); }
:root.dark .vidro-forte, @media (prefers-color-scheme: dark) { .vidro-forte { background: rgba(8,8,16,0.85); } }

/* Animação util */
.animar-fade { animation: aparecer var(--dur-slow) var(--ease) both; }
.animar-subir { animation: entrar-baixo var(--dur-slow) var(--ease) both; }
.animar-descer { animation: entrar-cima var(--dur-slow) var(--ease) both; }
.animar-escalar { animation: escalar var(--dur-slow) var(--ease) both; }
.animar-pulsar { animation: pulsar 2s ease-in-out infinite; }
.animar-rodar { animation: rodar 1s linear infinite; }
.animar-lento { animation-duration: 600ms; }
.animar-rapido { animation-duration: 200ms; }
.animar-atraso-1 { animation-delay: 100ms; }
.animar-atraso-2 { animation-delay: 200ms; }
.animar-atraso-3 { animation-delay: 300ms; }
.animar-atraso-4 { animation-delay: 400ms; }
.animar-atraso-5 { animation-delay: 500ms; }
.hover\:animar-subir:hover { animation: entrar-baixo 300ms var(--ease) both; }

/* Interatividade */
.pointer { cursor: pointer; }
.select-none { -webkit-user-select: none; user-select: none; }
.hover\:subir:hover { transform: translateY(-2px); }
.hover\:sombra:hover { box-shadow: var(--sombra-md); }
.hover\:brilho:hover { filter: brightness(1.05); }
.transicao { transition: all var(--dur) var(--ease); }
.transicao-rapida { transition: all var(--dur-fast) var(--ease); }
.transicao-lenta { transition: all var(--dur-slow) var(--ease); }

/* Responsividade: mostrar/esconder */
.mobile-only { display: none; }
.desktop-only { display: revert; }
.tablet-only { display: none; }

/* Container queries */
@container (min-width: 400px) {
  .cartao { container-type: inline-size; }
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVIDADE
   ═══════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .grade-4 { grid-template-columns: repeat(2, 1fr); }
  .grade-5 { grid-template-columns: repeat(3, 1fr); }
  .grade-6 { grid-template-columns: repeat(3, 1fr); }
  .desktop-only { display: none; }
  .tablet-only { display: revert; }
}

@media (max-width: 768px) {
  :root { --padding-x: 20px; }
  .secao { padding: 56px var(--padding-x); }
  .secao-Hero { padding: 80px var(--padding-x); }
  .secao-CTA { margin: 0 16px 48px; border-radius: var(--raio-lg); }
  .grade-2, .grade-3, .grade-4, .grade-5, .grade-6 { grid-template-columns: 1fr; }
  .linha { gap: 16px; }
  .botao, .botao-sm, .botao-lg { width: 100%; justify-content: center; }
  .cartao { padding: 24px; }
  .cartao .imagem { margin: -24px -24px 20px; width: calc(100% + 48px); }
  .mobile-only { display: revert; }
  .tablet-only { display: none; }
  .w-metade { width: 100%; }
  .grid-cols-2, .grid-cols-3, .grid-cols-4 { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .secao { padding: 40px var(--padding-x); }
  .titulo { font-size: clamp(1.8rem, 8vw, 2.5rem); }
}

/* ═══════════════════════════════════════════════════════
   SELEÇÃO & SCROLLBAR
   ═══════════════════════════════════════════════════════ */
::selection { background: var(--acento); color: var(--texto-inv); }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--borda-forte); border-radius: var(--raio-full); }
::-webkit-scrollbar-thumb:hover { background: var(--texto-3); }
`
}
