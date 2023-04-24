module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    'plugin:vue/essential'
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    // BASE JS
    'no-console': 'off',
    quotes: [
      'error',
      'single'
    ],
    'array-bracket-spacing': [
      'error',
      'never'
    ],
    'array-element-newline': [
      'error',
      {
        ArrayExpression: 'consistent',
        ArrayPattern: {
          minItems: 3
        }
      }
    ],
    'object-curly-spacing': [
      'error',
      'always'
    ],
    // пробел в объекте от скобок
    'jsx-quotes': [
      'error',
      'prefer-double'
    ],
    // VUE
    'vue/block-tag-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always',
        maxEmptyLines: 1
      }
    ],
    // открывающий и закрывающий теги в одной строке, если содержимое в одну строку
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
        registeredComponentsOnly: false,
        ignores: [
          'ext-multiselect',
          'nuxt-link'
        ]
      }
    ],
    'vue/custom-event-name-casing': [
      'error',
      'kebab-case'
    ],
    'vue/prop-name-casing': [
      'error',
      'camelCase'
    ],
    'vue/html-comment-content-newline': [
      'error',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    'vue/html-comment-content-spacing': [
      'error',
      'always'
    ],
    'vue/match-component-file-name': [
      'error',
      {
        extensions: [
          'jsx'
        ],
        shouldMatchCase: false
      }
    ],
    'vue/no-empty-component-block': [
      'error'
    ],
    'vue/no-multiple-objects-in-class': [
      'error'
    ],
    'vue/no-restricted-props': [
      'error',
      'value'
    ],
    // запрещает называть свойстав с указанными именами
    'vue/no-static-inline-styles': [
      'error'
    ],
    'vue/html-closing-bracket-spacing': [
      'error',
      {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never'
      }
    ],
    'vue/v-on-event-hyphenation': [
      'error',
      'always',
      {
        autofix: true
      }
    ]
  }
}
