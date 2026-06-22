import { lexer, parser, Interpreter } from "../packages/compiler/dist/index.js"
import { readFileSync } from "fs"

const codigo = readFileSync("teste/novo.pjs", "utf-8")
console.log("Código lido:", codigo.length, "bytes")

const tokens = lexer(codigo)
console.log("Tokens:", tokens.length)

const ast = parser(tokens)
console.log("AST nós:", ast.length)
for (const n of ast) {
  console.log("  Top-level:", n.tipo)
  if (n.tipo === "Pagina") {
    console.log("  Children:", n.corpo.length)
  }
}

const interp = new Interpreter()
const saida = interp.executar(ast)
console.log("\n--- Saída ---")
for (const s of saida) {
  if (s.tipo === "texto") console.log(s.valor)
  else if (s.tipo === "erro") console.error("ERRO:", s.valor)
  else if (s.tipo === "aviso") console.warn("AVISO:", s.valor)
}
