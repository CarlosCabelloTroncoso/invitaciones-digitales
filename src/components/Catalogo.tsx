import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export type Item = {
  slug: string;
  titulo: string;
  evento: string;
  plan: 'basica' | 'personalizada' | 'premium';
  precio: number;
  descripcion: string;
  colores: string[];
  destacado: boolean;
  caracteristicas: string[];
  imagen?: string;
};

const EVENTOS: Record<string, string> = {
  todos: 'Todos',
  boda: 'Bodas',
  xv: 'XV años',
  'baby-shower': 'Baby shower',
  cumpleanos: 'Cumpleaños',
};

const PLANES: Record<string, string> = {
  basica: 'Básica',
  personalizada: 'Personalizada',
  premium: 'Premium',
};

const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

export default function Catalogo({ items, whatsapp }: { items: Item[]; whatsapp: string }) {
  const [evento, setEvento] = useState('todos');
  const [index, setIndex] = useState(0);
  const [activo, setActivo] = useState<Item | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const eventosDisponibles = useMemo(
    () => ['todos', ...Array.from(new Set(items.map((i) => i.evento)))],
    [items]
  );

  const filtrados = useMemo(
    () => items.filter((i) => evento === 'todos' || i.evento === evento),
    [items, evento]
  );

  useEffect(() => {
    setIndex(0);
    trackRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, [evento]);

  useEffect(() => {
    if (!activo) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivo(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [activo]);

  const scrollToSlide = (target: number) => {
    const el = trackRef.current;
    if (!el || filtrados.length === 0) return;
    const clamped = Math.max(0, Math.min(target, filtrados.length - 1));
    const card = el.children[clamped] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
    setIndex(clamped);
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    let closest = 0;
    let minDiff = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const htmlChild = child as HTMLElement;
      const diff = Math.abs(htmlChild.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setIndex(closest);
  };

  const wa = (i: Item) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, quiero encargar el diseño "${i.titulo}" (${clp(i.precio)})`)}`;

  return (
    <div>
      {/* Barra superior: filtros + controles del carrusel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filtrar por evento">
          {eventosDisponibles.map((e) => {
            const active = evento === e;
            return (
              <button
                key={e}
                onClick={() => setEvento(e)}
                role="tab"
                aria-selected={active}
                className={`h-9 rounded-[8px] border px-3.5 text-xs font-medium transition-colors duration-150 ${
                  active
                    ? 'surface-raised text-mist-100'
                    : 'border-transparent bg-ink-800/60 text-mist-300 hover:bg-ink-800 hover:text-mist-100'
                }`}
              >
                {EVENTOS[e] ?? e}
              </button>
            );
          })}
        </div>

        {/* Controles e indicador numérico */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-mist-400 num">
            {String(index + 1).padStart(2, '0')} / {String(filtrados.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollToSlide(index - 1)}
              disabled={index <= 0}
              aria-label="Anterior"
              className="surface-raised flex h-9 w-9 items-center justify-center rounded-[8px] text-mist-100 transition-opacity disabled:opacity-30"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(index + 1)}
              disabled={index >= filtrados.length - 1}
              aria-label="Siguiente"
              className="surface-raised flex h-9 w-9 items-center justify-center rounded-[8px] text-mist-100 transition-opacity disabled:opacity-30"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Pista del carrusel horizontal limpia */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filtrados.map((item) => (
          <article
            key={item.slug}
            className="group relative flex w-[84vw] max-w-[360px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[14px] border border-mist-100/10 bg-ink-800/70 transition-colors duration-200 hover:border-mist-100/22 sm:w-[340px]"
          >
            {/* Imagen limpia tipo póster editorial */}
            <button
              type="button"
              onClick={() => setActivo(item)}
              className="relative aspect-[4/5] w-full overflow-hidden bg-ink-950 text-left focus:outline-none"
              aria-label={`Ver detalles de ${item.titulo}`}
            >
              {item.imagen && (
                <img
                  src={item.imagen}
                  alt={item.titulo}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />

              {/* Etiquetas discretas arriba */}
              <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
                <span className="rounded-[6px] border border-mist-100/12 bg-ink-950/80 px-2.5 py-1 font-mono text-[11px] text-mist-100 backdrop-blur-xs">
                  {EVENTOS[item.evento] ?? item.evento} · {PLANES[item.plan]}
                </span>
                {item.destacado && (
                  <span className="rounded-[6px] border border-gold-400/30 bg-ink-950/85 px-2.5 py-1 font-mono text-[11px] text-gold-300 backdrop-blur-xs">
                    Destacada
                  </span>
                )}
              </div>

              {/* Título y precio integrados sobre el degradado inferior */}
              <div className="absolute inset-x-4 bottom-3.5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl leading-tight text-mist-100">{item.titulo}</h3>
                  <span className="shrink-0 font-mono text-base font-medium text-gold-300 num">
                    {clp(item.precio)}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-mist-300">{item.descripcion}</p>
              </div>
            </button>

            {/* Barra de acciones limpia abajo */}
            <div className="grid grid-cols-2 gap-2 border-t border-mist-100/8 bg-ink-800 p-3">
              <a
                href={`/demos/${item.slug}`}
                target="_blank"
                rel="noopener"
                className="btn-ghost h-9 px-3 text-xs"
              >
                <span>Ver demo</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
              <a
                href={wa(item)}
                target="_blank"
                rel="noopener"
                className="btn-primary h-9 px-3 text-xs"
              >
                La quiero
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Indicadores de posición minimalistas */}
      {filtrados.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5" role="tablist" aria-label="Posición del carrusel">
          {filtrados.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a ${item.titulo}`}
              aria-selected={i === index}
              className={`h-1 rounded-full transition-all duration-200 ${
                i === index ? 'w-6 bg-gold-400' : 'w-1.5 bg-mist-100/20 hover:bg-mist-100/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Modal opcional de detalle al tocar la foto */}
      <AnimatePresence>
        {activo && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-0 backdrop-blur-xs sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setActivo(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={activo.titulo}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="grid max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-[18px] border border-mist-100/12 bg-ink-800 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-[18px] sm:pb-3 md:grid-cols-2"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-[10px] border border-mist-100/8 sm:aspect-[4/3] md:aspect-auto">
                {activo.imagen && <img src={activo.imagen} alt={activo.titulo} className="h-full w-full object-cover" />}
              </div>

              <div className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold-400">Plan {PLANES[activo.plan]}</span>
                    <button
                      onClick={() => setActivo(null)}
                      className="surface-raised flex h-8 w-8 items-center justify-center rounded-[8px] text-mist-300"
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="mt-2 font-display text-3xl text-mist-100">{activo.titulo}</h3>
                  <ul className="mt-4 space-y-2 border-t border-mist-100/8 pt-4 text-xs text-mist-100">
                    {activo.caracteristicas.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-gold-400" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-mist-100/8 pt-4">
                  <span className="font-mono text-xl font-medium text-mist-100 num">{clp(activo.precio)}</span>
                  <div className="flex gap-2">
                    <a href={`/demos/${activo.slug}`} target="_blank" rel="noopener" className="btn-ghost h-9 px-3 text-xs">
                      Ver demo
                    </a>
                    <a href={wa(activo)} target="_blank" rel="noopener" className="btn-primary h-9 px-4 text-xs">
                      Pedir
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
