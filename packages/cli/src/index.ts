#!/usr/bin/env node
import { Command } from "commander"
import chalk from "chalk"
import { lexer, parser, gerarReact, gerarPaginaNext, gerarHTML } from "@portugol/compiler"
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs"
import { join, dirname, basename, extname } from "path"

const program = new Command()

program
  .name("pgjs")
  .version("0.2.0")
  .description("Portugol.js — Crie landing pages premium em português")

// ─── pgjs construir ───

program
  .command("construir <arquivo>")
  .description("Construir ficheiro .pjs para HTML + CSS")
  .option("-o, --output <dir>", "Directório de saída", "dist")
  .option("--react", "Gerar React/TypeScript em vez de HTML")
  .option("--mostrar-tokens", "Mostrar tokens do lexer")
  .option("--mostrar-ast", "Mostrar AST do parser")
  .action(async (arquivo, options) => {
    const caminho = join(process.cwd(), arquivo)

    if (!existsSync(caminho)) {
      console.error(chalk.red(`✗ Ficheiro não encontrado: ${caminho}`))
      process.exit(1)
    }

    console.log(chalk.blue(`\n⚡ Portugol.js — Construindo: ${arquivo}\n`))

    const codigo = readFileSync(caminho, "utf-8")

    // Lexer
    const tokens = lexer(codigo)
    console.log(chalk.dim(`  Lexer   → ${tokens.length} tokens`))

    if (options.mostrarTokens) {
      tokens.forEach((t) => {
        const tipo = t.type.padEnd(12)
        console.log(`    ${chalk.yellow(tipo)} ${t.value}`)
      })
      console.log()
    }

    // Parser
    const ast = parser(tokens)
    console.log(chalk.dim(`  Parser  → ${ast.length} nós`))

    if (options.mostrarAst) {
      console.log(chalk.cyan(`  ${JSON.stringify(ast, null, 2)}`))
      console.log()
    }

    const nomeBase = basename(arquivo, extname(arquivo))
    const dirSaida = join(process.cwd(), options.output)

    if (!existsSync(dirSaida)) {
      mkdirSync(dirSaida, { recursive: true })
    }

    if (options.react) {
      // ─── Output React/TSX ───
      console.log(chalk.dim(`  Gerador → React/TypeScript`))
      const codigoGerado = gerarReact(ast)
      const caminhoSaida = join(dirSaida, `${nomeBase}.tsx`)
      writeFileSync(caminhoSaida, codigoGerado, "utf-8")
      console.log(chalk.green(`\n  ✓ ${caminhoSaida}\n`))
    } else {
      // ─── Output HTML + CSS ───
      console.log(chalk.dim(`  Gerador → HTML + CSS`))
      const saida = gerarHTML(ast)
      const caminhoHTML = join(dirSaida, "index.html")
      const caminhoCSS = join(dirSaida, "styles.css")
      writeFileSync(caminhoHTML, saida.html, "utf-8")
      writeFileSync(caminhoCSS, saida.css, "utf-8")
      console.log(chalk.green(`\n  ✓ ${caminhoHTML}`))
      console.log(chalk.green(`  ✓ ${caminhoCSS}\n`))
      console.log(chalk.cyan(`  Abre ${caminhoHTML} no browser para ver o resultado.`))
    }

    console.log()
  })

// ─── pgjs compilar (alias para construir) ───

program
  .command("compilar <arquivo>")
  .description("Compilar ficheiro .pjs (alias de construir)")
  .option("-o, --output <dir>", "Directório de saída", "dist")
  .option("--react", "Gerar React/TypeScript em vez de HTML")
  .option("--mostrar-tokens", "Mostrar tokens do lexer")
  .option("--mostrar-ast", "Mostrar AST do parser")
  .action(async (arquivo, options) => {
    // Redireciona para construir
    await program.commands.find(c => c.name() === "construir")!.parseAsync(
      ["node", "pgjs", "construir", arquivo,
        ...(options.output !== "dist" ? ["-o", options.output] : []),
        ...(options.react ? ["--react"] : []),
        ...(options.mostrarTokens ? ["--mostrar-tokens"] : []),
        ...(options.mostrarAst ? ["--mostrar-ast"] : []),
      ]
    )
  })

// ─── pgjs exportar (Next.js com .pjs nativo) ───

