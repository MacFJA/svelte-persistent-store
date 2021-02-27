import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import typescript from "@rollup/plugin-typescript";
import autoPreprocess from 'svelte-preprocess';

export default {
    input: 'tests/src/App.svelte',
    output: [
        { file: 'tests/build/app.js', 'format': 'iife', name: 'app' }
    ],
    plugins: [
        svelte({
            preprocess: autoPreprocess()
        }),
        typescript(),
        resolve()
    ]
};