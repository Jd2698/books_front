/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		extend: {
			colors: {
				'custom-nav': '#fff',
				'custom-body': '#fafafa',
				'custom-main-color': '#c1a267',
				'custom-main-color-focus': '#ab8e57',
				'custom-button-red': '#b54147',
				'custom-button-red-focus': '#d8464d'
			}
		}
	},
	plugins: []
}