program
  .command("exportar <arquivo>")
  .description("Criar projecto Next.js com .pjs a correr nativamente")
  .option("-o, --output <dir>", "Directório de saída", "meu-site")
  .action(async (arquivo, options) => {
    const caminho = join(process.cwd(), arquivo)
    if (!existsSync(caminho)) {
      console.error(chalk.red(`✗ Ficheiro não encontrado: ${caminho}`))
      process.exit(1)
    }

    const dirSaida = join(process.cwd(), options.output)
    console.log(chalk.blue(`\n🚀 Gerando projecto Next.js com .pjs nativo: ${dirSaida}\n`))

    const codigo = readFileSync(caminho, "utf-8")
    const tokens = lexer(codigo)
    const ast = parser(tokens)
    const paginas = ast.filter((n) => n.tipo === "Pagina") as (typeof ast & { tipo: "Pagina" }[]) ?? []

    if (paginas.length === 0) {
      console.error(chalk.red("Nenhuma página encontrada no ficheiro."))
      process.exit(1)
    }

    const appDir = join(dirSaida, "app")
    mkdirSync(appDir, { recursive: true })

    // package.json
    writeFileSync(
      join(dirSaida, "package.json"),
      JSON.stringify(
        {
          name: basename(dirSaida),
          version: "0.1.0",
          private: true,
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
          },
          dependencies: {
            next: "^14.2.0",
            react: "^18.3.0",
            "react-dom": "^18.3.0",
            "@portugol/compiler": "file:../../packages/compiler",
          },
          devDependencies: {
            typescript: "^5.5.0",
            "@types/node": "^20.14.0",
            "@types/react": "^18.3.0",
            "@types/react-dom": "^18.3.0",
            tailwindcss: "^3.4.0",
            postcss: "^8.4.0",
            autoprefixer: "^10.4.0",
          },
        },
        null,
        2,
      ),
      "utf-8",
    )
    console.log(chalk.green("  ✓ package.json"))

    // next.config.mjs (usa plugin withPortugol)
    writeFileSync(
      join(dirSaida, "next.config.mjs"),
      [
        'import withPortugol from "@portugol/compiler/next"',
        "",
        "export default withPortugol({",
        "  // outras configs Next.js aqui",
        "})",
        "",
      ].join("\n"),
      "utf-8",
    )
    console.log(chalk.green("  ✓ next.config.mjs"))

    // tsconfig.json
    writeFileSync(
      join(dirSaida, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2017",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [{ name: "next" }],
          },
          include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.pjs"],
          exclude: ["node_modules"],
        },
        null,
        2,
      ),
      "utf-8",
    )
    console.log(chalk.green("  ✓ tsconfig.json"))

    // tailwind.config.js
    writeFileSync(
      join(dirSaida, "tailwind.config.js"),
      [
        "/** @type {import('tailwindcss').Config} */",
        "module.exports = {",
        '  content: ["./app/**/*.{tsx,jsx,pjs}"],',
        "  safelist: [",
        '    "min-h-screen", "p-6", "p-8",',
        '    "flex", "flex-col", "gap-4",',
        '    "card", "rounded-xl", "shadow-md", "bg-white",',
        "  ],",
        "  theme: {",
        "    extend: {},",
        "  },",
        "  plugins: [],",
        "}",
        "",
      ].join("\n"),
      "utf-8",
    )
    console.log(chalk.green("  ✓ tailwind.config.js"))

    // postcss.config.js
    writeFileSync(
      join(dirSaida, "postcss.config.js"),
      [
        "module.exports = {",
        "  plugins: {",
        "    tailwindcss: {},",
        "    autoprefixer: {},",
        "  },",
        "}",
        "",
      ].join("\n"),
      "utf-8",
    )
    console.log(chalk.green("  ✓ postcss.config.js"))

    // app/globals.css
    writeFileSync(
      join(appDir, "globals.css"),
      "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n",
      "utf-8",
    )
    console.log(chalk.green("  ✓ app/globals.css"))

    // app/layout.tsx
    writeFileSync(
      join(appDir, "layout.tsx"),
      [
        'import type { Metadata } from "next"',
        'import "./globals.css"',
        "",
        "export const metadata: Metadata = {",
        '  title: "Portugol App",',
        '  description: "Feito com Portugol.js",',
        "}",
        "",
        "export default function RootLayout({",
        "  children,",
        "}: {",
        "  children: React.ReactNode",
        "}) {",
        "  return (",
        '    <html lang="pt">',
        "      <body>{children}</body>",
        "    </html>",
        "  )",
        "}",
        "",
      ].join("\n"),
      "utf-8",
    )
    console.log(chalk.green("  ✓ app/layout.tsx"))

    // Gerar .pjs para cada pagina (directamente em app/)
    let primeira = true
    for (const pagina of paginas) {
      const nome = (pagina as any).nome
      const nomeLower = nome.toLowerCase()
      const conteudoOriginal = readFileSync(caminho, "utf-8")
      const blocoPagina = extrairBlocoPagina(conteudoOriginal, nome)

      if (primeira) {
        // Primeira página → app/page.pjs
        writeFileSync(join(appDir, "page.pjs"), blocoPagina, "utf-8")
        console.log(chalk.green(`  ✓ app/page.pjs (${nome})`))
        primeira = false
      } else {
        const dirPagina = join(appDir, nomeLower)
        mkdirSync(dirPagina, { recursive: true })
        writeFileSync(join(dirPagina, "page.pjs"), blocoPagina, "utf-8")
        console.log(chalk.green(`  ✓ app/${nomeLower}/page.pjs (${nome})`))
      }
    }

    console.log()
    console.log(chalk.cyan(`  cd ${options.output}`))
    console.log(chalk.cyan("  npm install"))
    console.log(chalk.cyan("  npm run dev"))
    console.log()
    console.log(chalk.dim("  Dica: .pjs compila automaticamente via webpack loader"))
    console.log(chalk.dim("  Escreve .pjs — Next.js serve na hora."))
  })

