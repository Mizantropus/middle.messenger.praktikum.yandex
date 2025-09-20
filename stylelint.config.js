export default {

  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss'],

  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9_-]+$',
    'scss/dollar-variable-pattern': '^[_]?[a-z][a-zA-Z0-9-]*$',
    'block-no-empty': true,
  },
  ignoreFiles: ['**/*.js', '**/*.ts'],
};
