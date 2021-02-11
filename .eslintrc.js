module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    es6: true,
    node: true,
    commonjs: true,
  },
  plugins: ["eslint-plugin-prettier", "import"],
  extends: [["prettier", "airbnb-base"]],
  parserOptions: {
    ecmaVersion: 12,
  },
  ecmaFeatures: {
    Jsx: true,
    modules: true,
  },
  ignorePatterns: ["./node_modules/", "./.vscode/", "./log/", "./lib/"],
  rules: {
    "linebreak-style": 0,
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
  },
};
