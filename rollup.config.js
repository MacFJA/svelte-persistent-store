import sucrase from "@rollup/plugin-sucrase"
import { terser } from "rollup-plugin-terser"

import pkg from "./package.json"

const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase())

const packageDependencies = [...Object.keys(pkg.dependencies), "sjcl-codec-hex/from-bits", "sjcl-codec-hex/to-bits"]
const packageDependenciesGlobals = Object.fromEntries(
  packageDependencies.map((name) => {
    return [
      name,
      name
        .replace(/^(@\S+\/)/, "") // Remove package scope
        .replace(/[^a-z0-9]([a-z0-9])/gi, (_, arg) => arg.toUpperCase()) // Replace '-', '_' and '/'
        .replace(/[^a-z0-9]/gi, ""), // Remove anything that is not a letter or number
    ]
  })
)
const config = () => ({
  input: "src/index.ts",
  output: [
    { file: pkg.module, format: "es", name },
    { file: pkg.main, format: "umd", name, globals: packageDependenciesGlobals },
  ],
  external: packageDependencies,
  plugins: [
    sucrase({
      exclude: ["dist/*"],
      include: ["src/*"],
      transforms: ["typescript"],
    }),
    terser(),
  ],
})

export default config()