function extrairBlocoPagina(codigo: string, nome: string): string {
  // Extrai o bloco `pagina Nome { ... }` do código fonte
  const regex = new RegExp(`pagina\\s+${nome}\\s*\\{`, "i")
  const match = regex.exec(codigo)
  if (!match) return `pagina ${nome} {\n    titulo "${nome}"\n}\n`

  let profundidade = 0
  let inicio = match.index
  let i = match.index
  let encontrouAbertura = false

  while (i < codigo.length) {
    if (codigo[i] === "{") {
      profundidade++
      encontrouAbertura = true
    } else if (codigo[i] === "}") {
      profundidade--
      if (encontrouAbertura && profundidade === 0) {
        return codigo.slice(inicio, i + 1) + "\n"
      }
    }
    i++
  }

  return `pagina ${nome} {\n    titulo "${nome}"\n}\n`
}

// ─── pgjs novo ───

program
  .command("novo [nome]")
  .description("Criar novo projecto Portugol.js")
  .action(async (nome) => {
    const dir = nome ? join(process.cwd(), nome) : process.cwd()
    const nomeProjecto = nome || basename(process.cwd())

    console.log(chalk.blue(`\n⚡ Portugol.js — Novo projecto: ${nomeProjecto}\n`))

    if (nome && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }

    // Criar estrutura
    const pastas = ["paginas", "imagens"]
    for (const pasta of pastas) {
      const caminho = join(dir, pasta)
      if (!existsSync(caminho)) {
        mkdirSync(caminho, { recursive: true })
        console.log(chalk.green(`  ✓ ${pasta}/`))
      }
    }

    // Exemplo de landing page
    const exemplo = join(dir, "paginas", "inicio.pjs")
    if (!existsSync(exemplo)) {
      writeFileSync(
        exemplo,
        [
          `pagina Inicio {`,
          ``,
          `    secao Hero {`,
          `        centralizar`,
          `        padding 120`,
          ``,
          `        titulo {`,
          `            texto "${nomeProjecto}"`,
          `            tamanho 72`,
          `            peso 700`,
          `        }`,
          ``,
          `        espacador 16`,
          ``,
          `        texto "O futuro começa aqui."`,
          ``,
          `        espacador 32`,
          ``,
          `        botao {`,
          `            texto "Começar Agora"`,
          `        }`,
          `    }`,
          ``,
          `    secao Funcionalidades {`,
          `        alinhamento "centro"`,
          `        padding 80`,
          ``,
          `        titulo "Funcionalidades"`,
          ``,
          `        espacador 48`,
          ``,
          `        grade 3 {`,
          `            cartao {`,
          `                titulo "Simples"`,
          `                texto "Fácil de usar e intuitivo."`,
          `            }`,
          `            cartao {`,
          `                titulo "Rápido"`,
          `                texto "Resultados em segundos."`,
          `            }`,
          `            cartao {`,
          `                titulo "Poderoso"`,
          `                texto "Tudo o que precisas."`,
          `            }`,
          `        }`,
          `    }`,
          ``,
          `}`,
          ``,
        ].join("\n"),
        "utf-8",
      )
      console.log(chalk.green(`  ✓ paginas/inicio.pjs`))
    }

    console.log()
    console.log(chalk.cyan("  Próximos passos:"))
    if (nome) {
      console.log(chalk.cyan(`  cd ${nome}`))
    }
    console.log(chalk.cyan("  pgjs construir paginas/inicio.pjs"))
    console.log(chalk.cyan("  Abre dist/index.html no browser"))
    console.log()
  })

