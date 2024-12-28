// https://prettier.io/docs/en/options.html
module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  importOrder: [
    "^react$",
    "<THIRD_PARTY_MODULES>",
    "^@/components/primitives/(.*)$",
    "^@/components/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};
