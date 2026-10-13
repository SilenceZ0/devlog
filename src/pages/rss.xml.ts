import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

import { SITIO } from '../site.config';
import { enlaceEntrada, listarEntradas } from '../utils/posts';

export async function GET(contexto: APIContext) {
	const entradas = await listarEntradas();

	// El sitio vive en una subruta (/devlog): `contexto.site` apunta a la raíz
	// del dominio, así que hay que añadirle el `base` para el enlace del canal.
	const origen = contexto.site ?? new URL('https://silencez0.github.io');
	const sitio = new URL(import.meta.env.BASE_URL, origen).href;

	return rss({
		title: SITIO.titulo,
		description: SITIO.descripcion,
		site: sitio,
		items: entradas.map((entrada) => ({
			title: entrada.data.titulo,
			description: entrada.data.resumen,
			pubDate: entrada.data.fecha,
			link: enlaceEntrada(entrada),
		})),
		customData: `<language>${SITIO.idioma}</language>`,
	});
}
