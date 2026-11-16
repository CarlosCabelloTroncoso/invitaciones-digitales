import { useState } from 'react';

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
    q: '¿Incluye mapa y confirmación por WhatsApp?',
    a: 'Sí, todos los planes incluyen mapa con ubicación exacta para llegar directo y botón de confirmación de asistencia.',
  },
  {
    q: '¿Cómo se paga?',
    a: 'Por transferencia bancaria o tarjeta mediante link de pago en pesos chilenos.',
  },
];

export default function FAQ() {
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="divide-y divide-charcoal-900/10 border-y border-charcoal-900/10">
      {faqs.map((f, i) => {
        const open = abierto === i;
        return (
          <div key={f.q}>
            <button
              onClick={() => setAbierto(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-4 text-left transition-colors hover:text-charcoal-900"
            >
              <span className={`text-sm font-medium transition-colors sm:text-base ${open ? 'text-charcoal-900' : 'text-charcoal-600'}`}>
                {f.q}
              </span>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-charcoal-900/12 bg-paper-50 text-charcoal-600">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className={`transition-transform duration-200 ${open ? 'rotate-45 text-indigo-900' : ''}`}
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 pr-8 text-xs leading-5 text-charcoal-600 sm:text-sm sm:leading-6 num">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
