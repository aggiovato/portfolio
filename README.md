# aggiovato — portfolio

Portfolio personal de Alejandro Lugo. Especificación completa en [`docs/especificacion.md`](docs/especificacion.md);
referencias visuales en `docs/referencias/`.

**Stack:** Astro 7 · TypeScript estricto · Content Collections + Markdoc · CSS con tokens · salida estática.

## Requisitos

Node **≥ 22.23.4** (Astro 7). El proyecto fija Node 24 en `.nvmrc`:

```sh
nvm use
npm install
npm run dev        # http://localhost:4321 — muestra también los borradores
npm run check      # astro check (tipos + esquemas de contenido)
npm test           # tests unitarios y de componentes (Vitest)
npm run test:e2e   # Playwright sobre un build de producción (smoke, i18n, axe)
npm run build      # sólo proyectos publicados
```

`task preflight` ejecuta todo en el mismo orden que la CI (`.github/workflows/ci.yml`).

## Estructura

| Ubicación                                    | Contenido                                                                    |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `src/pages/[...locale]/`                     | `/`, `/work/`, `/work/[slug]/`, `/about/`, `/contact/` en cada idioma        |
| `src/pages/404.astro`                        | Página 404 única (idioma por defecto)                                        |
| `src/layouts/BaseLayout.astro`               | `<head>`, SEO/OG, `hreflang`, skip link, header y footer                     |
| `src/components/`                            | Componentes `.astro` (hero, carrusel, tarjetas, tags de Markdoc…)            |
| `src/i18n/`                                  | Idiomas, diccionarios de interfaz (`ui/en.ts`, `ui/es.ts`) y helpers         |
| `src/content.config.ts`                      | Contrato de `Project` (§12) con validación de publicación                    |
| `src/content/projects/<idioma>/`             | Casos de estudio (Markdoc), mismo nombre de archivo y `slug` en cada idioma  |
| `src/lib/content/`                           | **Filtro único de visibilidad** (borradores), consultas y lógica pura        |
| `src/data/site.ts`                           | Datos globales independientes del idioma: nombre, email, enlaces, navegación |
| `src/styles/tokens.css`                      | Paleta, tipografía, espaciado (§5–6)                                         |
| `tests/unit`, `tests/component`, `tests/e2e` | Capas de tests (ver `.claude/rules/testing.md`)                              |
| `.claude/`                                   | Rules, skills y agente para Claude Code                                      |

## Idiomas

Inglés por defecto sin prefijo (`/work/`) y español bajo `/es/` (`/es/work/`), con el enrutado i18n
de Astro y generación estática. Los textos de interfaz viven en `src/i18n/ui/`; los casos de estudio,
en una carpeta por idioma. Un caso sin traducir no genera página en `/es/`: el listado enlaza al
original marcado «En inglés». Detalles en `.claude/rules/i18n.md`.

## Añadir un proyecto

1. Crear `src/content/projects/en/<id>.mdoc` copiando uno existente (y, si se traduce,
   `src/content/projects/es/<id>.mdoc` con el mismo nombre y `slug`).
2. Rellenar el frontmatter; `publicationStatus: draft` mientras se escribe.
3. Para publicar: `publicationStatus: published`, `publishedAt` y `cover` (imagen en `src/assets/` + `alt`)
   en cada idioma. El build falla si faltan, si hay slugs duplicados o si una traducción no tiene original.

No hay que tocar componentes ni rutas.

## Borradores

En `npm run dev` se muestran con la marca «Draft». En `npm run build` no generan ruta, ni aparecen en listados
ni en el sitemap (`npm run verify:drafts` lo comprueba en todos los idiomas).
Recuerda que un borrador en un repo público sigue siendo visible en Git.

## Imágenes provisionales (sólo en local)

`docs/referencias/` (mockup y design system del logo) y `src/assets/projects/` (capturas de ejemplo de los
casos de estudio) están en `.gitignore` hasta tener las imágenes definitivas. Júpiter y el logo sí se versionan. En un clon nuevo o en la CI, `npm run assets:placeholders` genera placeholders
neutros para las imágenes referenciadas que falten (nunca sobrescribe las existentes). Cuando una imagen
sea definitiva, quita su carpeta del `.gitignore` y súbela.

## Pendiente de assets (provisional en el código)

- **Logo vectorizado** → sustituir el SVG de `src/components/LogoMark.astro` y `public/favicon.svg` (mantener `currentColor`).
  Revisar el favicon a 16/24/32/48 px.
- **Júpiter** ✅ `src/assets/hero/jupiter.png` (disco limpiado con máscara circular y volteado; ver cabecera de
  `JupiterScene.astro`). Para pantallas retina grandes convendría un original de ~2200 px.
- **Capturas de proyectos** → `cover` en cada `.mdoc`.
- **Datos reales** → email, GitHub, LinkedIn y dominio (`src/data/site.ts`, `astro.config.mjs`).
- **Textos** marcados con `TODO` (home «How I work», about, casos de estudio).

## Próximas fases (§20)

- Fase 3: Keystatic (local primero) sobre la misma colección.
- OG images por proyecto.
