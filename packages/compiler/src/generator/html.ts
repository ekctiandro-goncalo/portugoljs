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

// â”€â”€â”€ Ambiente de variÃ¡veis para HTML dinÃ¢mico â”€â”€â”€

class Ambiente {
  private variaveis: Map<string, any> = new Map()
  private pai?: Ambiente

  constructor(pai?: Ambiente) {
    this.pai = pai
  }

  definir(nome: string, valor: any) { this.variaveis.set(nome, valor) }

  obter(nome: string): any {
    if (this.variaveis.has(nome)) return this.variaveis.get(nome)
    if (this.pai) return this.pai.obter(nome)
    return undefined
  }

  atribuir(nome: string, valor: any) {
    if (this.variaveis.has(nome)) { this.variaveis.set(nome, valor); return }
    if (this.pai) { this.pai.atribuir(nome, valor); return }
    this.variaveis.set(nome, valor)
  }
}

function avaliarExpr(expr: Expressao, env: Ambiente): any {
  switch (expr.tipo) {
    case "Str":  return expr.valor
    case "Num":  return isNaN(Number(expr.valor)) ? expr.valor : Number(expr.valor)
    case "Bool": return expr.valor
    case "Nulo": return null
    case "Ident": return env.obter(expr.nome) ?? expr.nome
    case "Array": return expr.elementos.map((e) => avaliarExpr(e, env))
    case "Unaria": {
      const v = avaliarExpr(expr.expr, env)
      if (expr.oper === "!") return !truthy(v)
      if (expr.oper === "-") return -Number(v)
      return v
    }
    case "Binaria": {
      if (expr.oper === "&&" || expr.oper === "e") return truthy(avaliarExpr(expr.esq, env)) && truthy(avaliarExpr(expr.dir, env))
      if (expr.oper === "||" || expr.oper === "ou") return truthy(avaliarExpr(expr.esq, env)) || truthy(avaliarExpr(expr.dir, env))
      const esq = avaliarExpr(expr.esq, env)
      const dir = avaliarExpr(expr.dir, env)
      switch (expr.oper) {
        case "+":  return typeof esq === "string" || typeof dir === "string" ? String(esq) + String(dir) : Number(esq) + Number(dir)
        case "-":  return Number(esq) - Number(dir)
        case "*":  return Number(esq) * Number(dir)
        case "/":  return dir !== 0 ? Number(esq) / Number(dir) : 0
        case "%":  return Number(esq) % Number(dir)
        case "==": return esq == dir
        case "!=": return esq != dir
        case ">":  return esq > dir; case "<":  return esq < dir
        case ">=": return esq >= dir; case "<=": return esq <= dir
        default:   return esq
      }
    }
    case "Chamada": {
      const fn = env.obter(expr.nome)
      if (typeof fn === "function") return fn(...expr.args.map((a) => avaliarExpr(a, env)))
      return undefined
    }
  }
  return undefined
}

function truthy(val: any): boolean {
  if (val === false || val === null || val === undefined || val === 0 || val === "") return false
  if (val === "falso") return false
  if (val === "verdadeiro") return true
  return true
}

function interpolador(str: string, env: Ambiente): string {
  return str.replace(/\{(\w+)\}/g, (_, nome) => {
    const val = env.obter(nome)
    if (val === undefined) return `{${nome}}`
    if (Array.isArray(val)) return val.join(", ")
    return String(val)
  })
}

// â”€â”€â”€ Gerador principal â”€â”€â”€

