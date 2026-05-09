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
      if (prop) prop.status = 'activo';
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
