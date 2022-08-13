import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import sucrase from "@rollup/plugin-sucrase"
import svelte from "rollup-plugin-svelte"
import autoPreprocess from "svelte-preprocess"

export default {
    input: "tests/src/App.svelte",
    output: [
        { file: "tests/build/app.js", "format": "iife", name: "app" }
    ],
    plugins: [
        svelte({
            preprocess: autoPreprocess()
        }),
        sucrase({
            exclude: ["dist/*"],
            include: ["src/*"],
            transforms: ["typescript"],
            disableESTransforms: true
        }),
        commonjs({ignore: ["crypto", "util"]}),
        resolve({
            extensions: [".mjs", ".js", ".json", ".node", ".ts"]
        })
    ]
}