export function gerarHTML(ast: No[]): SaidaHTML {
  const env = new Ambiente()
  // FunÃ§Ãµes built-in para uso em HTML dinÃ¢mico
  env.definir("tamanho", (x: any) => typeof x === "string" || Array.isArray(x) ? x.length : String(x).length)
  env.definir("numero", (x: any) => Number(x))
  env.definir("texto", (x: any) => String(x))
  env.definir("tipo", (x: any) => { if (x === null) return "nulo"; if (Array.isArray(x)) return "lista"; return typeof x })
  env.definir("aleatorio", (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min)
  env.definir("abs", (n: number) => Math.abs(n))
  env.definir("arredondar", (n: number) => Math.round(n))

  const paginas = ast.filter((n) => n.tipo === "Pagina") as (No & { tipo: "Pagina" })[]

  if (paginas.length === 0) {
    const corpo = gerarCorpoHTML(ast, 2, env)
    return {
      html: montarDocumento("Portugol", corpo),
      css: gerarCSS(),
    }
  }

  const pagina = paginas[0]
  const corpo = gerarCorpoHTML(pagina.corpo, 2, env)
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
<script>
// Portugol.js — Helpers de interacÃ§Ã£o
function mostrar(id){var e=document.querySelector(id);if(e)e.style.display=''}
function esconder(id){var e=document.querySelector(id);if(e)e.style.display='none'}
function alternar(id){var e=document.querySelector(id);if(e)e.style.display=e.style.display==='none'?'':e.style.display===''?'none':e.style.display||'none'}
function texto(id,v){var e=document.querySelector(id);if(e)e.textContent=v}
function html(id,v){var e=document.querySelector(id);if(e)e.innerHTML=v}
function classe(id,a){var e=document.querySelector(id);if(e)a.includes('+')?e.classList.add(a.slice(1)):a.startsWith('-')?e.classList.remove(a.slice(1)):e.toggle(a)}
function navegar(u){window.location.href=u}
function alerta(m){alert(m)}
</script>
${corpo}
</body>
</html>`
}

// â”€â”€â”€ Gerar corpo HTML recursivo â”€â”€â”€

function gerarCorpoHTML(nos: No[], indent: number, env: Ambiente): string {
  const partes: string[] = []
  for (const no of nos) {
    // NÃ³s de controlo processam-se internamente (podem gerar mÃºltiplos filhos)
    const resultado = gerarNoHTML(no, indent, env)
    if (resultado !== undefined) partes.push(resultado)
  }
  return partes.join("\n")
}

function gerarEventos(estilos?: Estilos): string {
  if (!estilos) return ""
  const eventos: string[] = []
  if (estilos.ao_clicar) eventos.push(`onclick="${escaparAttr(estilos.ao_clicar)}"`)
  if (estilos.ao_mudar) eventos.push(`onchange="${escaparAttr(estilos.ao_mudar)}"`)
  if (estilos.ao_focar) eventos.push(`onfocus="${escaparAttr(estilos.ao_focar)}"`)
  if (estilos.ao_desfocar) eventos.push(`onblur="${escaparAttr(estilos.ao_desfocar)}"`)
  if (estilos.ao_submeter) eventos.push(`onsubmit="event.preventDefault();${escaparAttr(estilos.ao_submeter)}"`)
  return eventos.length > 0 ? " " + eventos.join(" ") : ""
}

function escaparAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function gerarNoHTML(no: No, indent: number, env: Ambiente): string | undefined {
  const pad = "  ".repeat(indent)
  const MAX_LOOP = 1000

  switch (no.tipo) {
    // NÃ³s de controlo — executam mas nÃ£o produzem HTML directamente
    case "Variavel": {
      const valor = no.valor ? avaliarExpr(no.valor, env) : undefined
      env.definir(no.nome, valor)
      return undefined
    }
    case "Atribuir": {
      const valor = avaliarExpr(no.valor, env)
      env.atribuir(no.nome, valor)
      return undefined
    }
    case "Se": {
      if (truthy(avaliarExpr(no.condicao, env))) {
        return gerarCorpoHTML(no.entao, indent, new Ambiente(env))
      }
      const senaoSe = (no as any).senaoSe as { condicao: Expressao; corpo: No[] }[] | undefined
      if (senaoSe) {
        for (const ramo of senaoSe) {
          if (truthy(avaliarExpr(ramo.condicao, env))) {
            return gerarCorpoHTML(ramo.corpo, indent, new Ambiente(env))
          }
        }
      }
      if (no.senao.length > 0) {
        return gerarCorpoHTML(no.senao, indent, new Ambiente(env))
      }
      return undefined
    }
    case "Enquanto": {
      let iter = 0
      const partes: string[] = []
      while (truthy(avaliarExpr(no.condicao, env))) {
        if (++iter > MAX_LOOP) break
        const res = gerarCorpoHTML(no.corpo, indent, new Ambiente(env))
        if (res) partes.push(res)
      }
      return partes.join("\n") || undefined
    }
    case "Para": {
      let inicio = Number(avaliarExpr(no.inicio, env))
      const ate = Number(avaliarExpr(no.ate, env))
      const passo = no.passo ? Number(avaliarExpr(no.passo, env)) : 1
      let iter = 0
      const partes: string[] = []
      for (let i = inicio; passo > 0 ? i <= ate : i >= ate; i += passo) {
        if (++iter > MAX_LOOP) break
        const escopo = new Ambiente(env)
        escopo.definir(no.variavel, i)
        const res = gerarCorpoHTML(no.corpo, indent, escopo)
        if (res) partes.push(res)
      }
      return partes.join("\n") || undefined
    }
    case "ParaCada": {
      const colecao = env.obter(no.colecao)
      if (!Array.isArray(colecao)) return undefined
      let iter = 0
      const partes: string[] = []
      for (const item of colecao) {
        if (++iter > MAX_LOOP) break
        const escopo = new Ambiente(env)
        escopo.definir(no.variavel, item)
        const res = gerarCorpoHTML(no.corpo, indent, escopo)
        if (res) partes.push(res)
      }
      return partes.join("\n") || undefined
    }
    case "Escrever":
      // Em HTML, escrever Ã© ignorado (sem console)
      return undefined
    case "Funcao":
    case "Retornar":
    case "Parar":
    case "Continuar":
    case "Escolher":
    case "Rota":
    case "Modelo":
    case "Pagina":
      // NÃ³s sem output HTML directo
      if (no.tipo === "Pagina") return gerarCorpoHTML(no.corpo, indent, env)
      return undefined

    case "Secao": {
      const cls = no.nome ? `secao secao-${slug(no.nome)}` : "secao"
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1, env)
      return `${pad}<section class="${classesComExtra(cls, no.estilos)}"${style}>\n${corpo}\n${pad}</section>`
    }

    case "Titulo": {
      const conteudo = expressaoParaTexto(no.valor, env)
      const estilo = estilosParaTipografia(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<h1 class="${classesComExtra('titulo', no.estilos)}"${style}>${conteudo}</h1>`
    }

    case "Texto": {
      const conteudo = expressaoParaTexto(no.valor, env)
      const estilo = estilosParaTipografia(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<p class="${classesComExtra('texto', no.estilos)}"${style}>${conteudo}</p>`
    }

    case "Botao": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const eventos = gerarEventos(no.estilos)
      return `${pad}<button class="${classesComExtra('botao', no.estilos)}"${style}${eventos}>${escaparHTML(no.label)}</button>`
    }

    case "Entrada": {
      let attrs = `type="${escaparHTML(no.tipoInput)}" class="entrada"`
      if (no.placeholder) attrs += ` placeholder="${escaparHTML(no.placeholder)}"`
      if (no.rotulo) attrs += ` aria-label="${escaparHTML(no.rotulo)}"`
      const eventos = gerarEventos() // entrada nao tem estilos
      return `${pad}<input ${attrs}${eventos} />`
    }

    case "Imagem": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const alt = no.alt ? ` alt="${escaparHTML(no.alt)}"` : ' alt=""'
      return `${pad}<img src="${escaparHTML(no.origem)}"${alt} class="${classesComExtra('imagem', no.estilos)}"${style} />`
    }

    case "Linha": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1, env)
      return `${pad}<div class="${classesComExtra('linha', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Coluna": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1, env)
      return `${pad}<div class="${classesComExtra('coluna', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Grade": {
      const cls = no.colunas === 0 ? "grade grade-auto" : `grade grade-${no.colunas}`
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1, env)
      return `${pad}<div class="${classesComExtra(cls, no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Cartao": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const corpo = gerarCorpoHTML(no.corpo, indent + 1, env)
      return `${pad}<div class="${classesComExtra('cartao', no.estilos)}"${style}>\n${corpo}\n${pad}</div>`
    }

    case "Espacador": {
      const valor = unidadeCSS(no.tamanho)
      return `${pad}<div class="espacador" style="height: ${valor}"></div>`
    }

    case "Subtitulo": {
      const conteudo = expressaoParaTexto(no.valor, env)
      const estilo = estilosParaTipografia(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<h2 class="${classesComExtra('subtitulo', no.estilos)}"${style}>${conteudo}</h2>`
    }

    case "Icone": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const svg = resolverIcone(no.valor)
      if (svg) {
        return `${pad}<span class="${classesComExtra('icone lucide', no.estilos)}"${style} aria-hidden="true">${svg}</span>`
      }
      return `${pad}<span class="${classesComExtra('icone', no.estilos)}"${style}>${escaparHTML(no.valor)}</span>`
    }

    case "Ligacao": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const externo = no.para.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
      return `${pad}<a href="${escaparHTML(no.para)}" class="${classesComExtra('ligacao', no.estilos)}"${style}${externo}>${escaparHTML(no.label)}</a>`
    }

    case "Distintivo": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<span class="${classesComExtra('distintivo', no.estilos)}"${style}>${escaparHTML(no.label)}</span>`
    }

    case "Divisor": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      return `${pad}<hr class="${classesComExtra('divisor', no.estilos)}"${style} />`
    }

    case "Video": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const src = converterUrlVideo(no.origem)
      return `${pad}<div class="video-contentor"${style}>\n${pad}  <iframe src="${escaparHTML(src)}" class="video" allowfullscreen loading="lazy" title="vîdeo"></iframe>\n${pad}</div>`
    }

    case "Lista": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const itens = no.itens
        .map((item) => `${pad}  <li class="lista-item">${escaparHTML(item)}</li>`)
        .join("\n")
      return `${pad}<ul class="${classesComExtra('lista', no.estilos)}"${style}>\n${itens}\n${pad}</ul>`
    }

    case "Citacao": {
      const estilo = estilosParaCSS(no.estilos, env)
      const style = estilo ? ` style="${estilo}"` : ""
      const autor = no.autor
        ? `\n${pad}  <cite class="citacao-autor">â€” ${escaparHTML(no.autor)}</cite>`
        : ""
      return `${pad}<blockquote class="${classesComExtra('citacao', no.estilos)}"${style}>\n${pad}  <p>${escaparHTML(no.texto)}</p>${autor}\n${pad}</blockquote>`
    }

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

function interpolarCSS(valor: string, env: Ambiente): string {
  return valor.replace(/\{(\w+)\}/g, (_, nome) => {
    const v = env.obter(nome)
    return v !== undefined ? String(v) : `{${nome}}`
  })
}

