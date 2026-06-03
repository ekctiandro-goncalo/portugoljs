export type Expressao =
  | { tipo: "Str"; valor: string }
  | { tipo: "Num"; valor: string }
  | { tipo: "Bool"; valor: boolean }
  | { tipo: "Ident"; nome: string }
  | { tipo: "Binaria"; esq: Expressao; oper: string; dir: Expressao }
  | { tipo: "Unaria"; oper: string; expr: Expressao }

export interface Campo {
  nome: string
  tipo: string
  modificadores: string[]
}

export interface MetodoRota {
  tipo: "obter" | "criar" | "atualizar" | "deletar"
  corpo: No[]
}

// ─── MVP Landing Page: Propriedades de estilo ───

export interface Estilos {
  cor?: string
  fundo?: string
  largura?: string
  altura?: string
  padding?: string
  margem?: string
  borda?: string
  raio?: string
  sombra?: string
  tamanho?: string
  peso?: string
  alinhamento?: string
  espacamento?: string
  opacidade?: string
  justificar?: string
  centralizar?: boolean
  origem?: string
  // Novos
  animacao?: string
  cursor?: string
  overflow?: string
  transicao?: string
  decoracao?: string
  maiusculas?: string
}

export const PROPRIEDADES_ESTILO = new Set([
  "cor", "fundo", "largura", "altura", "padding", "margem",
  "borda", "raio", "sombra", "tamanho", "peso", "alinhamento",
  "espacamento", "opacidade", "justificar", "centralizar", "origem",
  "animacao", "cursor", "overflow", "transicao", "decoracao", "maiusculas",
])

// ─── AST Nodes ───

export type No =
  | { tipo: "Pagina"; nome: string; corpo: No[]; estilos?: Estilos }
  | { tipo: "Titulo"; valor: Expressao; estilos?: Estilos }
  | { tipo: "Subtitulo"; valor: Expressao; estilos?: Estilos }
  | { tipo: "Texto"; valor: Expressao; estilos?: Estilos }
  | { tipo: "Botao"; label: string; estilos?: Estilos }
  | { tipo: "Entrada"; tipoInput: string; placeholder?: string; rotulo?: string }
  | { tipo: "Imagem"; origem: string; estilos?: Estilos; alt?: string }
  | { tipo: "Linha"; corpo: No[]; estilos?: Estilos }
  | { tipo: "Coluna"; corpo: No[]; estilos?: Estilos }
  | { tipo: "Cartao"; corpo: No[]; estilos?: Estilos }
  | { tipo: "Secao"; nome?: string; corpo: No[]; estilos?: Estilos }
  | { tipo: "Grade"; colunas: number; corpo: No[]; estilos?: Estilos }
  | { tipo: "Espacador"; tamanho: string }
  // Novos nós
  | { tipo: "Icone"; valor: string; estilos?: Estilos }
  | { tipo: "Ligacao"; label: string; para: string; estilos?: Estilos }
  | { tipo: "Distintivo"; label: string; estilos?: Estilos }
  | { tipo: "Divisor"; estilos?: Estilos }
  | { tipo: "Video"; origem: string; estilos?: Estilos }
  | { tipo: "Lista"; itens: string[]; estilos?: Estilos }
  | { tipo: "Citacao"; texto: string; autor?: string; estilos?: Estilos }
  // Lógica
  | { tipo: "Funcao"; nome: string; params: string[]; corpo: No[] }
  | { tipo: "Se"; condicao: Expressao; entao: No[]; senao: No[] }
  | { tipo: "ParaCada"; variavel: string; colecao: string; corpo: No[] }
  | { tipo: "Rota"; caminho: string; metodos: MetodoRota[] }
  | { tipo: "Modelo"; nome: string; campos: Campo[] }
  | { tipo: "Retornar"; valor: Expressao }
