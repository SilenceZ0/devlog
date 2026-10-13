#!/usr/bin/env node
/**
 * Crea una entrada nueva del devlog con la plantilla rellena.
 *
 *   npm run nuevo "Título de la entrada"
 *
 * Genera src/content/devlog/<fecha>-<slug>/index.md
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const titulo = process.argv.slice(2).join(' ').trim();

if (!titulo) {
	console.error('Uso: npm run nuevo "Título de la entrada"');
	process.exit(1);
}

const slugificar = (texto) =>
	texto
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

const hoy = new Date().toISOString().slice(0, 10);
const slug = `${hoy}-${slugificar(titulo)}`;
const carpeta = resolve('src/content/devlog', slug);

if (existsSync(carpeta)) {
	console.error(`✖ Ya existe la entrada: src/content/devlog/${slug}`);
	process.exit(1);
}

mkdirSync(carpeta, { recursive: true });

const plantilla = `---
titulo: '${titulo.replace(/'/g, "\\'")}'
resumen: 'Una frase que resuma la entrada.'
fecha: ${hoy}
categoria: devlog # devlog | concept-art | tecnico | diseno | produccion
tags: []
# portada: './portada.png'
# portadaAlt: 'Qué se ve en la portada'
# galeria:
#   - src: './imagen-1.png'
#     alt: 'Qué se ve en la imagen'
# video: 'ID_DE_YOUTUBE'
# videoTitulo: 'Título del vídeo'
estado: prototipo # idea | prototipo | vertical-slice | produccion | lanzado
destacado: false
borrador: true # ponlo en false cuando quieras publicarla
---

Escribe aquí la entrada en **Markdown**.

> Copia las imágenes a esta misma carpeta y referéncialas de forma relativa.

## Primer apartado

![Descripción de la imagen](./imagen.png)
`;

const archivo = `${resolve(carpeta, 'index.md')}`;
writeFileSync(archivo, plantilla, 'utf8');

console.log(`✔ Entrada creada: src/content/devlog/${slug}/index.md`);
console.log('  Recuerda: "borrador: true" hace que no se publique todavía.');

// Intenta abrirla en el editor con el que estés trabajando; si no existe, no pasa nada.
try {
	const hijo = spawn('code', ['-g', archivo], { stdio: 'ignore', detached: true, shell: true });
	hijo.on('error', () => {});
	hijo.unref();
} catch {
	/* sin editor disponible */
}
