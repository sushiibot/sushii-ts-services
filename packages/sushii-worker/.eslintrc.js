module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb-base",
    'airbnb-typescript/base',
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: './../../tsconfig.json'
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "quotes": ["error", "double", { "avoidEscape": true }],
    "consistent-return": "off",
    "default-case": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "no-bitwise": "off",
    "class-methods-use-this": "off",
    "no-restricted-syntax": "off",
    "no-continue": "off",
    "no-constant-condition": [
      "warn",
      {
        "checkLoops": false
      },
    ],
    "no-multi-str": "off",
    "import/prefer-default-export": "off",
    "no-await-in-loop": "warn"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"]
      }
    },
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "js": "never",
        "jsx": "never",
        "ts": "never",
        "tsx": "never"
      }
    ],
  },
};
