/* eslint-env node */
module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:unicorn/recommended",
        "plugin:sonarjs/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: "module",
    },
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "never"],
        "import/export": ["error"],
        "import/order": [
            "error",
            {
                "newlines-between": "always",
                alphabetize: { order: "asc", caseInsensitive: true },
            },
        ],
        "import/newline-after-import": ["error"],
        "import/no-absolute-path": ["error"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "import/no-unresolved": ["error", { ignore: ["svelte/store"] }],
        "unicorn/no-null": ["off"],
        "unicorn/no-array-for-each": ["off"],
        "unicorn/switch-case-braces": ["off"],
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".ts"],
            },
        },
        "import/extensions": [".js", ".ts", ".cjs"],
    },
}
