import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * withPortugol — plugin Next.js para ficheiros .pjs
 *
 * Arquitectura:
 *   .pjs  →  [portugol-loader]  →  JS (React.createElement + "use client")
 *        →  [Next SWC pipeline]  →  bundle final
 *
 * O loader corre como "pre" loader e transforma .pjs em JS puro
 * sem JSX, pelo que o SWC/Babel do Next processa normalmente a seguir.
 *
 * "use client" é emitido automaticamente pelo gerarPaginaLoader,
 * o que é necessário para ficheiros em app/ (App Router).
 */
function withPortugol(nextConfig = {}) {
  return {
    ...nextConfig,

    // Adiciona .pjs às extensões reconhecidas como páginas
    pageExtensions: [
      ...(nextConfig.pageExtensions ?? ["tsx", "ts", "jsx", "js"]),
      "pjs",
    ],

    webpack(config, options) {
      // Garante que .pjs é resolvível como módulo
      config.resolve.extensions = [
        ...(config.resolve.extensions ?? []),
        ".pjs",
      ]

      // Regra de transformação: .pjs → JS (React.createElement)
      // enforce: "pre" garante que corre antes de qualquer outro loader
      // incluindo o babel-loader / swc-loader do Next
      config.module.rules.push({
        test: /\.pjs$/,
        enforce: "pre",
        use: [
          {
            loader: join(__dirname, "loader.js"),
          },
        ],
      })

      // Encadeia com a configuração webpack do utilizador, se existir
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  }
}

export default withPortugol
