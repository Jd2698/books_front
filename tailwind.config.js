/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		extend: {
			colors: {
				'custom-nav': '#3b413b',
				'custom-body': '#e7ddc8',
				'custom-nav-items': '#e99e4b',
				'custom-buttons-yellow': '#d17e33',
				'custom-buttons-yellow-focus': '#e18a3b',
				'custom-button-red': '#6f2c2f',
				'custom-button-red-focus': '#9e3a3f'
			}
		}
	},
	plugins: []
}
