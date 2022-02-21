module.exports = {
    root: true,
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'plugin:vue/vue3-strongly-recommended'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    ignorePatterns: [
        'node_modules',
    ],
    rules: {
        'eol-last': 'error',
        'no-trailing-spaces': 'error',
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'never']
    }
}
