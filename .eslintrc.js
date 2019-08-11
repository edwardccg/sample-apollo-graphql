module.exports = {
  // root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'airbnb-base', // Airbnb's base JS .eslintrc (without React plugins)
    'plugin:prettier/recommended' // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 120,
        singleQuote: true
      }
    ]
  }
}
