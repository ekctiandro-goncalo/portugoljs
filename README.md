# Portugol.js

> A primeira linguagem de programação web em português.  
> by **Eketiandro Gonçalo**

[![npm](https://img.shields.io/npm/v/@portugol/compiler?color=6d28d9&label=%40portugol%2Fcompiler)](https://www.npmjs.com/package/@portugol/compiler)
[![npm](https://img.shields.io/npm/v/@portugol/cli?color=6d28d9&label=%40portugol%2Fcli)](https://www.npmjs.com/package/@portugol/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Instalação

```bash
# CLI global
npm install -g @portugol/cli

# Compiler (para projectos)
npm install @portugol/compiler
```

## Uso rápido

```bash
# Criar novo projecto
portugol novo meu-site

# Iniciar servidor com live reload
portugol iniciar pagina.pjs

# Compilar para HTML
portugol construir pagina.pjs
```

## Sintaxe

```
pagina Inicio {

    secao Hero {
        centralizar
        padding 80

        titulo "Olá Mundo"
        texto "Programação em português para a web."

        botao { texto "Começar" }
    }

    grade 3 {
        cartao {
            icone foguete
            subtitulo "Rápido"
            texto "Zero configuração."
        }
        cartao {
            icone escudo
            subtitulo "Seguro"
            texto "HTML estático por defeito."
        }
        cartao {
            icone globo
            subtitulo "Open Source"
            texto "MIT License."
        }
    }

}
```

## Integração com Next.js

```js
// next.config.mjs
import withPortugol from "@portugol/compiler/next"
export default withPortugol({})
```

```
// app/page.pjs
pagina Inicio {
    titulo "A minha página"
    texto "Feita com Portugol.js"
}
```

## Pacotes

| Package | Descrição |
|---|---|
| [`@portugol/compiler`](packages/compiler) | Lexer, Parser, AST e gerador React/HTML |
| [`@portugol/cli`](packages/cli) | CLI: iniciar, construir, exportar |
| [`portugol-lang`](packages/vscode-extension) | Extensão VS Code / Kiro |

## Licença

MIT © [Eketiandro Gonçalo](https://github.com/ekctiandro-goncalo)
