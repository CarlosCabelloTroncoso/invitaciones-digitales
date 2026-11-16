// Configuración central del sitio: edita aquí tus datos de contacto y marca.
export const SITE = {
  nombre: 'Invitaciones Web',
  dominio: 'tudominio.cl',
  // Versiones sin ".cl": '/logo-sin-cl-light.png' (para fondo blanco) o '/logo-sin-cl-dark-gold.png' (para fondo oscuro)
  logo: '/logo-sin-cl-light.png',
  descripcion:
    'Invitaciones web para bodas, XV años, baby shower y cumpleaños en Chile, con confirmación de asistencia y control de cupos.',
  // Formato internacional sin "+" ni espacios (Chile: 569XXXXXXXX)
  whatsapp: '56945701201',
  whatsappDisplay: '+56 9 4570 1201',
  email: 'ignaciocarlos016@gmail.com',
  ciudad: 'Talca, Región del Maule · Chile',
};

export const waLink = (mensaje = 'Hola, me interesa cotizar una invitación digital') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;

export const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n);
