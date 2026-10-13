# Proj_TheYE · Devlog

Diario de desarrollo de **Proj_TheYE**: el proceso creativo del videojuego, paso a paso.

Sitio estático hecho con [Astro](https://astro.build) y publicado en GitHub Pages en
**https://silencez0.github.io/devlog/**.

> Este sitio está **fuera de los buscadores a propósito**: no hay sitemap, `robots.txt`
> bloquea a todos los agentes y todas las páginas llevan `noindex, nofollow`.

---

## Escribir una entrada

### 1. Crear el archivo

```bash
npm run nuevo "Título de la entrada"
```

Esto crea `src/content/devlog/<fecha>-<slug>/index.md` con la plantilla rellena.
La entrada nace con `borrador: true`, así que **no se publica** hasta que lo cambies
a `false`.

### 2. Rellenar el front matter

```yaml
---
titulo: 'Título de la entrada'
resumen: 'Una frase que resuma la entrada.'   # se usa en listados y en el RSS
fecha: 2026-10-13
categoria: devlog        # ver tabla de categorías abajo
tags: ['diseño', 'godot']
portada: './portada.png'                      # opcional
portadaAlt: 'Qué se ve en la portada'
galeria:                                       # opcional
  - src: './boceto.png'
    alt: 'Descripción de la imagen'
video: 'ID_DE_YOUTUBE'                         # opcional
videoTitulo: 'Título del vídeo'
estado: prototipo        # idea | prototipo | vertical-slice | produccion | lanzado
destacado: false
borrador: false          # ← imprescindible para publicar
---
```

### 3. Escribir el cuerpo en Markdown

Markdown normal. Las imágenes que dejes **en la misma carpeta** de la entrada se
referencian de forma relativa y Astro las optimiza sola (WebP, varios tamaños, lazy load):

```markdown
![Descripción de la imagen](./boceto.png)
```

### 4. Publicar

```bash
git add .
git commit -m "Nueva entrada: título"
git push
```

GitHub Actions construye y publica el sitio en un par de minutos. No hace falta
compilar en local.

---

## Estructura

```
src/
├─ content/devlog/          Las entradas (una carpeta por entrada)
│  └─ 2026-10-13-mi-entrada/
│     ├─ index.md           El texto
│     └─ imagenes...
├─ data/hitos.json          Los hitos del timeline
├─ content.config.ts        Esquema y validación del contenido
├─ site.config.ts           Nombre, descripción y navegación del sitio
├─ components/              PostCard, Gallery, VideoEmbed, Timeline…
├─ layouts/                 Base (HTML, cabecera, pie) y Entrada
├─ pages/                   Rutas del sitio
└─ styles/global.css        Estilos y colores

scripts/nuevo.mjs           Genera una entrada nueva
.github/workflows/deploy.yml Publica en GitHub Pages
```

### Rutas del sitio

| Ruta | Qué es |
| --- | --- |
| `/` | Portada: últimas entradas, timeline breve y categorías |
| `/entradas/` | Listado completo agrupado por año |
| `/<anio-mes-dia-slug>/` | Una entrada |
| `/timeline/` | Timeline completo del proceso creativo |
| `/galeria/` | Todas las imágenes del proyecto |
| `/categorias/` | Categorías |
| `/tags/` | Etiquetas |
| `/buscar/` | Buscador (Pagefind, funciona sin servidor) |
| `/sobre-el-proyecto/` | Página editable con la info del proyecto |
| `/rss.xml` | Feed RSS |

---

## Categorías

Cada entrada pertenece a **una** categoría, definida en `src/site.config.ts`:

| id | Etiqueta | Para qué |
| --- | --- | --- |
| `devlog` | Devlog | Avances y diario del desarrollo |
| `concept-art` | Concept art | Ilustración, personajes, escenarios |
| `tecnico` | Técnico | Godot, programación, herramientas |
| `diseno` | Diseño | Mecánicas, sistemas, balance |
| `produccion` | Producción | Planificación y estado del proyecto |

Para añadir una categoría: edita `CATEGORIAS` y `CATEGORIA_INFO` en `src/site.config.ts`.
Si te equivocas al escribir una categoría en una entrada, **el build falla y te avisa**
en vez de publicar algo roto.

## Timeline

Los hitos viven en `src/data/hitos.json`:

```json
{
  "id": "prototipo-movimiento",
  "fecha": "2026-10-08",
  "titulo": "Prototipo de movimiento",
  "descripcion": "El personaje se mueve y la cámara lo sigue.",
  "estado": "prototipo",
  "entrada": "2026-10-13-idea-inicial"
}
```

El campo `entrada` es opcional y debe coincidir con el nombre de la carpeta de una
entrada (el `id`), para que el hito enlace a ella.

## Vídeo

En el front matter, con el id de YouTube:

```yaml
video: 'dQw4w9WgXcQ'
videoTitulo: 'Gameplay del prototipo'
```

Es una *fachada perezosa*: **no se contacta con YouTube hasta que el visitante pulsa
play**. Para insertar varios vídeos dentro del texto, renombra la entrada a
`index.mdx` y usa el componente:

```mdx
<VideoEmbed id="dQw4w9WgXcQ" titulo="Gameplay" />
```

## Imágenes

- Guárdalas en la carpeta de la entrada y referéncialas con `./`.
- Astro las convierte a WebP y genera varios tamaños automáticamente.
- Para animaciones, mejor MP4/WebM corto que GIF: un GIF de 5 s puede pesar 10 MB
  y su equivalente WebM unos 300 KB.
- Evita meter PNGs de muchísimos MB al repositorio; si hiciera falta, se puede pasar
  a Git LFS.

---

## Desarrollo en local

```bash
npm install
npm run dev        # http://localhost:4321/devlog/
npm run build      # comprueba que todo compila
npm run preview    # sirve dist/
```

> Nota: el buscador funciona en la versión publicada, pero en `npm run dev` puede no
> encontrar nada porque el índice de Pagefind solo se genera al compilar.

## Despliegue

Automático en cada `push` a `main` mediante `.github/workflows/deploy.yml`.

Si algún día quieres un dominio propio: añade `public/CNAME` con el dominio y cambia
`site`/`base` en `astro.config.mjs` (quita `base`).

## Aviso sobre la ruta del proyecto

Este proyecto **no puede vivir en una ruta que contenga `#`** (por ejemplo
`D:\### CLOUD\...`): Vite, el motor de Astro, no sabe resolver esas rutas y el build
falla con `Invalid URL`. Por eso el repositorio está en `D:\GITHUB\devlog`.

## Quitar el modo invisible

Si algún día quieres que el sitio aparezca en buscadores:

1. Pon `noindex: false` en `src/site.config.ts`.
2. Vacía o borra `public/robots.txt`.
3. Añade `@astrojs/sitemap` a las integraciones de `astro.config.mjs`.