// ─── pgjs iniciar — Dev Server com Live Reload ───

program
  .command("iniciar <arquivo>")
  .description("Iniciar servidor de desenvolvimento com live reload")
  .option("-p, --porta <numero>", "Porta do servidor", "3000")
  .action(async (arquivo, options) => {
    const { createServer } = await import("http")
    const { watch } = await import("fs")

    const caminho = join(process.cwd(), arquivo)
    if (!existsSync(caminho)) {
      console.error(chalk.red(`✗ Ficheiro não encontrado: ${caminho}`))
      process.exit(1)
    }

    const porta = parseInt(options.porta, 10)

    // Lista de clientes SSE para live reload
    const clientes: import("http").ServerResponse[] = []

    // ─── Compilar ───
    function compilar(): { html: string; css: string } | null {
      try {
        const codigo = readFileSync(caminho, "utf-8")
        const tokens = lexer(codigo)
        const ast = parser(tokens)
        const saida = gerarHTML(ast)

        // Injectar script de live reload no HTML
        const scriptLiveReload = `
<script>
(function() {
  function conectar() {
    var es = new EventSource('/__reload');
    es.addEventListener('message', function(e) {
      if (e.data === 'reload') { location.reload(); }
    });
    es.onerror = function() { es.close(); setTimeout(conectar, 2000); };
  }
  conectar();
})();
</script>`

        const htmlComReload = saida.html.replace("</body>", scriptLiveReload + "\n</body>")

        return { html: htmlComReload, css: saida.css }
      } catch (err: any) {
        console.error(chalk.red(`\n  ✗ Erro de compilação: ${err.message}\n`))
        return null
      }
    }

    let conteudo = compilar()

    // ─── Servidor HTTP ───
    const servidor = createServer((req, res) => {
      const url = req.url || "/"

      // SSE endpoint para live reload
      if (url === "/__reload") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Access-Control-Allow-Origin": "*",
        })
        res.write("data: connected\n\n")
        clientes.push(res)
        req.on("close", () => {
          const idx = clientes.indexOf(res)
          if (idx >= 0) clientes.splice(idx, 1)
        })
        return
      }

      if (!conteudo) {
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" })
        res.end("<h1>Erro de compilação</h1><p>Verifica o terminal.</p>")
        return
      }

      // Servir CSS
      if (url === "/styles.css") {
        res.writeHead(200, { "Content-Type": "text/css; charset=utf-8" })
        res.end(conteudo.css)
        return
      }

      // Servir HTML (qualquer rota)
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
      res.end(conteudo.html)
    })

    servidor.listen(porta, () => {
      console.log(chalk.blue(`\n⚡ Portugol.js — Servidor de desenvolvimento\n`))
      console.log(chalk.green(`  ✓ Compilado: ${arquivo}`))
      console.log(chalk.cyan(`  ➜ Local:   http://localhost:${porta}\n`))
      console.log(chalk.dim(`  A observar alterações em ${arquivo}...`))
      console.log(chalk.dim(`  Ctrl+C para parar\n`))
    })

    // ─── Watch ficheiro ───
    // Usa hash do conteúdo para só recompilar quando o ficheiro realmente mudou
    // Evita o problema do Windows que dispara eventos contínuos sem alterações
    const { createHash } = await import("crypto")

    function hashFicheiro(): string {
      try {
        const conteudo = readFileSync(caminho, "utf-8")
        return createHash("md5").update(conteudo).digest("hex")
      } catch {
        return ""
      }
    }

    let hashAnterior = hashFicheiro()
    let debounce: ReturnType<typeof setTimeout> | null = null

    watch(caminho, () => {
      if (debounce) clearTimeout(debounce)
      debounce = setTimeout(() => {
        const hashAtual = hashFicheiro()

        // Só recompila se o conteúdo realmente mudou
        if (hashAtual === hashAnterior) return
        hashAnterior = hashAtual

        const agora = new Date().toLocaleTimeString("pt-PT")
        console.log(chalk.dim(`  [${agora}] Alteração detectada, a recompilar...`))

        const novo = compilar()
        if (novo) {
          conteudo = novo
          console.log(chalk.green(`  ✓ Recompilado com sucesso`))

          // Notificar todos os clientes para reload
          for (const cliente of clientes) {
            cliente.write("data: reload\n\n")
          }
        }
      }, 300)
    })
  })

// ─── pgjs init (alias de novo) ───

program
  .command("init")
  .description("Inicializar projecto Portugol.js (alias de novo)")
  .action(async () => {
    await program.commands.find(c => c.name() === "novo")!.parseAsync(
      ["node", "pgjs", "novo"]
    )
  })

program.parse()
