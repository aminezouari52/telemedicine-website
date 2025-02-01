import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["src/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },
  { languageOptions: { globals: { ...globals.commonjs, ...globals.node } } },
  pluginJs.configs.recommended,
];
