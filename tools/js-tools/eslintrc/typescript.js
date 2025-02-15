module.exports = {
	extends: [ './preload', 'plugin:@typescript-eslint/recommended' ],
	plugins: [ '@typescript-eslint' ],
	rules: {
		// This produces false positives with TypeScript types
		'no-duplicate-imports': 'off',

		// This rule is not recommended for TypeScript projects. According to
		// the Typescript-eslint FAQ, TypeScript handles this rule itself at
		// compile-time and does a better job than eslint can.
		// Ref: https://github.com/typescript-eslint/typescript-eslint/blob/main/docs/linting/TROUBLESHOOTING.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
		'no-undef': 'off',

		'@typescript-eslint/no-unused-vars': [ 'warn', { argsIgnorePattern: '^_' } ],

		'@typescript-eslint/no-empty-object-type': [
			'error',
			{ allowInterfaces: 'with-single-extends' },
		],
	},
	overrides: [
		{
			files: [ '*.cjs' ],
			rules: {
				// cjs files need to use require imports.
				'@typescript-eslint/no-require-imports': 'off',
			},
		},
	],
};
