// const { defineConfig } = require('eslint-define-config');
// module.exports = defineConfig({
//   root: true,
//   // 设置我们的运行环境为浏览器 + es2021 + node ,否则eslint在遇到 Promise，window等全局对象时会报错
//   env: {
//     browser: true,
//     es2021: true,
//     node: true,
//     // 开启setup语法糖环境
//     'vue/setup-compiler-macros': true,
//   },
//   // 新增，解析vue文件
//   parser: 'vue-eslint-parser',
//   // 继承eslint推荐的规则集，vue基本的规则集，typescript的规则集
//   extends: [
//     'eslint:recommended',
//     'plugin:eslint-comments/recommended',
//     'plugin:vue/vue3-recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:prettier/recommended',
//     'prettier',
//     // './.eslintrc-auto-import.json',
//   ],
//   // 支持ts的最新语法
//   parserOptions: {
//     ecmaVersion: 'latest',
//     parser: '@typescript-eslint/parser',
//     sourceType: 'module',
//   },
//   // 添加vue和@typescript-eslint插件，增强eslint的能力
//   plugins: ['vue', '@typescript-eslint', 'prettier'],
//   rules: {
//     // js/ts
//     camelcase: ['error', { properties: 'never' }],
//     'no-console': 'error',
//     'no-debugger': 'error',
//     'no-constant-condition': ['error', { checkLoops: false }],
//     'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
//     'no-return-await': 'error',
//     'no-var': 'error',
//     'no-empty': ['error', { allowEmptyCatch: true }],
//     'prefer-const': [
//       'warn',
//       { destructuring: 'all', ignoreReadBeforeAssign: true },
//     ],
//     'prefer-arrow-callback': [
//       'error',
//       { allowNamedFunctions: false, allowUnboundThis: true },
//     ],
//     'object-shorthand': [
//       'error',
//       'always',
//       { ignoreConstructors: false, avoidQuotes: true },
//     ],
//     'prefer-rest-params': 'error',
//     'prefer-spread': 'error',
//     'prefer-template': 'error',

//     'no-redeclare': 'off',
//     '@typescript-eslint/no-redeclare': 'off',
//     // best-practice
//     'array-callback-return': 'error',
//     'block-scoped-var': 'error',
//     'no-alert': 'warn',
//     'no-case-declarations': 'error',
//     'no-multi-str': 'error',
//     'no-with': 'error',
//     'no-void': 'error',
//     'sort-imports': [
//       'warn',
//       {
//         ignoreCase: false,
//         ignoreDeclarationSort: true,
//         ignoreMemberSort: false,
//         memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
//         allowSeparatedGroups: false,
//       },
//     ],

//     // stylistic-issues
//     'prefer-exponentiation-operator': 'error',
//     // ts
//     '@typescript-eslint/explicit-module-boundary-types': 'off',
//     '@typescript-eslint/no-explicit-any': 'off',
//     '@typescript-eslint/no-non-null-assertion': 'off',
//     '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
//     '@typescript-eslint/consistent-type-imports': [
//       'error',
//       { disallowTypeAnnotations: false },
//     ],
//     '@typescript-eslint/no-var-requires': 'off',

//     // vue
//     'vue/no-v-html': 'off',
//     'vue/require-default-prop': 'off',
//     'vue/require-explicit-emits': 'off',
//     'vue/multi-word-component-names': 'off',
//     'vue/html-self-closing': [
//       'error',
//       {
//         html: {
//           void: 'always',
//           normal: 'always',
//           component: 'always',
//         },
//         svg: 'always',
//         math: 'always',
//       },
//     ],
//     // prettier
//     'prettier/prettier': 'off',
//     // import
//     // 'import/first': 'error',
//     // 'import/no-duplicates': 'error',
//     // 'import/no-unresolved': 'off',
//     // 'import/namespace': 'off',
//     // 'import/default': 'off',
//     'import/no-named-as-default': 'off',
//     'import/no-named-as-default-member': 'off',
//     'import/named': 'off',
//     'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
//   },
// });

// @ts-check
const { defineConfig } = require("eslint-define-config");
module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2020,
    sourceType: "module",
    jsxPragma: "React",
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:jest/recommended"
  ],
  plugins: ["unused-imports"],
  rules: {
    "space-before-function-paren": "off",
    "no-use-before-define": "off",
    // :====================: no-unused-vars 暂时没有完善的 fix 方案暂时关闭 :====================:
    // "@typescript-eslint/no-unused-vars": [
    //   "error",
    //   {
    //     argsIgnorePattern: "^_",
    //     varsIgnorePattern: "^_"
    //   }
    // ],
    // "no-unused-vars": [
    //   "error",
    //   {
    //     argsIgnorePattern: "^_",
    //     varsIgnorePattern: "^_"
    //   }
    // ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "vue/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "vue/no-unused-components": "warn",
    // :====================: no-unused-vars 暂时没有完善的 fix 方案暂时关闭 :====================:
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "vue/custom-event-name-casing": "off",
    "vue/script-setup-uses-vars": "error",
    "vue/attributes-order": "off",
    "vue/one-component-per-file": "off",
    "vue/html-closing-bracket-newline": "off",
    "vue/max-attributes-per-line": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/attribute-hyphenation": "off",
    "vue/require-default-prop": "off",
    "vue/multi-word-component-names": "off",
    "vue/v-on-event-hyphenation": "off",
    "vue/html-self-closing": [
      "error",
      {
        html: {
          void: "always",
          normal: "never",
          component: "always"
        },
        svg: "always",
        math: "always"
      }
    ]
  }
});
