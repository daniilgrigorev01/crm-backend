module.exports = {
  extends: ['love', 'plugin:unicorn/recommended', 'prettier'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'unicorn/prefer-top-level-await': 'off',
  },
};
