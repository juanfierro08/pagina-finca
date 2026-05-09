// Mock implementation of Firebase until the real keys are provided

export const MOCK_PROPERTIES = [];

export const getProperties = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PROPERTIES), 800); // Simulate network delay
  });
};

export const createProperty = async (propertyData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProp = {
        id: `p${Date.now()}`,
        ...propertyData,
        status: 'pendiente_pago' // Require payment before active
      };
      MOCK_PROPERTIES.push(newProp);
      resolve(newProp);
    }, 1000);
  });
};

export const activateProperty = async (propertyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prop = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (prop) prop.status = 'en_revision'; // Ahora pasa a revisión de RNT
      
      // Simular el envío de correo usando la API gratuita de FormSubmit
      // En producción real, esto enviará el email (FormSubmit requiere que actives tu correo la primera vez)
      fetch('https://formsubmit.co/ajax/juanfierro0821@gmail.com', {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            _subject: `Nueva Propiedad Requiere Aprobación - RNT Recibido`,
            mensaje: `El anfitrión ${prop?.hostId} ha pagado la suscripción y subido la propiedad "${prop?.title}". Por favor, ingresa al panel de Administrador en https://alojate-sable.vercel.app para descargar y revisar el RNT en PDF.`,
            Host: prop?.hostId,
            Propiedad: prop?.title
        })
      }).catch(err => console.log('Simulación de correo fallida (sin internet o adblocker)', err));

      resolve(prop);
    }, 500);
  });
};

export const boostProperty = async (propertyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prop = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (prop) prop.boosted = true;
      resolve(prop);
    }, 500);
  });
};

export const approveProperty = async (propertyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prop = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (prop) {
        prop.status = 'activo';
        if (prop.hostEmail) {
          fetch(`https://formsubmit.co/ajax/${prop.hostEmail}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: `Alojate - Tu propiedad ha sido APROBADA ✅`,
                mensaje: `Hola, tu propiedad "${prop.title}" ha superado la revisión de RNT y ya está activa en la plataforma. ¡Lista para recibir huéspedes!`
            })
          }).catch(() => {});
        }
      }
      resolve(prop);
    }, 500);
  });
};

export const rejectProperty = async (propertyId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prop = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (prop) {
        prop.status = 'rechazado';
        if (prop.hostEmail) {
          fetch(`https://formsubmit.co/ajax/${prop.hostEmail}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                _subject: `Alojate - Problemas con tu propiedad ❌`,
                mensaje: `Hola, hemos revisado tu propiedad "${prop.title}" y el RNT proporcionado no es válido o legible. Tu publicación ha sido rechazada.`
            })
          }).catch(() => {});
        }
      }
      resolve(prop);
    }, 500);
  });
};
