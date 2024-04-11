module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'unicorn/prefer-top-level-await': 'off',
    '@typescript-eslint/return-await': ['error', 'always'],
  },
};
