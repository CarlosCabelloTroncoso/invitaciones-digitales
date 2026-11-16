import { useState } from 'react';

type Tramo = {
  id: string;
  rango: string;
  precio: number;
};

const TRAMOS: Tramo[] = [
  { id: '30', rango: 'Hasta 30 invitados', precio: 29990 },
  { id: '50', rango: 'Hasta 50 invitados', precio: 39990 },
  { id: '100', rango: '51 a 100 invitados', precio: 49990 },
  { id: '150', rango: '101 a 150 invitados', precio: 59990 },
  { id: '250', rango: '151 a 250 invitados', precio: 69990 },
];

const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);

export default function CotizadorBodas({ whatsapp }: { whatsapp: string }) {
  const [seleccionado, setSeleccionado] = useState<string>('50');
  const tramo = TRAMOS.find((t) => t.id === seleccionado) ?? TRAMOS[1];

  const linkWa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hola, quiero cotizar una invitación de boda con gestión de invitados (${tramo.rango} · ${clp(tramo.precio)})`
  )}`;

  return (
    <div className="card mt-6 p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <span className="font-mono text-xs text-gold-400">Bodas con control de cupos</span>
          <h3 className="mt-1 text-lg font-medium text-mist-100">
            ¿Necesitas link personalizado por familia y lista de confirmados?
          </h3>
          <p className="mt-1 text-xs leading-5 text-mist-300">
            Cada familia abre su propio pase (ej. &ldquo;Familia Pérez · 3 cupos&rdquo;) y las confirmaciones se guardan solas en tu planilla.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-2xl font-medium text-mist-100 num">{clp(tramo.precio)}</span>
          <a href={linkWa} target="_blank" rel="noopener" className="btn-primary h-10 px-4 text-xs">
            Pedir {tramo.rango.toLowerCase()}
          </a>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5" role="radiogroup" aria-label="Cantidad de invitados">
        {TRAMOS.map((t) => {
          const active = t.id === seleccionado;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSeleccionado(t.id)}
              className={`flex flex-col justify-between rounded-[8px] border p-3 text-left transition-colors duration-150 ${
                active
                  ? 'surface-raised border-mist-100/20 text-mist-100'
                  : 'border-mist-100/8 bg-ink-900 text-mist-300 hover:border-mist-100/16 hover:text-mist-100'
              }`}
            >
              <span className="text-xs font-medium">{t.rango}</span>
              <span className="mt-1 font-mono text-xs text-gold-400 num">{clp(t.precio)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
