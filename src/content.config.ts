import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

import { CATEGORIAS, ESTADOS } from './site.config';

/**
 * Entradas del devlog.
 *
 * Cada entrada vive en su propia carpeta:
 *   src/content/devlog/2026-10-13-idea-inicial/index.md
 * y las imágenes se colocan al lado, referenciadas de forma relativa
 * ("./boceto-01.png"). Astro las optimiza automáticamente.
 */
const devlog = defineCollection({
	loader: glob({ base: './src/content/devlog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			titulo: z.string().max(140),
			resumen: z.string().max(320),
			fecha: z.coerce.date(),
			actualizado: z.coerce.date().optional(),
			categoria: z.enum(CATEGORIAS),
			tags: z.array(z.string()).default([]),
			/** Imagen de portada (se usa en listados y cabecera). */
			portada: image().optional(),
			portadaAlt: z.string().optional(),
			/** Imágenes de la galería, con su texto alternativo. */
			galeria: z
				.array(z.object({ src: image(), alt: z.string() }))
				.default([]),
			/** Vídeo de YouTube incrustado arriba del todo (solo el id). */
			video: z.string().optional(),
			videoTitulo: z.string().optional(),
			estado: z.enum(ESTADOS).default('prototipo'),
			destacado: z.boolean().default(false),
			/** Los borradores se ven en local pero no se publican. */
			borrador: z.boolean().default(false),
		}),
});

/**
 * Hitos del proceso creativo, en src/data/hitos.json.
 * Alimentan el timeline y pueden enlazar con una entrada del devlog.
 */
const hitos = defineCollection({
	loader: file('./src/data/hitos.json'),
	schema: z.object({
		id: z.string(),
		fecha: z.coerce.date(),
		titulo: z.string(),
		descripcion: z.string(),
		estado: z.enum(ESTADOS),
		entrada: reference('devlog').optional(),
	}),
});

export const collections = { devlog, hitos };
