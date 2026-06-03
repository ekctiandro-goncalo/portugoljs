import { lexer } from "./dist/lexer.js"
import { parser } from "./dist/parser.js"
import { gerarPaginaLoader } from "./dist/generator/react.js"

export default function portugolLoader(source) {
  // Webpack espera que o loader sinalize erros via this.emitError
  const callback = this.async ? this.async() : null

  try {
    const tokens = lexer(source)
    const ast = parser(tokens)

    const paginas = ast.filter((n) => n.tipo === "Pagina")

    if (paginas.length === 0) {
      const err = new Error(
        `[portugol-loader] Nenhuma declaração "pagina" encontrada em: ${this.resourcePath}\n` +
        `Certifica-te que o ficheiro começa com: pagina NomeDaPagina { ... }`
      )
      if (callback) { callback(err); return }
      throw err
    }

    const paginaAtual = paginas[0]

    // gerarPaginaLoader já emite "use client" como primeira linha
    // Isso é obrigatório para Next.js App Router (app/)
    const codigo = gerarPaginaLoader(paginaAtual)

    if (callback) {
      callback(null, codigo)
    } else {
      return codigo
    }
  } catch (err) {
    const erro = err instanceof Error ? err : new Error(String(err))
    // Prefixar mensagem para facilitar debug
    if (!erro.message.startsWith("[portugol-loader]")) {
      erro.message = `[portugol-loader] ${erro.message}`
    }
    if (callback) {
      callback(erro)
    } else {
      throw erro
    }
  }
}
