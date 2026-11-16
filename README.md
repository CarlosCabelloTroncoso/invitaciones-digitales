# Lumière · Invitaciones digitales

Landing / portfolio para vender invitaciones digitales en Chile.
Stack: **Astro 7 + Tailwind CSS 4 + React 19 (islas) + Motion**.

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist (listo para Vercel o Netlify)
npm run preview
```

## Dónde editar

| Qué | Archivo |
|---|---|
| Nombre, WhatsApp, correo, Instagram | `src/config.ts` |
| Colores y tipografías | `src/styles/global.css` (bloque `@theme`) |
| Catálogo (1 archivo = 1 invitación) | `src/content/invitaciones/*.md` |
| Planes y precios | `src/components/Planes.astro` |
| Preguntas frecuentes | `src/components/FAQ.tsx` |
| Testimonios | `src/components/Testimonios.astro` |

## Agregar una invitación nueva

1. Crea `src/content/invitaciones/mi-diseno.md` (copia uno existente).
2. Al tiro aparece en el catálogo y en `/demos/mi-diseno` con una demo genérica.
3. Cuando programes la demo real, crea `src/pages/demos/mi-diseno.astro`
   (usa `boda-elegante.astro` de plantilla) y pon `demoPropia: true` en el `.md`.
4. Opcional: guarda una captura en `public/capturas/mi-diseno.webp` y agrega
   `imagen: /capturas/mi-diseno.webp` para reemplazar la miniatura generada.

## Deploy

Sube el repo a GitHub → importa en Vercel o Netlify → listo (detectan Astro solos).