function estilosParaCSS(estilos?: Estilos, env?: Ambiente): string {
  if (!estilos) return ""
  const interp = env ? (v: string) => interpolarCSS(v, env) : (v: string) => v
  const partes: string[] = []

  // Cores & Fundo
  if (estilos.cor) partes.push(`color: ${interp(estilos.cor)}`)
  if (estilos.fundo) partes.push(`background: ${interp(estilos.fundo)}`)
  if (estilos.fundo_imagem) partes.push(`background-image: ${interp(estilos.fundo_imagem)}`)
  if (estilos.fundo_tamanho) partes.push(`background-size: ${interp(estilos.fundo_tamanho)}`)
  if (estilos.fundo_repetir) partes.push(`background-repeat: ${interp(estilos.fundo_repetir)}`)
  if (estilos.fundo_posicao) partes.push(`background-position: ${interp(estilos.fundo_posicao)}`)
  if (estilos.fundo_anexo) partes.push(`background-attachment: ${interp(estilos.fundo_anexo)}`)
  // Box Model
  if (estilos.largura) partes.push(`width: ${unidadeCSS(interp(estilos.largura))}`)
  if (estilos.altura) partes.push(`height: ${unidadeCSS(interp(estilos.altura))}`)
  if (estilos.largura_min) partes.push(`min-width: ${unidadeCSS(interp(estilos.largura_min))}`)
  if (estilos.largura_max) partes.push(`max-width: ${unidadeCSS(interp(estilos.largura_max))}`)
  if (estilos.altura_min) partes.push(`min-height: ${unidadeCSS(interp(estilos.altura_min))}`)
  if (estilos.altura_max) partes.push(`max-height: ${unidadeCSS(interp(estilos.altura_max))}`)
  if (estilos.padding) partes.push(`padding: ${unidadeCSS(interp(estilos.padding))}`)
  if (estilos.margem) partes.push(`margin: ${unidadeCSS(interp(estilos.margem))}`)
  // Borda & Raio
  if (estilos.borda) partes.push(`border: ${interp(estilos.borda)}`)
  if (estilos.raio) partes.push(`border-radius: ${unidadeCSS(interp(estilos.raio))}`)
  if (estilos.sombra) partes.push(`box-shadow: ${interp(estilos.sombra)}`)
  // Layout
  if (estilos.disposicao) partes.push(`display: ${interp(estilos.disposicao)}`)
  if (estilos.direcao) partes.push(`flex-direction: ${traduzirDirecao(interp(estilos.direcao))}`)
  if (estilos.espacamento) partes.push(`gap: ${unidadeCSS(interp(estilos.espacamento))}`)
  if (estilos.justificar) partes.push(`justify-content: ${traduzirAlinhamento(interp(estilos.justificar))}`)
  if (estilos.centralizar) {
    partes.push("display: flex", "justify-content: center", "align-items: center", "flex-direction: column")
  }
  if (estilos.posicao) partes.push(`position: ${interp(estilos.posicao)}`)
  if (estilos.topo) partes.push(`top: ${unidadeCSS(interp(estilos.topo))}`)
  if (estilos.direita) partes.push(`right: ${unidadeCSS(interp(estilos.direita))}`)
  if (estilos.baixo) partes.push(`bottom: ${unidadeCSS(interp(estilos.baixo))}`)
  if (estilos.esquerda) partes.push(`left: ${unidadeCSS(interp(estilos.esquerda))}`)
  if (estilos.indice_z) partes.push(`z-index: ${interp(estilos.indice_z)}`)
  // Tipografia
  if (estilos.tamanho) partes.push(`font-size: ${unidadeCSS(interp(estilos.tamanho))}`)
  if (estilos.peso) partes.push(`font-weight: ${interp(estilos.peso)}`)
  if (estilos.fonte) partes.push(`font-family: ${interp(estilos.fonte)}`)
  if (estilos.alinhamento) partes.push(`text-align: ${traduzirAlinhamento(interp(estilos.alinhamento))}`)
  if (estilos.decoracao) partes.push(`text-decoration: ${interp(estilos.decoracao)}`)
  if (estilos.maiusculas) partes.push(`text-transform: ${interp(estilos.maiusculas)}`)
  if (estilos.animacao) partes.push(`animation: ${interp(estilos.animacao)}`)
  if (estilos.transicao) partes.push(`transition: ${interp(estilos.transicao)}`)
  // Efeitos visuais
  if (estilos.opacidade) partes.push(`opacity: ${interp(estilos.opacidade)}`)
  if (estilos.transformar) partes.push(`transform: ${interp(estilos.transformar)}`)
  if (estilos.filtro) partes.push(`filter: ${interp(estilos.filtro)}`)
  if (estilos.translucido) partes.push(`backdrop-filter: ${interp(estilos.translucido)}`)
  if (estilos.mascara) partes.push(`clip-path: ${interp(estilos.mascara)}`)
  if (estilos.combinar) partes.push(`mix-blend-mode: ${interp(estilos.combinar)}`)
  if (estilos.isolamento) partes.push(`isolation: ${interp(estilos.isolamento)}`)
  // Object / Aspect
  if (estilos.encaixe) partes.push(`object-fit: ${interp(estilos.encaixe)}`)
  if (estilos.aspecto) partes.push(`aspect-ratio: ${interp(estilos.aspecto)}`)
  // Comportamento
  if (estilos.cursor) partes.push(`cursor: ${interp(estilos.cursor)}`)
  if (estilos.overflow) partes.push(`overflow: ${interp(estilos.overflow)}`)
  if (estilos.rolagem_x) partes.push(`overflow-x: ${interp(estilos.rolagem_x)}`)
  if (estilos.rolagem_y) partes.push(`overflow-y: ${interp(estilos.rolagem_y)}`)
  if (estilos.redimensionar) partes.push(`resize: ${interp(estilos.redimensionar)}`)

  return partes.join("; ")
}

function estilosParaTipografia(estilos?: Estilos, env?: Ambiente): string {
  if (!estilos) return ""
  return estilosParaCSS(estilos, env)
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
    igual: "space-evenly",
  }
  return mapa[valor] ?? valor
}

function traduzirDirecao(valor: string): string {
  const mapa: Record<string, string> = {
    linha: "row",
    coluna: "column",
    linha_reversa: "row-reverse",
    coluna_reversa: "column-reverse",
  }
  return mapa[valor] ?? valor
}

function expressaoParaTexto(expr: Expressao, env?: Ambiente): string {
  if (expr.tipo === "Str") return env ? escaparHTML(interpolador(expr.valor, env)) : escaparHTML(expr.valor)
  if (expr.tipo === "Num") return expr.valor
  if (expr.tipo === "Bool") return expr.valor ? "verdadeiro" : "falso"
  if (expr.tipo === "Ident") return env ? escaparHTML(String(env.obter(expr.nome) ?? expr.nome)) : escaparHTML(expr.nome)
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
   Portugol.js — Design System v5 (Tailwind-style)
   by Eketiandro Gonçalo
   ═══════════════════════════════════════════════════════════ */

/* ─── Reset melhorado ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; scroll-behavior: smooth; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; hanging-punctuation: first; }
body { font-family: var(--fonte-ui); color: var(--texto); background: var(--fundo); line-height: 1.6; overflow-x: hidden; min-height: 100dvh; }
img, video, canvas, svg { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: inherit; }
button { cursor: pointer; font: inherit; color: inherit; }
ul, ol { list-style: none; }
fieldset { border: none; }
legend { padding: 0; }
:focus-visible { outline: 2px solid var(--acento); outline-offset: 2px; border-radius: 2px; }

/* ─── Acessibilidade ─── */
.skip-link { position: absolute; top: -100%; left: 8px; padding: 8px 16px; background: var(--acento); color: var(--texto-inv); border-radius: var(--raio); z-index: 9999; }
.skip-link:focus { top: 8px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

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
  --rosa:            #ec4899;
  --roxo:            #8b5cf6;
  --laranja:         #f97316;
  --ciano:           #06b6d4;
  --gradiente-hero:  linear-gradient(160deg, #fafafa 0%, #ffffff 40%, #f5f5f7 100%);
  --gradiente-acento: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --gradiente-colorido: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
  --gradiente-ouro:  linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  --gradiente-mar:   linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  --brilho:          rgba(255,255,255,0.6);
  --fonte-display:   'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --fonte-ui:        'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --fonte-mono:      'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  --raio-sm: 6px; --raio: 10px; --raio-lg: 16px; --raio-xl: 24px; --raio-full: 9999px;
  --sombra-xs: 0 1px 2px rgba(0,0,0,0.04);
  --sombra-sm: 0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --sombra:    0 4px 16px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04);
  --sombra-md: 0 8px 32px rgba(0,0,0,0.09), 0 4px 8px rgba(0,0,0,0.05);
  --sombra-lg: 0 20px 60px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.06);
  --sombra-xl: 0 32px 80px rgba(0,0,0,0.13), 0 12px 24px rgba(0,0,0,0.07);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --dur-fast: 120ms; --dur: 220ms; --dur-slow: 380ms;
  --max: 1200px; --max-texto: 720px; --padding-x: clamp(20px, 5vw, 48px);
  --espaco-0: 0; --espaco-1: 4px; --espaco-2: 8px; --espaco-3: 12px; --espaco-4: 16px;
  --espaco-5: 24px; --espaco-6: 32px; --espaco-8: 48px; --espaco-10: 64px; --espaco-12: 80px; --espaco-16: 120px;
}

