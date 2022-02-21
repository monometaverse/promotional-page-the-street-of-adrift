module.exports = {
    root: true,
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
        'no-trailing-spaces': 'error'
    }
}
