import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import {terser} from "rollup-plugin-terser"

import pkg from "./package.json"

const name = pkg.name
    .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
    .replace(/^\w/, m => m.toUpperCase())
    .replace(/-\w/g, m => m[1].toUpperCase())

const config = (es) => ({
    input: "src/index.ts",
    output: { file: es ? pkg.module : pkg.main, "format": es ? "es" : "umd", name },
    plugins: [
        sucrase({
            exclude: ["dist/*"],
            include: ["src/*"],
            transforms: ["typescript"]
        }),
        commonjs({
            ignore: es ? [] : ["crypto", "util"]
        }),
        resolve({
            extensions: [".mjs", ".js", ".json", ".node", ".ts"]
        }),
        terser()
    ]
})

export default [
    config(true),
    config(false)
]
