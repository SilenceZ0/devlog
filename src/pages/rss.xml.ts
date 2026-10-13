import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { SITIO } from '../site.config';
import { enlaceEntrada, listarEntradas } from '../utils/posts';

export async function GET(contexto: APIContext) {
	const entradas = await listarEntradas();

	return rss({
		title: SITIO.titulo,
		description: SITIO.descripcion,
		site: contexto.site ?? 'https://silencez0.github.io',
		items: entradas.map((entrada) => ({
			title: entrada.data.titulo,
			description: entrada.data.resumen,
			pubDate: entrada.data.fecha,
			link: enlaceEntrada(entrada),
		})),
		customData: `<language>${SITIO.idioma}</language>`,
	});
}