/* ─── Tema escuro (sistema + classe manual) ─── */
@media (prefers-color-scheme: dark) {
  :root, :root.light { --fundo: #080810; --fundo-elevado: #0e0e18; --fundo-subtil: #14141f; --superfice: #1a1a28; --borda: rgba(255,255,255,0.07); --borda-forte: rgba(255,255,255,0.13); --texto: #f0f0f8; --texto-2: #c4c4d4; --texto-3: #8888aa; --texto-inv: #080810; --acento: #e8e8ff; --acento-hover: #ffffff; --acento-suave: rgba(232,232,255,0.08); --gradiente-hero: linear-gradient(160deg, #080810 0%, #0e0e1a 50%, #080810 100%); --brilho: rgba(255,255,255,0.03); --sombra-sm: 0 2px 8px rgba(0,0,0,0.5); --sombra-md: 0 8px 32px rgba(0,0,0,0.6); --sombra-lg: 0 20px 60px rgba(0,0,0,0.7); --sombra-xl: 0 32px 80px rgba(0,0,0,0.8); }
}
:root.dark { --fundo: #080810; --fundo-elevado: #0e0e18; --fundo-subtil: #14141f; --superfice: #1a1a28; --borda: rgba(255,255,255,0.07); --borda-forte: rgba(255,255,255,0.13); --texto: #f0f0f8; --texto-2: #c4c4d4; --texto-3: #8888aa; --texto-inv: #080810; --acento: #e8e8ff; --acento-hover: #ffffff; --acento-suave: rgba(232,232,255,0.08); --gradiente-hero: linear-gradient(160deg, #080810 0%, #0e0e1a 50%, #080810 100%); --brilho: rgba(255,255,255,0.03); --sombra-sm: 0 2px 8px rgba(0,0,0,0.5); --sombra-md: 0 8px 32px rgba(0,0,0,0.6); --sombra-lg: 0 20px 60px rgba(0,0,0,0.7); --sombra-xl: 0 32px 80px rgba(0,0,0,0.8); }
:root.light { --fundo: #ffffff; --fundo-elevado: #fafafa; --fundo-subtil: #f4f4f5; --superfice: #ffffff; --borda: rgba(0,0,0,0.07); --borda-forte: rgba(0,0,0,0.13); --texto: #0a0a0a; --texto-2: #3f3f46; --texto-3: #71717a; --texto-inv: #ffffff; --acento: #0a0a0a; --acento-hover: #27272a; --acento-suave: rgba(10,10,10,0.05); --gradiente-hero: linear-gradient(160deg, #fafafa 0%, #ffffff 40%, #f5f5f7 100%); --brilho: rgba(255,255,255,0.6); --sombra-sm: 0 2px 8px rgba(0,0,0,0.06); --sombra-md: 0 8px 32px rgba(0,0,0,0.09); --sombra-lg: 0 20px 60px rgba(0,0,0,0.11); --sombra-xl: 0 32px 80px rgba(0,0,0,0.13); }

/* ─── Movimento reduzido ─── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}

/* ═══════════════════════════════════════════════════════
   KEYFRAMES
   ═══════════════════════════════════════════════════════ */
@keyframes entrar-baixo { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
@keyframes entrar-cima { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
@keyframes entrar-esquerda { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes entrar-direita { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
@keyframes aparecer { from { opacity: 0; } to { opacity: 1; } }
@keyframes escalar { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
@keyframes brilho-sweep { 0% { left: -100%; } 100% { left: 200%; } }
@keyframes pulsar { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes rodar { to { transform: rotate(360deg); } }
@keyframes balancar { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(3deg); } 75% { transform: rotate(-3deg); } }
@keyframes pular { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes revelar { from { opacity: 0; clip-path: inset(0 100% 0 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
@keyframes digitar { from { width: 0; } }
@keyframes flutuar { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
@keyframes aparecer-escalar { from { opacity: 0; transform: scale(0.8); filter: blur(4px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
@keyframes vibrar { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-2px); } 75% { transform: translateX(2px); } }

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
.secao-CTA { background: var(--gradiente-acento); border-radius: var(--raio-xl); margin: 0 var(--padding-x) 80px; max-width: calc(var(--max) - var(--padding-x) * 2); container-type: inline-size; }
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
.titulo { font-family: var(--fonte-display); font-size: clamp(2rem, 5vw, 4.5rem); font-weight: 600; line-height: 1.04; letter-spacing: -0.03em; color: var(--texto); margin-bottom: 16px; animation: entrar-baixo var(--dur-slow) var(--ease) both; max-width: var(--max-texto); }
.subtitulo { font-family: var(--fonte-display); font-size: clamp(1.2rem, 2.5vw, 1.9rem); font-weight: 500; line-height: 1.25; letter-spacing: -0.015em; color: var(--texto-2); margin-bottom: 12px; max-width: var(--max-texto); }
.texto { font-family: var(--fonte-ui); font-size: 1.05rem; line-height: 1.75; color: var(--texto-3); margin-bottom: 8px; max-width: 65ch; }

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
.botao-icon { padding: 10px; line-height: 0; border-radius: var(--raio); }

/* ─── Entrada ─── */
.entrada { display: block; width: 100%; max-width: 400px; padding: 12px 16px; font-family: var(--fonte-ui); font-size: 1rem; color: var(--texto); background: var(--fundo); border: 1px solid var(--borda-forte); border-radius: var(--raio); transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); outline: none; appearance: none; }
.entrada::placeholder { color: var(--texto-3); }
.entrada:hover { border-color: var(--texto-3); }
.entrada:focus { border-color: var(--acento); box-shadow: 0 0 0 3px var(--acento-suave); }
.entrada:disabled { opacity: 0.5; cursor: not-allowed; background: var(--fundo-subtil); }
.entrada-erro { border-color: var(--erro); }
.entrada-erro:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }
.entrada-sucesso { border-color: var(--sucesso); }
.entrada-sucesso:focus { box-shadow: 0 0 0 3px rgba(34,197,94,0.15); }
textarea.entrada { resize: vertical; min-height: 100px; }
select.entrada { appearance: auto; }

/* ─── Imagem ─── */
.imagem { width: 100%; height: auto; border-radius: var(--raio-lg); object-fit: cover; }
.imagem-redonda { border-radius: var(--raio-full); }
.imagem-sombra { box-shadow: var(--sombra-md); }
.imagem-borda { border: 1px solid var(--borda); }
.imagem-contem { object-fit: contain; }
.imagem-preencher { object-fit: fill; }
.imagem-dimensionar { object-fit: scale-down; }

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
.grade-auto-gd { grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); }

/* ─── Cartão ─── */
.cartao { background: var(--superfice); border: 1px solid var(--borda); border-radius: var(--raio-lg); padding: 32px; position: relative; overflow: hidden; transition: transform var(--dur) var(--ease-spring), box-shadow var(--dur) var(--ease), border-color var(--dur) var(--ease); box-shadow: var(--sombra-sm); animation: escalar var(--dur-slow) var(--ease) both; container-type: inline-size; }
.cartao::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: linear-gradient(135deg, var(--brilho) 0%, transparent 50%); pointer-events: none; }
.cartao::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); pointer-events: none; }
.cartao:hover { transform: translateY(-4px) scale(1.005); box-shadow: var(--sombra-lg); border-color: var(--borda-forte); }
.cartao .titulo { font-size: clamp(1.1rem, 2vw, 1.5rem); margin-bottom: 8px; }
.cartao .subtitulo { font-size: 1.1rem; margin-bottom: 8px; }
.cartao .texto { font-size: 0.95rem; margin-bottom: 0; }
.cartao .imagem { margin: -32px -32px 24px; width: calc(100% + 64px); max-width: none; border-radius: var(--raio-lg) var(--raio-lg) 0 0; }
@container (max-width: 400px) { .cartao { padding: 20px; } .cartao .titulo { font-size: 1.2rem; } }

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
.cartao-horizontal { display: flex; gap: 24px; align-items: center; }
.cartao-horizontal .imagem { margin: 0; width: 200px; min-width: 200px; border-radius: var(--raio-lg); }
.cartao-horizontal .coluna { flex: 1; }

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
.ligacao-seta::after { content: "→"; transition: transform var(--dur) var(--ease); display: inline-block; }
.ligacao-seta:hover::after { transform: translateX(4px); }
.ligacao-externo::after { content: "↗"; font-size: 0.8em; }

/* ─── Distintivo ─── */
.distintivo { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; font-family: var(--fonte-ui); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--texto-2); background: var(--fundo-subtil); border: 1px solid var(--borda-forte); border-radius: var(--raio-full); white-space: nowrap; animation: aparecer var(--dur-slow) var(--ease) both; }
.distintivo-acento { background: var(--acento); color: var(--texto-inv); border-color: var(--acento); }
.distintivo-info { background: rgba(59,130,246,0.1); color: var(--info); border-color: rgba(59,130,246,0.2); }
.distintivo-sucesso { background: rgba(34,197,94,0.1); color: var(--sucesso); border-color: rgba(34,197,94,0.2); }
.distintivo-aviso { background: rgba(245,158,11,0.1); color: var(--aviso); border-color: rgba(245,158,11,0.2); }
.distintivo-erro { background: rgba(239,68,68,0.1); color: var(--erro); border-color: rgba(239,68,68,0.2); }
.distintivo-rosa { background: rgba(236,72,153,0.1); color: var(--rosa); border-color: rgba(236,72,153,0.2); }
.distintivo-roxo { background: rgba(139,92,246,0.1); color: var(--roxo); border-color: rgba(139,92,246,0.2); }
.distintivo-sm { padding: 3px 10px; font-size: 0.65rem; }
.distintivo-lg { padding: 8px 20px; font-size: 0.8rem; }
.distintivo-pontilhado { border-style: dashed; }

/* ─── Divisor ─── */
.divisor { display: block; width: 100%; height: 1px; background: var(--borda); border: none; margin: 0; }
.divisor-texto { display: flex; align-items: center; gap: 16px; color: var(--texto-3); font-size: 0.82rem; font-weight: 500; }
.divisor-texto::before, .divisor-texto::after { content: ''; flex: 1; height: 1px; background: var(--borda); }
.divisor-espaco { margin: var(--espaco-6) 0; }
.divisor-vertical { width: 1px; height: auto; min-height: 24px; align-self: stretch; background: var(--borda); border: none; }

/* ─── Vídeo ─── */
.video-contentor { position: relative; width: 100%; padding-bottom: 56.25%; border-radius: var(--raio-lg); overflow: hidden; background: var(--fundo-subtil); box-shadow: var(--sombra-md); }
.video { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }
.video-redondo { border-radius: var(--raio-full); }
.video-quadrado { padding-bottom: 100%; }

/* ─── Lista ─── */
.lista { list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0; }
.lista-item { display: flex; align-items: flex-start; gap: 10px; font-family: var(--fonte-ui); font-size: 0.95rem; line-height: 1.6; color: var(--texto-2); }
.lista-item::before { content: ''; display: block; width: 5px; height: 5px; min-width: 5px; border-radius: 50%; background: var(--texto-3); margin-top: 8px; }
.lista-icone .lista-item::before { display: none; }
.lista-ordenada { counter-reset: item; }
.lista-ordenada .lista-item { counter-increment: item; }
.lista-ordenada .lista-item::before { content: counter(item); width: auto; height: auto; min-width: 24px; background: var(--acento-suave); color: var(--acento); border-radius: var(--raio-sm); display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 600; padding: 2px 0; margin-top: 0; }
.lista-gap-sm { gap: 4px; }
.lista-gap-lg { gap: 16px; }
.lista-horizontal { flex-direction: row; flex-wrap: wrap; }
.lista-horizontal .lista-item::before { margin-top: 10px; }

/* ─── Citação ─── */
.citacao { position: relative; padding: 32px; background: var(--fundo-subtil); border: 1px solid var(--borda); border-radius: var(--raio-lg); overflow: hidden; transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.citacao:hover { transform: translateY(-2px); box-shadow: var(--sombra-md); }
.citacao::before { content: '\\201C'; position: absolute; top: -16px; left: 20px; font-family: var(--fonte-display); font-size: 7rem; line-height: 1; color: var(--borda-forte); pointer-events: none; user-select: none; }
.citacao p { font-family: var(--fonte-display); font-size: 1.1rem; font-style: italic; line-height: 1.75; color: var(--texto); margin-bottom: 16px; position: relative; }
.citacao-autor { display: block; font-family: var(--fonte-ui); font-size: 0.82rem; font-style: normal; font-weight: 500; color: var(--texto-3); letter-spacing: 0.02em; }
.citacao-destaque { background: linear-gradient(135deg, var(--acento-suave) 0%, transparent 80%); border-left: 3px solid var(--acento); }
.citacao-destaque::before { color: var(--acento); opacity: 0.2; }

/* ─── Navegação ─── */
.nav { display: flex; align-items: center; gap: 24px; }
.nav-coluna { flex-direction: column; gap: 8px; }
.nav-link { padding: 6px 0; font-size: 0.9rem; color: var(--texto-2); text-decoration: none; border-bottom: 1px solid transparent; transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.nav-link:hover { color: var(--texto); border-bottom-color: var(--texto); }
.nav-link-ativo { color: var(--texto); border-bottom-color: var(--texto); font-weight: 500; }

/* ─── Grupo de Entrada ─── */
.entrada-grupo { display: flex; gap: 0; }
.entrada-grupo .entrada { border-radius: var(--raio) 0 0 var(--raio); max-width: none; }
.entrada-grupo .botao { border-radius: 0 var(--raio) var(--raio) 0; white-space: nowrap; }

/* ═══════════════════════════════════════════════════════
   UTILITÁRIOS (Tailwind-style v2)
   ═══════════════════════════════════════════════════════ */

/* ─── Display ─── */
.d-bloco { display: block; }
.d-flex { display: flex; }
.d-inline-flex { display: inline-flex; }
.d-grid { display: grid; }
.d-inline { display: inline; }
.d-inline-bloco { display: inline-block; }
.d-oculto { display: none; }
.d-conteudo { display: contents; }

/* ─── Flex ─── */
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.flex-row-rev { flex-direction: row-reverse; }
.flex-col-rev { flex-direction: column-reverse; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.flex-1 { flex: 1; }
.flex-auto { flex: 1 1 auto; }
.flex-inicial { flex: 0 1 auto; }
.flex-none { flex: none; }
.crescer { flex-grow: 1; }
.crescer-0 { flex-grow: 0; }
.encolher { flex-shrink: 1; }
.encolher-0 { flex-shrink: 0; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.items-baseline { align-items: baseline; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.justify-start { justify-content: flex-start; }
.justify-evenly { justify-content: space-evenly; }
.justify-around { justify-content: space-around; }
.justify-self-center { justify-self: center; }
.justify-self-end { justify-self: end; }
.justify-self-start { justify-self: start; }
.content-center { align-content: center; }
.content-start { align-content: flex-start; }
.content-end { align-content: flex-end; }
.content-between { align-content: space-between; }
.self-center { align-self: center; }
.self-start { align-self: flex-start; }
.self-end { align-self: flex-end; }
.self-stretch { align-self: stretch; }
.ordem-primeiro { order: -1; }
.ordem-ultimo { order: 9999; }
.ordem-none { order: 0; }

/* ─── Gap (espaçamento entre filhos) ─── */
.gap-0 { gap: var(--espaco-0); }
.gap-1 { gap: var(--espaco-1); }
.gap-2 { gap: var(--espaco-2); }
.gap-3 { gap: var(--espaco-3); }
.gap-4 { gap: var(--espaco-4); }
.gap-5 { gap: var(--espaco-5); }
.gap-6 { gap: var(--espaco-6); }
.gap-8 { gap: var(--espaco-8); }
.gap-10 { gap: var(--espaco-10); }
.gap-12 { gap: var(--espaco-12); }
.gap-x-2 { column-gap: var(--espaco-2); }
.gap-x-4 { column-gap: var(--espaco-4); }
.gap-x-6 { column-gap: var(--espaco-6); }
.gap-y-2 { row-gap: var(--espaco-2); }
.gap-y-4 { row-gap: var(--espaco-4); }
.gap-y-6 { row-gap: var(--espaco-6); }

/* ─── Grid ─── */
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-rows-2 { grid-template-rows: repeat(2, 1fr); }
.grid-rows-3 { grid-template-rows: repeat(3, 1fr); }
.col-span-2 { grid-column: span 2; }
.col-span-3 { grid-column: span 3; }
.col-span-full { grid-column: 1 / -1; }
.row-span-2 { grid-row: span 2; }
.row-span-full { grid-row: 1 / -1; }
.grid-flow-col { grid-auto-flow: column; }
.grid-flow-row { grid-auto-flow: row; }
.grid-flow-dense { grid-auto-flow: dense; }

/* ─── Padding ─── */
.p-0 { padding: 0; }
.p-1 { padding: var(--espaco-1); }
.p-2 { padding: var(--espaco-2); }
.p-3 { padding: var(--espaco-3); }
.p-4 { padding: var(--espaco-4); }
.p-5 { padding: var(--espaco-5); }
.p-6 { padding: var(--espaco-6); }
.p-8 { padding: var(--espaco-8); }
.p-10 { padding: var(--espaco-10); }
.p-12 { padding: var(--espaco-12); }
.px-0 { padding-left: 0; padding-right: 0; }
.px-2 { padding-left: var(--espaco-2); padding-right: var(--espaco-2); }
.px-4 { padding-left: var(--espaco-4); padding-right: var(--espaco-4); }
.px-6 { padding-left: var(--espaco-6); padding-right: var(--espaco-6); }
.px-8 { padding-left: var(--espaco-8); padding-right: var(--espaco-8); }
.py-0 { padding-top: 0; padding-bottom: 0; }
.py-2 { padding-top: var(--espaco-2); padding-bottom: var(--espaco-2); }
.py-4 { padding-top: var(--espaco-4); padding-bottom: var(--espaco-4); }
.py-6 { padding-top: var(--espaco-6); padding-bottom: var(--espaco-6); }
.py-8 { padding-top: var(--espaco-8); padding-bottom: var(--espaco-8); }
.py-10 { padding-top: var(--espaco-10); padding-bottom: var(--espaco-10); }
.pt-2 { padding-top: var(--espaco-2); }
.pt-4 { padding-top: var(--espaco-4); }
.pb-2 { padding-bottom: var(--espaco-2); }
.pb-4 { padding-bottom: var(--espaco-4); }
.pl-2 { padding-left: var(--espaco-2); }
.pr-2 { padding-right: var(--espaco-2); }

/* ─── Margin ─── */
.m-0 { margin: 0; }
.m-auto { margin: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
.my-auto { margin-top: auto; margin-bottom: auto; }
.mt-0 { margin-top: 0; }
.mt-2 { margin-top: var(--espaco-2); }
.mt-4 { margin-top: var(--espaco-4); }
.mt-6 { margin-top: var(--espaco-6); }
.mt-8 { margin-top: var(--espaco-8); }
.mt-auto { margin-top: auto; }
.mb-0 { margin-bottom: 0; }
.mb-2 { margin-bottom: var(--espaco-2); }
.mb-4 { margin-bottom: var(--espaco-4); }
.mb-6 { margin-bottom: var(--espaco-6); }
.mb-8 { margin-bottom: var(--espaco-8); }
.mb-auto { margin-bottom: auto; }
.ml-auto { margin-left: auto; }
.mr-auto { margin-right: auto; }

/* ─── Largura / Altura ─── */
.w-full { width: 100%; }
.w-max { width: 100%; max-width: var(--max); }
.w-auto { width: auto; }
.w-metade { width: 50%; }
.w-tela { width: 100vw; }
.w-min { min-width: min-content; }
.w-max-conteudo { width: max-content; }
.w-texto { max-width: var(--max-texto); }
.h-full { height: 100%; }
.h-dvh { min-height: 100dvh; }
.h-auto { height: auto; }
.h-tela { height: 100vh; }
.h-screen { height: 100dvh; }

/* ─── Aspect Ratio ─── */
.aspect-quadrado { aspect-ratio: 1 / 1; }
.aspect-video { aspect-ratio: 16 / 9; }
.aspect-vertical { aspect-ratio: 9 / 16; }
.aspect-4-3 { aspect-ratio: 4 / 3; }
.aspect-3-2 { aspect-ratio: 3 / 2; }
.aspect-2-1 { aspect-ratio: 2 / 1; }
.aspect-auto { aspect-ratio: auto; }

/* ─── Object Fit ─── */
.encaixe-cobrir { object-fit: cover; }
.encaixe-contem { object-fit: contain; }
.encaixe-preencher { object-fit: fill; }
.encaixe-dimensionar { object-fit: scale-down; }
.encaixe-none { object-fit: none; }
.encaixe-pos-top { object-position: top; }
.encaixe-pos-centro { object-position: center; }
.encaixe-pos-baixo { object-position: bottom; }

/* ─── Isolation ─── */
.isolate { isolation: isolate; }
.isolate-auto { isolation: auto; }

/* ─── Tipografia ─── */
.text-esquerda { text-align: left; }
.text-centro { text-align: center; }
.text-direita { text-align: right; }
.text-justificar { text-align: justify; }
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-3xl { font-size: 2rem; }
.text-4xl { font-size: 2.5rem; }
.text-5xl { font-size: 3rem; }
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
.text-normal { text-transform: none; }
.text-mono { font-variant-numeric: tabular-nums; }
.text-mono-ff { font-variant-numeric: tabular-nums oldstyle-nums; }
.text-italico { font-style: italic; }
.text-normal { font-style: normal; }
.text-suave { font-weight: 300; }
.leading-tight { line-height: 1.15; }
.leading-normal { line-height: 1.5; }
.leading-relaxado { line-height: 1.75; }
.leading-solto { line-height: 2; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-wider { letter-spacing: 0.05em; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.quebra-palavra { word-break: break-word; }
.quebra-tudo { word-break: break-all; }
.quebra-normal { word-break: normal; overflow-wrap: normal; }
.hifen { hyphens: auto; }
.espaco-branco-normal { white-space: normal; }
.espaco-branco-nowrap { white-space: nowrap; }
.espaco-branco-pre { white-space: pre; }

/* ─── Cores de texto ─── */
.c-texto { color: var(--texto); }
.c-texto2 { color: var(--texto-2); }
.c-texto3 { color: var(--texto-3); }
.c-acento { color: var(--acento); }
.c-info { color: var(--info); }
.c-sucesso { color: var(--sucesso); }
.c-aviso { color: var(--aviso); }
.c-erro { color: var(--erro); }
.c-inv { color: var(--texto-inv); }
.c-rosa { color: var(--rosa); }
.c-roxo { color: var(--roxo); }
.c-laranja { color: var(--laranja); }
.c-ciano { color: var(--ciano); }
.c-inherit { color: inherit; }
.c-transparente { color: transparent; }

/* ─── Cores de fundo ─── */
.bg-fundo { background: var(--fundo); }
.bg-elevado { background: var(--fundo-elevado); }
.bg-subtil { background: var(--fundo-subtil); }
.bg-superfice { background: var(--superfice); }
.bg-acento { background: var(--acento); }
.bg-acento-suave { background: var(--acento-suave); }
.bg-info { background: rgba(59,130,246,0.1); }
.bg-sucesso { background: rgba(34,197,94,0.1); }
.bg-aviso { background: rgba(245,158,11,0.1); }
.bg-erro { background: rgba(239,68,68,0.1); }
.bg-transparente { background: transparent; }

/* ─── Gradientes ─── */
.gradiente-hero { background: var(--gradiente-hero); }
.gradiente-escuro { background: var(--gradiente-acento); }
.gradiente-colorido { background: var(--gradiente-colorido); }
.gradiente-ouro { background: var(--gradiente-ouro); }
.gradiente-mar { background: var(--gradiente-mar); }

/* ─── Bordas & Raio ─── */
.borda { border: 1px solid var(--borda); }
.borda-forte { border: 1px solid var(--borda-forte); }
.borda-0 { border: none; }
.borda-t { border-top: 1px solid var(--borda); }
.borda-b { border-bottom: 1px solid var(--borda); }
.borda-l { border-left: 1px solid var(--borda); }
.borda-r { border-right: 1px solid var(--borda); }
.borda-2 { border-width: 2px; }
.borda-acento { border-color: var(--acento); }
.borda-erro { border-color: var(--erro); }
.borda-info { border-color: var(--info); }
.borda-sucesso { border-color: var(--sucesso); }
.borda-pontilhada { border-style: dashed; }
.borda-tracejada { border-style: dotted; }
.raio-sm { border-radius: var(--raio-sm); }
.raio { border-radius: var(--raio); }
.raio-lg { border-radius: var(--raio-lg); }
.raio-xl { border-radius: var(--raio-xl); }
.raio-full { border-radius: var(--raio-full); }
.raio-t-lg { border-radius: var(--raio-lg) var(--raio-lg) 0 0; }
.raio-b-lg { border-radius: 0 0 var(--raio-lg) var(--raio-lg); }
.raio-esq-lg { border-radius: var(--raio-lg) 0 0 var(--raio-lg); }
.raio-dir-lg { border-radius: 0 var(--raio-lg) var(--raio-lg) 0; }

/* ─── Sombras ─── */
.sombra-xs { box-shadow: var(--sombra-xs); }
.sombra-sm { box-shadow: var(--sombra-sm); }
.sombra { box-shadow: var(--sombra); }
.sombra-md { box-shadow: var(--sombra-md); }
.sombra-lg { box-shadow: var(--sombra-lg); }
.sombra-xl { box-shadow: var(--sombra-xl); }
.sombra-0 { box-shadow: none; }
.sombra-interna { box-shadow: inset 0 2px 4px rgba(0,0,0,0.06); }
.sombra-colorida { box-shadow: 0 4px 20px rgba(99,102,241,0.25); }

/* ─── Overflow ─── */
.overflow-hidden { overflow: hidden; }
.overflow-auto { overflow: auto; }
.overflow-scroll { overflow: scroll; }
.overflow-visible { overflow: visible; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }
.overflow-x-hidden { overflow-x: hidden; }
.overflow-y-hidden { overflow-y: hidden; }
.overflow-x-scroll { overflow-x: scroll; }

/* ─── Posição ─── */
.relativo { position: relative; }
.absoluto { position: absolute; }
.fixo { position: fixed; }
.sticky { position: sticky; }
.estatico { position: static; }
.inset-0 { inset: 0; }
.inset-x-0 { left: 0; right: 0; }
.inset-y-0 { top: 0; bottom: 0; }
.topo-0 { top: 0; }
.direita-0 { right: 0; }
.baixo-0 { bottom: 0; }
.esquerda-0 { left: 0; }
.z-0 { z-index: 0; }
.z-1 { z-index: 1; }
.z-10 { z-index: 10; }
.z-50 { z-index: 50; }
.z-100 { z-index: 100; }
.z-999 { z-index: 999; }
.z-auto { z-index: auto; }

/* ─── Opacidade ─── */
.op-0 { opacity: 0; }
.op-10 { opacity: 0.1; }
.op-25 { opacity: 0.25; }
.op-50 { opacity: 0.5; }
.op-75 { opacity: 0.75; }
.op-90 { opacity: 0.9; }
.op-100 { opacity: 1; }

/* ─── Filtros ─── */
.filtro-desfoque-sm { filter: blur(2px); }
.filtro-desfoque { filter: blur(4px); }
.filtro-desfoque-lg { filter: blur(16px); }
.filtro-brilho { filter: brightness(1.1); }
.filtro-contraste { filter: contrast(1.3); }
.filtro-escala-cinza { filter: grayscale(1); }
.filtro-sepia { filter: sepia(0.6); }
.filtro-saturado { filter: saturate(1.3); }
.filtro-nenhum { filter: none; }
.Translucido { backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); }

/* ─── Transform ─── */
.escalar-95 { transform: scale(0.95); }
.escalar-105 { transform: scale(1.05); }
.escalar-110 { transform: scale(1.1); }
.rodar-90 { transform: rotate(90deg); }
.rodar-180 { transform: rotate(180deg); }
.rodar-270 { transform: rotate(270deg); }
.espelhar-x { transform: scaleX(-1); }
.espelhar-y { transform: scaleY(-1); }
.translate-x-2 { transform: translateX(8px); }
.translate-x--2 { transform: translateX(-8px); }
.translate-y-2 { transform: translateY(8px); }
.translate-y--2 { transform: translateY(-8px); }

/* ─── Glassmorphism ─── */
.vidro { background: rgba(255,255,255,0.6); backdrop-filter: blur(16px) saturate(180%); -webkit-backdrop-filter: blur(16px) saturate(180%); border: 1px solid rgba(255,255,255,0.2); }
:root.dark .vidro, @media (prefers-color-scheme: dark) { .vidro { background: rgba(8,8,16,0.6); border-color: rgba(255,255,255,0.08); } }
.vidro-forte { background: rgba(255,255,255,0.85); backdrop-filter: blur(24px) saturate(200%); -webkit-backdrop-filter: blur(24px) saturate(200%); }
:root.dark .vidro-forte, @media (prefers-color-scheme: dark) { .vidro-forte { background: rgba(8,8,16,0.85); } }

/* ─── Animação util ─── */
.animar-fade { animation: aparecer var(--dur-slow) var(--ease) both; }
.animar-subir { animation: entrar-baixo var(--dur-slow) var(--ease) both; }
.animar-descer { animation: entrar-cima var(--dur-slow) var(--ease) both; }
.animar-esquerda { animation: entrar-esquerda var(--dur-slow) var(--ease) both; }
.animar-direita { animation: entrar-direita var(--dur-slow) var(--ease) both; }
.animar-escalar { animation: escalar var(--dur-slow) var(--ease) both; }
.animar-pulsar { animation: pulsar 2s ease-in-out infinite; }
.animar-rodar { animation: rodar 1s linear infinite; }
.animar-balancar { animation: balancar 1s var(--ease) infinite; }
.animar-pular { animation: pular 1s var(--ease-spring) infinite; }
.animar-revelar { animation: revelar var(--dur-slow) var(--ease) both; }
.animar-flutuar { animation: flutuar 3s ease-in-out infinite; }
.animar-vibrar { animation: vibrar 0.3s var(--ease) infinite; }
.animar-aparecer-escalar { animation: aparecer-escalar 0.5s var(--ease-spring) both; }
.animar-lento { animation-duration: 600ms; }
.animar-rapido { animation-duration: 200ms; }
.animar-atraso-1 { animation-delay: 100ms; }
.animar-atraso-2 { animation-delay: 200ms; }
.animar-atraso-3 { animation-delay: 300ms; }
.animar-atraso-4 { animation-delay: 400ms; }
.animar-atraso-5 { animation-delay: 500ms; }
.animar-atraso-6 { animation-delay: 600ms; }
.animar-atraso-8 { animation-delay: 800ms; }
.animar-atraso-10 { animation-delay: 1000ms; }
.animar-fill-forwards { animation-fill-mode: forwards; }
.animar-fill-backwards { animation-fill-mode: backwards; }
.animar-fill-both { animation-fill-mode: both; }
.animar-iteracao-1 { animation-iteration-count: 1; }
.animar-iteracao-infinita { animation-iteration-count: infinite; }
.hover\\:animar-subir:hover { animation: entrar-baixo 300ms var(--ease) both; }

/* ─── Interatividade ─── */
.pointer { cursor: pointer; }
.pointer-events-none { pointer-events: none; }
.pointer-events-auto { pointer-events: auto; }
.select-none { -webkit-user-select: none; user-select: none; }
.select-text { -webkit-user-select: text; user-select: text; }
.select-all { -webkit-user-select: all; user-select: all; }
.hover\\:subir:hover { transform: translateY(-2px); }
.hover\\:baixar:hover { transform: translateY(1px); }
.hover\\:sombra:hover { box-shadow: var(--sombra-md); }
.hover\\:brilho:hover { filter: brightness(1.05); }
.hover\\:escalar:hover { transform: scale(1.03); }
.hover\\:opaco:hover { opacity: 0.8; }
.hover\\:cor-acento:hover { color: var(--acento); }
.hover\\:bg-acento-suave:hover { background: var(--acento-suave); }
.hover\\:subir-sombra:hover { transform: translateY(-2px); box-shadow: var(--sombra-md); }
.active\\:escalar:active { transform: scale(0.97); }
.transicao { transition: all var(--dur) var(--ease); }
.transicao-rapida { transition: all var(--dur-fast) var(--ease); }
.transicao-lenta { transition: all var(--dur-slow) var(--ease); }
.transicao-transform { transition: transform var(--dur) var(--ease-spring); }
.transicao-cores { transition: color var(--dur) var(--ease), background var(--dur) var(--ease), border-color var(--dur) var(--ease); }
.transicao-sombra { transition: box-shadow var(--dur) var(--ease); }

/* ─── Resize ─── */
.redimensionar { resize: both; overflow: auto; }
.redimensionar-h { resize: horizontal; overflow: auto; }
.redimensionar-v { resize: vertical; overflow: auto; }
.redimensionar-none { resize: none; }

/* ─── Cursor ─── */
.cursor-pointer { cursor: pointer; }
.cursor-default { cursor: default; }
.cursor-wait { cursor: wait; }
.cursor-text { cursor: text; }
.cursor-move { cursor: move; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }
.cursor-zoom-in { cursor: zoom-in; }

/* ─── Scroll Snap ─── */
.snap-container { scroll-snap-type: y mandatory; overflow-y: scroll; }
.snap-x { scroll-snap-type: x mandatory; overflow-x: scroll; }
.snap-proximidade { scroll-snap-type: y proximity; }
.snap-start { scroll-snap-align: start; }
.snap-center { scroll-snap-align: center; }
.snap-end { scroll-snap-align: end; }
.scroll-suave { scroll-behavior: smooth; }

/* ─── Touch / Drag ─── */
.touch-pan-x { touch-action: pan-x; }
.touch-pan-y { touch-action: pan-y; }
.touch-auto { touch-action: auto; }
.touch-none { touch-action: none; }
.draggable { -webkit-user-drag: element; user-drag: element; }
.drag-none { -webkit-user-drag: none; user-drag: none; }

/* ─── List Style ─── */
.lista-disc { list-style: disc; padding-left: 1.5em; }
.lista-decimal { list-style: decimal; padding-left: 1.5em; }
.lista-none { list-style: none; }
.lista-inside { list-style-position: inside; }

/* ─── Visibilidade ─── */
.visivel { visibility: visible; }
.invisivel { visibility: hidden; }
.oculto { display: none !important; }

/* ─── Responsividade: mostrar/esconder ─── */
.mobile-only { display: none; }
.desktop-only { display: revert; }
.tablet-only { display: none; }
.print-only { display: none; }

/* ═══════════════════════════════════════════════════════
   RESPONSIVIDADE
   ═══════════════════════════════════════════════════════ */
@media (max-width: 1200px) {
  .grade-5 { grid-template-columns: repeat(3, 1fr); }
  .grade-6 { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 1024px) {
  .grade-4 { grid-template-columns: repeat(2, 1fr); }
  .grade-5 { grid-template-columns: repeat(2, 1fr); }
  .grade-6 { grid-template-columns: repeat(2, 1fr); }
  .desktop-only { display: none; }
  .tablet-only { display: revert; }
}

@media (max-width: 768px) {
  :root { --padding-x: 20px; }
  .secao { padding: 56px var(--padding-x); }
  .secao-Hero { padding: 80px var(--padding-x); }
  .secao-CTA { margin: 0 16px 48px; border-radius: var(--raio-lg); }
  .grade-2, .grade-3, .grade-4, .grade-5, .grade-6, .grade-auto-gd { grid-template-columns: 1fr; }
  .linha { gap: 16px; flex-direction: column; }
  .botao, .botao-sm, .botao-lg { width: 100%; justify-content: center; }
  .cartao { padding: 24px; }
  .cartao .imagem { margin: -24px -24px 20px; width: calc(100% + 48px); }
  .cartao-horizontal { flex-direction: column; }
  .cartao-horizontal .imagem { width: 100%; min-width: unset; }
  .nav { flex-direction: column; gap: 8px; }
  .entrada-grupo { flex-direction: column; }
  .entrada-grupo .entrada { border-radius: var(--raio); }
  .entrada-grupo .botao { border-radius: var(--raio); }
  .mobile-only { display: revert; }
  .tablet-only { display: none; }
  .w-metade { width: 100%; }
  .grid-cols-2, .grid-cols-3, .grid-cols-4 { grid-template-columns: 1fr; }
  .grid-flow-col { grid-auto-flow: row; }
  .hide-mobile { display: none !important; }
}

@media (max-width: 480px) {
  .secao { padding: 40px var(--padding-x); }
  .titulo { font-size: clamp(1.8rem, 8vw, 2.5rem); }
  .hide-phone { display: none !important; }
}

/* ═══════════════════════════════════════════════════════
   SELEÇÃO & SCROLLBAR
   ═══════════════════════════════════════════════════════ */
::selection { background: var(--acento); color: var(--texto-inv); }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--borda-forte); border-radius: var(--raio-full); }
::-webkit-scrollbar-thumb:hover { background: var(--texto-3); }

/* ═══════════════════════════════════════════════════════
   PRINT
   ═══════════════════════════════════════════════════════ */
@media print {
  .no-print, .no-print * { display: none !important; }
  .print-only { display: revert !important; }
  body { font-size: 12pt; color: #000; background: #fff; }
  a { text-decoration: underline; }
  .secao { padding: 20px 0; break-inside: avoid; page-break-inside: avoid; }
  .cartao { box-shadow: none; border: 1px solid #ccc; animation: none; }
  .botao { background: #000; color: #fff; }
  .secao-CTA { background: #000; color: #fff; }
  .secao-Nav { display: none; }
  @page { margin: 2cm; }
}
`
}
