/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,ts}'],
	theme: {
		extend: {
			colors: {
				'custom-nav': '#3b413b',
				'custom-body': '#e7ddc8',
				'custom-nav-items': '#e99e4b',
				'custom-buttons-yellow': '#df8927'
			}
		}
	},
	plugins: []
}
