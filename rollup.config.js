import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import {terser} from "rollup-plugin-terser"

import pkg from "./package.json"

const name = pkg.name
    .replace(/^(@\S+\/)?(svelte-)?(\S+)/, "$3")
    .replace(/^\w/, m => m.toUpperCase())
    .replace(/-\w/g, m => m[1].toUpperCase())

export default {
    input: "src/index.ts",
    output: [
        { file: pkg.module, "format": "es" },
        { file: pkg.main, "format": "umd", name }
    ],
    plugins: [
        sucrase({
            exclude: ["dist/*"],
            include: ["src/*"],
            transforms: ["typescript"]
        }),
        commonjs({
            ignore: ["crypto", "util"]
        }),
        resolve({
            extensions: [".mjs", ".js", ".json", ".node", ".ts"]
        }),
        terser()
    ]
}
