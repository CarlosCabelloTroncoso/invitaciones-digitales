import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const faqs = [
  {
    q: '¿Cómo funciona el pedido y cuánto demora?',
    a: 'Eliges un diseño, nos envías los datos de tu evento por WhatsApp y en 48 horas hábiles te entregamos el link listo para compartir.',
  },
  {
    q: '¿Cuál es la diferencia entre link general y boda con control de cupos?',
    a: 'El link general (desde $9.990) es un mismo enlace que reenvías sin límite a todos. En la boda con control de cupos (desde $29.990) cada familia recibe un link con su nombre y cupos exactos asignados, y sus respuestas quedan anotadas en tu planilla.',
  },
  {
    q: '¿Qué pasa si cambia la hora o el lugar después de enviarla?',
    a: 'Actualizamos el dato en la página y el link sigue siendo el mismo, así que todos tus invitados ven la información corregida sin reenviar nada.',
  },
  {
    q: '¿Conviene más que imprimir invitaciones en papel?',
    a: 'Imprimir 100 partes en Chile cuesta entre $150.000 y $400.000 CLP y tarda semanas. La invitación digital cuesta desde $9.990 CLP, incluye mapa GPS y confirmación de asistencia en un toque.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Por transferencia bancaria o tarjeta mediante link de pago en pesos chilenos.',
  },
];

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="divide-y divide-mist-100/8 border-y border-mist-100/8">
      {faqs.map((f, i) => {
        const open = abierto === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setAbierto(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-mist-100"
            >
              <span className={`text-sm font-medium transition-colors sm:text-base ${open ? 'text-mist-100' : 'text-mist-300'}`}>
                {f.q}
              </span>
              <span className="surface-raised flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-mist-400">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  className={`transition-transform duration-150 ${open ? 'rotate-45 text-gold-400' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-4 pr-8 text-xs leading-5 text-mist-300 sm:text-sm num">
                    {f.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
