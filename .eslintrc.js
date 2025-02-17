module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
    'vue'
  ],
  extends: [
    'plugin:vue/vue3-strongly-recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  ignorePatterns: [
    'node_modules',
    '*.png',
    'dist',
    'src/assets'
  ],
  rules: {
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'vue/script-indent': ['error', 2, {
      switchCase: 1
    }],
    'vue/multi-word-component-names': 'off',

    // 强制在符号周围添加空格
    'space-infix-ops': ['warn', { int32Hint: false }], // 修复 =, +, -, * 等符号
    'space-before-blocks': 'warn', // 强制在代码块前加空格
    'keyword-spacing': ['warn', { // 强制关键字后的空格
      before: true,
      after: true
    }],
    'space-in-parens': ['warn', 'never'], // 强制括号内无空格
    'object-curly-spacing': ['warn', 'always'], // 强制对象大括号内的空格
    'array-bracket-spacing': ['warn', 'never'], // 强制数组括号内无空格
    'comma-spacing': ['warn', { // 强制逗号后的空格
      before: false,
      after: true
    }],
    'semi-spacing': ['warn', { // 强制分号后的空格
      before: false,
      after: true
    }],
    'arrow-spacing': ['warn', { // 强制箭头函数的箭头前后空格
      before: true,
      after: true
    }],
    'no-multi-spaces': 'warn', // 禁止多余的空格
    'no-trailing-spaces': 'warn', // 禁止行尾空格
    'eol-last': ['warn', 'always'] // 强制文件末尾空行
  }
}
