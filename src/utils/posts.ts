import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import type { CategoriaId, EstadoId } from '../site.config';
import { url } from './url';

export type Entrada = CollectionEntry<'devlog'>;
export type ImagenGaleria = Entrada['data']['galeria'][number];

/** Todas las entradas publicables, de la más reciente a la más antigua. */
export async function listarEntradas(): Promise<Entrada[]> {
	const entradas = await getCollection('devlog', ({ data }) =>
		import.meta.env.PROD ? !data.borrador : true,
	);
	return entradas.sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf());
}

/** Las entradas viven en la raíz del sitio: /devlog/<anio-mes-dia-slug>/ */
export function enlaceEntrada(entrada: Entrada): string {
	return url(`/${entrada.id}/`);
}

/** Slug estable para tags (sin acentos, sin espacios, en minúsculas). */
export function slugificar(texto: string): string {
	return texto
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

const MESES = [
	'enero',
	'febrero',
	'marzo',
	'abril',
	'mayo',
	'junio',
	'julio',
	'agosto',
	'septiembre',
	'octubre',
	'noviembre',
	'diciembre',
];

export function formatearFecha(fecha: Date): string {
	return `${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]} de ${fecha.getUTCFullYear()}`;
}

export function formatearFechaCorta(fecha: Date): string {
	const dia = String(fecha.getUTCDate()).padStart(2, '0');
	const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
	return `${dia}/${mes}/${fecha.getUTCFullYear()}`;
}

/* ------------------------------------------------------------------ *
 * Agrupaciones para listados y páginas de taxonomía
 * ------------------------------------------------------------------ */

export interface GrupoCategoria {
	id: CategoriaId;
	total: number;
}

export function agruparPorCategoria(entradas: Entrada[]): GrupoCategoria[] {
	const cuenta = new Map<CategoriaId, number>();
	for (const entrada of entradas) {
		cuenta.set(entrada.data.categoria, (cuenta.get(entrada.data.categoria) ?? 0) + 1);
	}
	return [...cuenta.entries()]
		.map(([id, total]) => ({ id, total }))
		.sort((a, b) => b.total - a.total);
}

export interface GrupoTag {
	nombre: string;
	slug: string;
	total: number;
}

export function agruparPorTag(entradas: Entrada[]): GrupoTag[] {
	const cuenta = new Map<string, GrupoTag>();
	for (const entrada of entradas) {
		for (const tag of entrada.data.tags) {
			const slug = slugificar(tag);
			const actual = cuenta.get(slug);
			if (actual) actual.total += 1;
			else cuenta.set(slug, { nombre: tag, slug, total: 1 });
		}
	}
	return [...cuenta.values()].sort(
		(a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, 'es'),
	);
}

/** Agrupa las entradas por año (para el listado completo del devlog). */
export function agruparPorAnio(entradas: Entrada[]): { anio: number; entradas: Entrada[] }[] {
	const grupos = new Map<number, Entrada[]>();
	for (const entrada of entradas) {
		const anio = entrada.data.fecha.getUTCFullYear();
		const lista = grupos.get(anio);
		if (lista) lista.push(entrada);
		else grupos.set(anio, [entrada]);
	}
	return [...grupos.entries()]
		.map(([anio, lista]) => ({ anio, entradas: lista }))
		.sort((a, b) => b.anio - a.anio);
}

/* ------------------------------------------------------------------ *
 * Timeline
 * ------------------------------------------------------------------ */

export interface HitoResuelto {
	id: string;
	fecha: Date;
	titulo: string;
	descripcion: string;
	estado: EstadoId;
	entrada?: { titulo: string; url: string };
}

/** Hitos del proceso creativo, del más antiguo al más reciente. */
export async function listarHitos(): Promise<HitoResuelto[]> {
	const todos = await getCollection('hitos');

	const resueltos = await Promise.all(
		todos.map(async (hito): Promise<HitoResuelto> => {
			const referencia = hito.data.entrada;
			const entrada = referencia ? await getEntry(referencia) : undefined;
			return {
				id: hito.id,
				fecha: hito.data.fecha,
				titulo: hito.data.titulo,
				descripcion: hito.data.descripcion,
				estado: hito.data.estado,
				entrada: entrada
					? { titulo: entrada.data.titulo, url: enlaceEntrada(entrada) }
					: undefined,
			};
		}),
	);

	return resueltos.sort((a, b) => a.fecha.valueOf() - b.fecha.valueOf());
}

/* ------------------------------------------------------------------ *
 * Galería global
 * ------------------------------------------------------------------ */

export interface ImagenGlobal {
	src: ImagenGaleria['src'];
	alt: string;
	entrada: { titulo: string; url: string };
	fecha: Date;
}

/** Todas las imágenes de galería de todas las entradas, de nuevas a viejas. */
export function recopilarGaleria(entradas: Entrada[]): ImagenGlobal[] {
	return entradas.flatMap((entrada) =>
		entrada.data.galeria.map((imagen) => ({
			src: imagen.src,
			alt: imagen.alt,
			entrada: { titulo: entrada.data.titulo, url: enlaceEntrada(entrada) },
			fecha: entrada.data.fecha,
		})),
	);
}
