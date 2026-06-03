# @portugol/compiler

> Compilador oficial do **Portugol.js** — a primeira linguagem de programação web em português.  
> by **Eketiandro Gonçalo**

## O que é?

O `@portugol/compiler` transforma ficheiros `.pjs` (Portugol.js) em:
- **React** (`React.createElement`) — para Next.js e aplicações React
- **HTML + CSS** — páginas estáticas prontas para deploy

## Instalação

```bash
npm install @portugol/compiler
```

## Uso básico

```ts
import { lexer, parser, gerarHTML } from "@portugol/compiler"

const codigo = `
pagina Inicio {
    titulo "Olá Mundo"
    texto "Programação em português."
    botao { texto "Começar" }
}
`

const tokens = lexer(codigo)
const ast = parser(tokens)
const { html, css } = gerarHTML(ast)
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
    texto "Feita em Portugol.js"
}
```

## Sintaxe

```
pagina Nome {
    secao Hero {
        centralizar
        padding 80

        titulo "Título principal"
        texto "Descrição do produto."

        botao { texto "Começar" }
    }

    grade 3 {
        cartao {
            icone foguete
            subtitulo "Rápido"
            texto "Zero configuração."
        }
    }
}
```

## Componentes disponíveis

| Componente | Descrição |
|---|---|
| `pagina` | Página web completa |
| `secao` | Secção com estilos |
| `titulo` | Título h1 |
| `subtitulo` | Título h2 |
| `texto` | Parágrafo |
| `botao` | Botão clicável |
| `entrada` | Input (email, texto, numero...) |
| `imagem` | Imagem |
| `video` | Embed YouTube/Vimeo |
| `linha` | Layout flex horizontal |
| `coluna` | Layout flex vertical |
| `grade` | CSS Grid |
| `cartao` | Card com sombra |
| `icone` | Ícone Lucide em português |
| `ligacao` | Link/âncora |
| `distintivo` | Badge/tag |
| `divisor` | Linha horizontal |
| `lista` | Lista com itens |
| `citacao` | Blockquote |
| `espacador` | Espaço vertical |

## Licença

MIT © [Eketiandro Gonçalo](https://github.com/EketiandrGoncalo)
