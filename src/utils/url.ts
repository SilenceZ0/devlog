/**
 * GitHub Pages publica este proyecto en una subruta (/devlog), así que
 * ningún enlace interno puede escribirse "a pelo": todos pasan por `url()`.
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
	? import.meta.env.BASE_URL
	: `${import.meta.env.BASE_URL}/`;

/** Devuelve una ruta absoluta teniendo en cuenta el `base` del sitio. */
export function url(ruta = ''): string {
	const limpia = ruta.replace(/^\/+/, '');
	return limpia ? `${BASE}${limpia}` : BASE;
}

/** ¿La ruta actual corresponde a este enlace? (para marcar el menú). */
export function esActiva(actual: string, ruta: string): boolean {
	const objetivo = url(ruta);
	if (ruta === '/') return actual === objetivo || actual === BASE;
	return actual.startsWith(objetivo);
}
