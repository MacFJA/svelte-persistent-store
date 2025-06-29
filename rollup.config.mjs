import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import terser from "@rollup/plugin-terser"

import packageJson from "./package.json" with {type: "json"}


const name = packageJson.name
  .replaceAll(/^(@\S+\/)?(svelte-)?(\S+)/g, "$3")
  .replaceAll(/^\w/g, (m) => m.toUpperCase())
  .replaceAll(/-\w/g, (m) => m[1].toUpperCase())

const config = () => ({
  input: "src/index.ts",
  output: [
    { file: packageJson.module, format: "es", name },
    { file: packageJson.main, format: "umd", name },
  ],
  plugins: [
    sucrase({
      exclude: ["dist/*"],
      include: ["src/*"],
      transforms: ["typescript"],
    }),
    commonjs({}),
    resolve({
      extensions: [".mjs", ".js", ".json", ".node", ".ts"],
    }),
    terser(),
  ],
})

export default config()
