export type Expressao =
  | { tipo: "Str"; valor: string }
  | { tipo: "Num"; valor: string }
  | { tipo: "Bool"; valor: boolean }
  | { tipo: "Ident"; nome: string }
  | { tipo: "Binaria"; esq: Expressao; oper: string; dir: Expressao }
  | { tipo: "Unaria"; oper: string; expr: Expressao }
  | { tipo: "Chamada"; nome: string; args: Expressao[] }
  | { tipo: "Array"; elementos: Expressao[] }
  | { tipo: "Nulo" }

export interface Campo {
  nome: string
  tipo: string
  modificadores: string[]
}

export interface Caso {
  valor: Expressao
  corpo: No[]
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
  animacao?: string
  cursor?: string
  overflow?: string
  transicao?: string
  decoracao?: string
  maiusculas?: string
  classe?: string
  // Eventos
  ao_clicar?: string
  ao_mudar?: string
  ao_submeter?: string
  ao_focar?: string
  ao_desfocar?: string
  // Propriedades CSS avançadas
  fonte?: string
  disposicao?: string
  direcao?: string
  posicao?: string
  topo?: string
  direita?: string
  baixo?: string
  esquerda?: string
  largura_min?: string
  largura_max?: string
  altura_min?: string
  altura_max?: string
  fundo_imagem?: string
  fundo_tamanho?: string
  fundo_repetir?: string
  fundo_posicao?: string
  fundo_anexo?: string
  transformar?: string
  filtro?: string
  mascara?: string
  combinar?: string
  aspecto?: string
  encaixe?: string
  isolamento?: string
  indice_z?: string
  redimensionar?: string
  translucido?: string
  rolagem_x?: string
  rolagem_y?: string
}

export const PROPRIEDADES_ESTILO = new Set([
  "cor", "fundo", "largura", "altura", "padding", "margem",
  "borda", "raio", "sombra", "tamanho", "peso", "alinhamento",
  "espacamento", "opacidade", "justificar", "centralizar", "origem",
  "animacao", "cursor", "overflow", "transicao", "decoracao", "maiusculas",
  "classe",
  "ao_clicar", "ao_mudar", "ao_submeter", "ao_focar", "ao_desfocar",
  "fonte", "disposicao", "direcao", "posicao",
  "topo", "direita", "baixo", "esquerda",
  "largura_min", "largura_max", "altura_min", "altura_max",
  "fundo_imagem", "fundo_tamanho", "fundo_repetir", "fundo_posicao", "fundo_anexo",
  "transformar", "filtro", "mascara", "combinar",
  "aspecto", "encaixe", "isolamento", "indice_z",
  "redimensionar", "translucido", "rolagem_x", "rolagem_y",
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
  | { tipo: "Se"; condicao: Expressao; entao: No[]; senao: No[]; senaoSe?: { condicao: Expressao; corpo: No[] }[] }
  | { tipo: "Enquanto"; condicao: Expressao; corpo: No[] }
  | { tipo: "Escolher"; expr: Expressao; casos: Caso[]; padrao?: No[] }
  | { tipo: "ParaCada"; variavel: string; colecao: string; corpo: No[] }
  | { tipo: "Para"; variavel: string; inicio: Expressao; ate: Expressao; passo?: Expressao; corpo: No[] }
  | { tipo: "Rota"; caminho: string; metodos: MetodoRota[] }
  | { tipo: "Modelo"; nome: string; campos: Campo[] }
  | { tipo: "Retornar"; valor: Expressao }
  | { tipo: "Atribuir"; nome: string; valor: Expressao }
  | { tipo: "Variavel"; nome: string; valor?: Expressao }
  | { tipo: "Parar" }
  | { tipo: "Continuar" }
  | { tipo: "Escrever"; args: Expressao[] }
