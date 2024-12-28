import js from "@eslint/js";

export default [
  {
    ...js.configs.recommended,
    files: ["src/**/*.(j|t)sx?"],
  },
  {
    files: ["src/**/*.(j|t)sx?"],
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
    },
  },
];
