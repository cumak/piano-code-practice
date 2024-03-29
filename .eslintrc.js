module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { project: "./tsconfig.json" },
  plugins: ["simple-import-sort", "import-access"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "info", "error"] }],
    "no-restricted-syntax": ["error", { selector: "TSEnumDeclaration", message: "Don't declare enums" }],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "arrow-body-style": ["error", "always"],
    // "no-restricted-imports": [
    //   "error",
    //   { paths: [{ name: "react", importNames: ["default"] }] },
    // ],
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/display-name": "error",
    "react/jsx-handler-names": "off",
    "react/destructuring-assignment": ["error", "always"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "off",
    "import/newline-after-import": "error",
    "import/no-default-export": "error",
    "import/no-duplicates": "error",
    "import-access/jsdoc": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    "@typescript-eslint/naming-convention": [
      "warn",
      { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
      // { selector: ["property", "method"], format: ["camelCase"] },
      {
        selector: "variable",
        types: ["boolean"],
        format: ["PascalCase"],
        prefix: ["no", "is", "has", "should"],
        filter: { regex: "^_", match: false },
      },
    ],
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
  },
  overrides: [
    {
      files: ["pages/index.tsx", "pages/**/*/*.tsx", "pages/_app.tsx", "pages/_document.tsx"],
      rules: {
        "import/no-default-export": "off",
        "@typescript-eslint/naming-convention": [
          "warn",
          { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
          {
            selector: ["classProperty", "typeProperty", "method"],
            format: ["camelCase"],
          },
          {
            selector: "variable",
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "has", "should"],
          },
        ],
      },
    },
    {
      files: ["src/stories/**/*.stories.tsx"],
      rules: {
        "import/no-default-export": "off",
      },
    },
    {
      files: ["src/type/**/*.d.ts"],
      rules: {
        "@typescript-eslint/naming-convention": [
          "warn",
          { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
          { selector: ["classProperty", "method"], format: ["camelCase"] },
          {
            selector: "variable",
            types: ["boolean"],
            format: ["PascalCase"],
            prefix: ["is", "has", "should"],
          },
        ],
      },
    },
  ],
};
