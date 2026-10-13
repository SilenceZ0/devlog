/**
 * Configuración general del sitio.
 *
 * Este archivo es el único sitio donde deberías tocar el nombre del proyecto,
 * la descripción o la navegación.
 */

export const SITIO = {
	/** Nombre del videojuego / proyecto. */
	nombre: 'Proj_TheYE',
	/** Título completo que aparece en la pestaña del navegador. */
	titulo: 'Proj_TheYE · Devlog',
	/** Descripción por defecto (meta description). */
	descripcion:
		'Diario de desarrollo de Proj_TheYE: el proceso creativo de un videojuego paso a paso.',
	idioma: 'es',
	/**
	 * El sitio está deliberadamente sin indexar: no hay sitemap y `robots.txt`
	 * bloquea a todos los buscadores.
	 */
	noindex: true,
	/**
	 * Autoría y enlaces a redes: vacíos a propósito, el pie de página los
	 * oculta automáticamente cuando no hay nada que mostrar.
	 */
	autor: '',
	enlaces: [] as { texto: string; url: string }[],
} as const;

export const NAVEGACION: { texto: string; ruta: string }[] = [
	{ texto: 'Inicio', ruta: '/' },
	{ texto: 'Entradas', ruta: '/entradas/' },
	{ texto: 'Timeline', ruta: '/timeline/' },
	{ texto: 'Galería', ruta: '/galeria/' },
	{ texto: 'Categorías', ruta: '/categorias/' },
	{ texto: 'Buscar', ruta: '/buscar/' },
	{ texto: 'Sobre el proyecto', ruta: '/sobre-el-proyecto/' },
];

/* ------------------------------------------------------------------ *
 * Taxonomías
 * ------------------------------------------------------------------ */

export const CATEGORIAS = [
	'devlog',
	'concept-art',
	'tecnico',
	'diseno',
	'produccion',
] as const;

export type CategoriaId = (typeof CATEGORIAS)[number];

export const CATEGORIA_INFO: Record<
	CategoriaId,
	{ etiqueta: string; descripcion: string }
> = {
	devlog: {
		etiqueta: 'Devlog',
		descripcion: 'Avances, decisiones y diario del desarrollo.',
	},
	'concept-art': {
		etiqueta: 'Concept art',
		descripcion: 'Ilustración, personajes, escenarios y referencias visuales.',
	},
	tecnico: {
		etiqueta: 'Técnico',
		descripcion: 'Godot, programación, herramientas y pipelines.',
	},
	diseno: {
		etiqueta: 'Diseño',
		descripcion: 'Mecánicas, sistemas, economía y balance.',
	},
	produccion: {
		etiqueta: 'Producción',
		descripcion: 'Planificación, hitos y estado general del proyecto.',
	},
};

export const ESTADOS = [
	'idea',
	'prototipo',
	'vertical-slice',
	'produccion',
	'lanzado',
] as const;

export type EstadoId = (typeof ESTADOS)[number];

export const ESTADO_INFO: Record<EstadoId, string> = {
	idea: 'Idea',
	prototipo: 'Prototipo',
	'vertical-slice': 'Vertical slice',
	produccion: 'Producción',
	lanzado: 'Lanzado',
};
