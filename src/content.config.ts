import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Cada archivo .md en src/content/invitaciones = una tarjeta en el catálogo.
// El nombre del archivo es el slug y la demo vive en /demos/<slug>.
const invitaciones = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/invitaciones' }),
  schema: z.object({
    titulo: z.string(),
    evento: z.enum(['boda', 'infantil', 'xv', 'baby-shower', 'cumpleanos', 'otro']),
    plan: z.enum(['basica', 'personalizada', 'premium']),
    precio: z.number().int().positive(),
    descripcion: z.string(),
    // [fondo, acento] para la miniatura generada y la demo genérica
    colores: z.array(z.string()).min(2).default(['#0a0a0a', '#d4b97f']),
    // Ruta a una captura real en /public (ej: "/capturas/boda-elegante.webp")
    imagen: z.string().optional(),
    destacado: z.boolean().default(false),
    // true = tienes una página propia en src/pages/demos/<slug>.astro
    demoPropia: z.boolean().default(false),
    orden: z.number().default(99),
    caracteristicas: z.array(z.string()).default([]),
  }),
});

export const collections = { invitaciones };
