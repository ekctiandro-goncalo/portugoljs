<div align="center">

<br/>

# Portugol.js

### A primeira linguagem de programação web em português

<br/>

[![npm compiler](https://img.shields.io/npm/v/@porttugol/compiler?style=flat-square&color=6d28d9&label=compiler)](https://www.npmjs.com/package/@porttugol/compiler)
[![npm cli](https://img.shields.io/npm/v/@porttugol/cli?style=flat-square&color=7c3aed&label=cli)](https://www.npmjs.com/package/@porttugol/cli)
[![License MIT](https://img.shields.io/badge/licença-MIT-green?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-ekctiandro--goncalo-black?style=flat-square&logo=github)](https://github.com/ekctiandro-goncalo/portugoljs)

<br/>

> **Escreves em português. Ela compila para React.**  
> Zero configuração. Zero inglês obrigatório.

<br/>

</div>

---

## O que é?

O **Portugol.js** é uma linguagem de programação web que compila para React e HTML. Escreves o teu site em português, e o compilador transforma tudo em código moderno pronto para o browser.

Criado por **Eketiandro Gonçalo** para a comunidade lusófona.

---

## Instalação rápida

```bash
npm install -g @porttugol/cli
```

---

## O teu primeiro site em 30 segundos

```bash
# Criar um ficheiro
echo 'pagina Inicio { titulo "Olá Mundo" botao { texto "Começar" } }' > pagina.pjs

# Ver no browser com live reload
portugol iniciar pagina.pjs
```

Abre **http://localhost:3000** e o teu site está no ar.

---

## Sintaxe

```
pagina MeuSite {

    secao Hero {
        centralizar
        padding 120

        distintivo "Novo"

        titulo {
            texto "Programa em português"
            tamanho 72
            peso 700
        }

        texto "A linguagem web que a comunidade lusófona merecia."

        linha {
            botao { texto "Começar agora" }
            ligacao { texto "Ver documentação →" para "#docs" }
        }
    }

    grade 3 {
        cartao {
            icone foguete
            subtitulo "Rápido"
            texto "Do ficheiro .pjs ao browser em segundos."
        }
        cartao {
            icone codigo
            subtitulo "React por baixo"
            texto "Compila para React.createElement sem JSX."
        }
        cartao {
            icone globo
            subtitulo "Open Source"
            texto "MIT License. Contribuições bem-vindas."
        }
    }

    citacao {
        texto "Finalmente consigo criar sites sem aprender inglês primeiro."
        autor "Utilizador da comunidade"
    }

}
```

---

## Comandos CLI

| Comando | Descrição |
|---|---|
| `portugol iniciar ficheiro.pjs` | Servidor de desenvolvimento com live reload |
| `portugol construir ficheiro.pjs` | Compila para HTML + CSS estático |
| `portugol correr ficheiro.pjs` | Executa lógica .pjs no terminal (interpreter) |
| `portugol novo nome-do-projecto` | Cria novo projecto com estrutura base |
| `portugol exportar ficheiro.pjs` | Gera projecto Next.js completo |

---

## Componentes disponíveis

| Componente | Descrição | HTML gerado |
|---|---|---|
| `pagina` | Página web completa | — |
| `secao` | Secção com estilos | `<section>` |
| `titulo` | Título principal | `<h1>` |
| `subtitulo` | Título secundário | `<h2>` |
| `texto` | Parágrafo | `<p>` |
| `botao` | Botão clicável | `<button>` |
| `entrada` | Campo de input | `<input>` |
| `imagem` | Imagem | `<img>` |
| `video` | Embed YouTube/Vimeo | `<iframe>` |
| `linha` | Layout horizontal | `<div>` flex |
| `coluna` | Layout vertical | `<div>` flex-col |
| `grade` | Grelha CSS | `<div>` grid |
| `cartao` | Card com sombra e hover | `<div>` |
| `icone` | Ícone Lucide em português | SVG inline |
| `ligacao` | Link / âncora | `<a>` |
| `distintivo` | Badge / tag | `<span>` |
| `divisor` | Linha horizontal | `<hr>` |
| `lista` | Lista de itens | `<ul>` |
| `citacao` | Blockquote com autor | `<blockquote>` |
| `espacador` | Espaço vertical | `<div>` |

---

## Ícones disponíveis (Lucide em português)

```
foguete    codigo     terminal   relampago  escudo     globo
pacote     relogio    grafico    livro      lampada    pesquisar
utilizador verificar  erro       aviso      estrela    coracao
github     mail       twitter    seta_direita          casa
menu       fechar     notificacao definicoes copiar    descarregar
```

Uso: `icone foguete`, `icone coracao`, `icone github`

---

## Propriedades de estilo

```
cor         fundo       largura     altura      padding     margem
borda       raio        sombra      tamanho     peso        alinhamento
espacamento opacidade   justificar  centralizar animacao    cursor
transicao   decoracao   maiusculas  overflow
```

Exemplo:
```
titulo {
    texto "Olá"
    tamanho 48
    peso 700
    alinhamento centro
    cor "#6d28d9"
}
```

---

## Variantes de Componentes

Além dos componentes base, cada componente tem **variantes** que mudam o visual:

| Componente | Variante | Uso |
|---|---|---|
| `botao` | `botao-outline` | `classe "botao-outline"` |
| `botao` | `botao-ghost` | Fundo transparente |
| `botao` | `botao-gradiente` | Gradiente colorido |
| `botao` | `botao-sm` / `botao-lg` | Tamanhos alternativos |
| `cartao` | `cartao-plano` | Sem sombra nem animação |
| `cartao` | `cartao-borda` | Borda lateral destacada |
| `cartao` | `cartao-destaque` | Fundo com gradiente suave |
| `cartao` | `cartao-interativo` | Clickable com feedback |
| `distintivo` | `distintivo-acento` / `distintivo-info` | Cores semânticas |
| `distintivo` | `distintivo-sm` / `distintivo-lg` | Tamanhos |
| `entrada` | `entrada-erro` / `entrada-sucesso` | Estado do input |
| `citacao` | `citacao-destaque` | Com border-left |

---

## Utilitários CSS (Tailwind-style)

O CSS gerado inclui centenas de **classes utilitárias** para estilizar rapidamente:

### Layout & Display
```
d-flex    d-inline-flex    d-grid    d-bloco    d-oculto
flex-row  flex-col         flex-wrap  items-center  justify-center
gap-1     gap-2            gap-4      gap-6         gap-8
```

### Padding & Margin
```
p-0  p-2  p-4  p-6  p-8   px-4  py-4
m-0  mt-2 mt-4 mt-6 mt-8  mb-4  mx-auto
```

### Tipografia
```
text-xs  text-sm  text-base  text-lg  text-xl  text-2xl  text-3xl
font-normal  font-medium  font-semibold  font-bold
text-esquerda  text-centro  text-direita
text-maiusculas  text-minusculas  text-capitalizar
c-texto  c-texto2  c-texto3  c-acento  c-info  c-sucesso  c-erro
```

### Fundo & Gradiente
```
bg-fundo  bg-elevado  bg-subtil  bg-superfice  bg-acento
gradiente-hero  gradiente-escuro  gradiente-colorido
```

### Vidro (Glassmorphism)
```
vidro        /* background: rgba(255,255,255,0.6); backdrop-filter: blur(16px) */
vidro-forte  /* Mais opaco, blur(24px) */
```

### Animação
```
animar-fade    animar-subir    animar-descer    animar-escalar
animar-pulsar  animar-rodar    animar-lento     animar-rapido
animar-atraso-1  ...  animar-atraso-5
hover\:animar-subir   hover\:subir   hover\:sombra
```

### Responsividade
```
mobile-only   desktop-only   tablet-only
w-full   w-max   w-metade   h-dvh
```

### Exemplo com utilitários
```
pagina Inicio {
    secao Hero {
        classe "d-flex flex-col items-center text-centro gradiente-hero"
        titulo { texto "Portugol.js" classe "animar-subir" }
        texto { "Escreves em português." classe "c-texto3" }
        linha { classe "gap-4 animar-subir animar-atraso-1"
            botao { texto "Começar" }
            botao { texto "Documentação" classe "botao-outline" }
        }
    }
}
```

---

## Lógica e Scripting (Modo Terminal)

A partir da v0.2.1, o Portugol.js também suporta **lógica imperativa** para executar directamente no terminal com `portugol correr`.

```
var idade = 18
var temCarta = verdadeiro

se idade >= 18 e temCarta == verdadeiro {
    texto "Podes conduzir!"
} senao {
    texto "Não podes conduzir."
}

var i = 1
enquanto i <= 5 {
    texto "Contagem: " + i
    i = i + 1
}

para i = 0 ate 10 {
    texto i
}

escolher nota {
    caso "A" { texto "Excelente" }
    caso "B" { texto "Bom" }
    caso "C" { texto "Suficiente" }
    padrao { texto "Outro" }
}

funcao fib(n) {
    se n <= 1 { retornar n }
    retornar fib(n - 1) + fib(n - 2)
}

texto "Fibonacci(10) = " + fib(10)
```

**Conceitos suportados:**
| Conceito | Descrição |
|---|---|
| `var nome = valor` | Declaração de variável |
| `nome = expr` | Atribuição |
| `se cond { ... } senao { ... }` | Condicional |
| `escolher expr { caso ... padrao }` | Switch em português |
| `enquanto cond { ... }` | Loop com condição |
| `para i = inicio ate fim { ... }` | Loop numérico |
| `para cada item in lista { ... }` | Iteração sobre lista |
| `funcao nome(params) { ... }` | Definição de função |
| `retornar expr` | Retorno de valor |
| `parar` / `continuar` | Controlo de loops |
| `e` / `ou` / `!` | Operadores lógicos em português |
| `verdadeiro` / `falso` | Booleanos em português |

---

## Integração com Next.js

```bash
npm install @porttugol/compiler
```

```js
// next.config.mjs
import withPortugol from "@porttugol/compiler/next"
export default withPortugol({})
```

```
// app/page.pjs
pagina Inicio {
    titulo "A minha página Next.js"
    texto "Escrita em Portugol.js"
}
```

---

## Estrutura do projecto

```
portugoljs/
├── packages/
│   ├── compiler/          # @porttugol/compiler — Lexer, Parser, AST, Interpreter, Gerador
│   ├── cli/               # @porttugol/cli — CLI com servidor e build
│   └── vscode-extension/  # Extensão VS Code / Kiro com autocomplete
├── teste/
│   ├── exemplo.pjs        # Exemplo com todos os componentes
│   ├── landing-premium.pjs # Landing page completa do Portugol.js
│   └── meu-site/          # Projecto Next.js de demonstração
└── README.md
```

---

## Pacotes NPM

| Package | NPM | Descrição |
|---|---|---|
| `@porttugol/compiler` | [![npm](https://img.shields.io/npm/v/@porttugol/compiler?style=flat-square&color=6d28d9)](https://www.npmjs.com/package/@porttugol/compiler) | Compilador: Lexer → Parser → AST → React/HTML |
| `@porttugol/cli` | [![npm](https://img.shields.io/npm/v/@porttugol/cli?style=flat-square&color=7c3aed)](https://www.npmjs.com/package/@porttugol/cli) | CLI: iniciar, construir, exportar, novo |

---

## Extensão VS Code / Kiro

Instala a extensão para teres:

- ✅ Syntax highlighting com cores por categoria
- ✅ Autocomplete inteligente (`Ctrl+Space`)
- ✅ Hover com descrição de cada keyword
- ✅ Snippets — `pagina`, `cartao`, `landing`, `grade3`...
- ✅ Botões de play/build no editor
- ✅ Ícone `.pjs` no explorador de ficheiros

**Instalar:**
```bash
# Descarrega o .vsix de packages/vscode-extension/
code --install-extension portugol-lang-0.2.1.vsix
```

---

## Contribuir

Contribuições são bem-vindas da comunidade lusófona e não só.

```bash
git clone https://github.com/ekctiandro-goncalo/portugoljs.git
cd portugoljs
npm install
cd packages/compiler && npm run build
cd ../cli && npm run build
```

---

## Licença

MIT © [Ekctiandro Gonçalo](https://github.com/ekctiandro-goncalo) — 2026

---

<div align="center">

**Feito com ❤️ para a comunidade lusófona**

*Angola · Portugal · Brasil · Moçambique · Cabo Verde · e mais*

</div>
