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
  infantil: 'Infantiles',
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

const WaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88zm8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z" />
  </svg>
);

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

  const isCutout = (img?: string) => Boolean(img?.endsWith('.png'));

  return (
    <div>
      {/* Filtros horizontales + controles del carrusel */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="no-scrollbar -mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 py-0.5 sm:flex-wrap"
          role="tablist"
          aria-label="Filtrar por evento"
        >
          {eventosDisponibles.map((e) => {
            const active = evento === e;
            return (
              <button
                key={e}
                onClick={() => setEvento(e)}
                role="tab"
                aria-selected={active}
                className={`h-9 shrink-0 rounded-[8px] border px-3.5 text-xs font-medium transition-colors duration-150 ${
                  active
                    ? 'border-charcoal-900 bg-charcoal-900 text-paper-50'
                    : 'border-charcoal-900/12 bg-paper-50 text-charcoal-600 hover:border-charcoal-900/25 hover:text-charcoal-900'
                }`}
              >
                {EVENTOS[e] ?? e}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <span className="font-mono text-xs text-charcoal-400 num">
            {String(index + 1).padStart(2, '0')} / {String(filtrados.length).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scrollToSlide(index - 1)}
              disabled={index <= 0}
              aria-label="Anterior"
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-charcoal-900/14 bg-paper-50 text-charcoal-900 transition-colors hover:bg-paper-200 disabled:opacity-30"
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
              className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-charcoal-900/14 bg-paper-50 text-charcoal-900 transition-colors hover:bg-paper-200 disabled:opacity-30"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carrusel limpio estilo galería blanca */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 sm:gap-5"
      >
        {filtrados.map((item) => {
          const cutout = isCutout(item.imagen);
          const [bgColor] = item.colores;
          return (
            <article
              key={item.slug}
              className="sheet group relative flex w-[82vw] max-w-[320px] shrink-0 snap-start flex-col justify-between overflow-hidden transition-colors duration-200 hover:border-charcoal-900/24 sm:w-[310px] sm:max-w-none md:w-[330px] lg:w-[360px]"
            >
              {/* Lámina superior: imagen limpia con margen de paseo */}
              <button
                type="button"
                onClick={() => setActivo(item)}
                className="block w-full text-left focus:outline-none"
                aria-label={`Ver detalles de ${item.titulo}`}
              >
                <div
                  style={
                    cutout
                      ? { background: `radial-gradient(circle at 50% 45%, ${bgColor}18 0%, #f4f1ea 85%)` }
                      : undefined
                  }
                  className="relative aspect-[4/3] w-full overflow-hidden border-b border-charcoal-900/8 bg-paper-200"
                >
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.titulo}
                      loading="lazy"
                      className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${
                        cutout ? 'object-contain p-5 drop-shadow-[0_12px_20px_rgba(18,18,20,0.18)]' : 'object-cover'
                      }`}
                    />
                  )}
                  <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                    <span className="truncate rounded-[6px] border border-charcoal-900/12 bg-paper-50/92 px-2.5 py-1 font-mono text-[10px] text-charcoal-700 backdrop-blur-xs sm:text-[11px]">
                      {EVENTOS[item.evento] ?? item.evento} · {PLANES[item.plan]}
                    </span>
                    {item.destacado && (
                      <span className="shrink-0 rounded-[6px] border border-gold-400/45 bg-paper-50/95 px-2.5 py-1 font-mono text-[10px] text-gold-600 backdrop-blur-xs sm:text-[11px]">
                        Destacada
                      </span>
                    )}
                  </div>
                </div>

                {/* Pie editorial sobre blanco puro */}
                <div className="px-4 pt-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="truncate font-display text-2xl leading-tight text-charcoal-900">{item.titulo}</h3>
                    <span className="shrink-0 font-mono text-base font-medium text-indigo-900 num">
                      {clp(item.precio)}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-charcoal-600">{item.descripcion}</p>
                </div>
              </button>

              {/* Acciones directas abajo */}
              <div className="mt-4 grid grid-cols-2 gap-2 px-4 pb-4">
                <a
                  href={`/demos/${item.slug}/`}
                  target="_blank"
                  rel="noopener"
                  className="btn-ghost h-9 px-2.5 text-xs sm:px-3"
                >
                  <span>Ver demo</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0" aria-hidden="true">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </a>
                <a
                  href={wa(item)}
                  target="_blank"
                  rel="noopener"
                  className="btn-primary h-9 px-2.5 text-xs sm:px-3"
                >
                  <WaIcon />
                  <span>La quiero</span>
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Indicadores minimalistas */}
      {filtrados.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5" role="tablist" aria-label="Posición del carrusel">
          {filtrados.map((item, i) => (
            <button
              key={item.slug}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`Ir a ${item.titulo}`}
              aria-selected={i === index}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? 'w-6 bg-indigo-900' : 'w-1.5 bg-charcoal-900/18 hover:bg-charcoal-900/35'
              }`}
            />
          ))}
        </div>
      )}

      {/* Modal opcional de detalle */}
      <AnimatePresence>
        {activo && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal-900/45 p-0 backdrop-blur-xs sm:items-center sm:p-6"
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
              className="grid max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-[18px] border border-charcoal-900/14 bg-paper-50 p-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_32px_64px_-24px_rgba(18,18,20,0.32)] sm:rounded-[18px] sm:pb-3 md:grid-cols-2"
            >
              <div
                style={
                  isCutout(activo.imagen)
                    ? { background: `radial-gradient(circle at 50% 45%, ${activo.colores[0]}18 0%, #f4f1ea 88%)` }
                    : undefined
                }
                className="aspect-[16/10] overflow-hidden rounded-[10px] border border-charcoal-900/10 bg-paper-200 sm:aspect-[4/3] md:aspect-auto"
              >
                {activo.imagen && (
                  <img
                    src={activo.imagen}
                    alt={activo.titulo}
                    className={`h-full w-full ${isCutout(activo.imagen) ? 'object-contain p-6' : 'object-cover'}`}
                  />
                )}
              </div>

              <div className="flex flex-col justify-between p-4 sm:p-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold-600">Plan {PLANES[activo.plan]}</span>
                    <button
                      onClick={() => setActivo(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-charcoal-900/12 bg-paper-100 text-charcoal-700 hover:bg-paper-200"
                      aria-label="Cerrar"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="mt-2 font-display text-2xl text-charcoal-900 sm:text-3xl">{activo.titulo}</h3>
                  <ul className="mt-4 space-y-2 border-t border-charcoal-900/10 pt-4 text-xs text-charcoal-700">
                    {activo.caracteristicas.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal-900/10 pt-4">
                  <span className="font-mono text-xl font-medium text-charcoal-900 num">{clp(activo.precio)}</span>
                  <div className="flex gap-2">
                    <a href={`/demos/${activo.slug}/`} target="_blank" rel="noopener" className="btn-ghost h-9 px-3 text-xs">
                      Ver demo
                    </a>
                    <a href={wa(activo)} target="_blank" rel="noopener" className="btn-primary h-9 px-3.5 text-xs">
                      <WaIcon />
                      <span>Pedir</span>
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
