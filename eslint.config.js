import tseslint from "typescript-eslint";
import tsparser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    extends: ["plugin:@typescript-eslint/recommended"],

    files: ["**/*.{ts,tsx,js}"],

    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ["*.js"],
        },
      },
    },

    plugins: {
      react,
      "@typescript-eslint": tseslint.plugin,
      "@stylistic": stylistic,
    },

    env: {
      browser: true,
      jest: true,
    },

    rules: {
      "no-param-reassign": "off",
      "@import/no-unresolved": "off",
      "@typescript-eslint/camelcase": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "no-public",
        },
      ],
      "@typescript-eslint/indent": ["error", 4],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            String: {
              message: "Use string instead",
              fixWith: "string",
            },
            "{}": false,
          },
        },
      ],
      "react/jsx-one-expression-per-line": "off",
      "comma-dangle": "off",
      indent: "off",
      "jsdoc/require-param": "off",
      "no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "_",
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "_",
        },
      ],
      "object-curly-newline": [
        "error",
        {
          ObjectExpression: {
            minProperties: 6,
            multiline: true,
            consistent: true,
          },
          ObjectPattern: {
            minProperties: 6,
            multiline: true,
            consistent: true,
          },
          ImportDeclaration: {
            minProperties: 6,
            multiline: true,
            consistent: true,
          },
          ExportDeclaration: {
            minProperties: 6,
            multiline: true,
            consistent: true,
          },
        },
      ],
      "react/destructuring-assignment": "off",
      "react/prop-types": "off",
      "valid-jsdoc": "off",
      "import/prefer-default-export": "off",
      "jsdoc/require-description-complete-sentence": "off",
    },
  },
]);
