# @portugol/cli

> CLI oficial do **Portugol.js** — cria, compila e serve páginas web em português.  
> by **Eketiandro Gonçalo**

## Instalação global

```bash
npm install -g @portugol/cli
```

## Comandos

### `portugol iniciar <ficheiro.pjs>`
Inicia servidor de desenvolvimento com **live reload**.

```bash
portugol iniciar pagina.pjs
# → http://localhost:3000
# → Recarrega automaticamente ao guardar
```

### `portugol construir <ficheiro.pjs>`
Compila para HTML + CSS estático.

```bash
portugol construir pagina.pjs -o dist
# → dist/index.html
# → dist/styles.css
```

### `portugol novo [nome]`
Cria novo projecto com estrutura base.

```bash
portugol novo meu-site
cd meu-site
portugol iniciar paginas/inicio.pjs
```

### `portugol exportar <ficheiro.pjs>`
Gera projecto Next.js completo com `.pjs` nativo.

```bash
portugol exportar pagina.pjs -o meu-site
cd meu-site
npm install
npm run dev
```

## Exemplo rápido

```bash
# Criar ficheiro
echo 'pagina Inicio { titulo "Olá Mundo" botao { texto "Começar" } }' > pagina.pjs

# Iniciar servidor
portugol iniciar pagina.pjs
```

## Licença

MIT © [Eketiandro Gonçalo](https://github.com/EketiandrGoncalo)
