// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
	// GitHub Pages sirve este proyecto en https://silencez0.github.io/devlog/
	site: 'https://silencez0.github.io',
	base: '/devlog',

	trailingSlash: 'ignore',

	integrations: [mdx(), pagefind()],

	markdown: {
		shikiConfig: {
			themes: { light: 'github-light', dark: 'github-dark' },
			wrap: true,
		},
	},
});
