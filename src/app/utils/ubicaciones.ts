// Datos de provincias y ciudades de Argentina
export interface Provincia {
  value: string;
  label: string;
  ciudades: Ciudad[];
}

export interface Ciudad {
  value: string;
  label: string;
  codigoPostal?: string;
}

// value = nombre exacto de la tabla provincia en BD para que el Excel siempre resuelva codi_provincia
export const provincias: Provincia[] = [
  {
    value: "BUENOS AIRES",
    label: "Buenos Aires",
    ciudades: [
      { value: "capital-federal", label: "Capital Federal", codigoPostal: "1000" },
      { value: "la-plata", label: "La Plata", codigoPostal: "1900" },
      { value: "mar-del-plata", label: "Mar del Plata", codigoPostal: "7600" },
      { value: "bahia-blanca", label: "Bahía Blanca", codigoPostal: "8000" },
      { value: "tandil", label: "Tandil", codigoPostal: "7000" },
    ],
  },
  {
    value: "CÓRDOBA",
    label: "Córdoba",
    ciudades: [
      { value: "cordoba-capital", label: "Córdoba", codigoPostal: "5000" },
      { value: "villa-maria", label: "Villa María", codigoPostal: "5900" },
      { value: "rio-cuarto", label: "Río Cuarto", codigoPostal: "5800" },
      { value: "san-francisco", label: "San Francisco", codigoPostal: "2400" },
    ],
  },
  {
    value: "SANTA FE",
    label: "Santa Fe",
    ciudades: [
      { value: "rosario", label: "Rosario", codigoPostal: "2000" },
      { value: "santa-fe-capital", label: "Santa Fe", codigoPostal: "3000" },
      { value: "rafaela", label: "Rafaela", codigoPostal: "2300" },
    ],
  },
  {
    value: "MENDOZA",
    label: "Mendoza",
    ciudades: [
      { value: "mendoza-capital", label: "Mendoza", codigoPostal: "5500" },
      { value: "san-rafael", label: "San Rafael", codigoPostal: "5600" },
    ],
  },
  {
    value: "TUCUMÁN",
    label: "Tucumán",
    ciudades: [
      { value: "san-miguel-tucuman", label: "San Miguel de Tucumán", codigoPostal: "4000" },
    ],
  },
  {
    value: "SALTA",
    label: "Salta",
    ciudades: [
      { value: "salta-capital", label: "Salta", codigoPostal: "4400" },
    ],
  },
  {
    value: "ENTRE RÍOS",
    label: "Entre Ríos",
    ciudades: [
      { value: "parana", label: "Paraná", codigoPostal: "3100" },
      { value: "concepcion-uruguay", label: "Concepción del Uruguay", codigoPostal: "3260" },
    ],
  },
  {
    value: "MISIONES",
    label: "Misiones",
    ciudades: [
      { value: "posadas", label: "Posadas", codigoPostal: "3300" },
    ],
  },
  {
    value: "CORRIENTES",
    label: "Corrientes",
    ciudades: [
      { value: "corrientes-capital", label: "Corrientes", codigoPostal: "3400" },
    ],
  },
  {
    value: "CHACO",
    label: "Chaco",
    ciudades: [
      { value: "resistencia", label: "Resistencia", codigoPostal: "3500" },
    ],
  },
  {
    value: "SANTIAGO DEL ESTERO",
    label: "Santiago del Estero",
    ciudades: [
      { value: "santiago-capital", label: "Santiago del Estero", codigoPostal: "4200" },
    ],
  },
  {
    value: "SAN JUAN",
    label: "San Juan",
    ciudades: [
      { value: "san-juan-capital", label: "San Juan", codigoPostal: "5400" },
    ],
  },
  {
    value: "JUJUY",
    label: "Jujuy",
    ciudades: [
      { value: "san-salvador-jujuy", label: "San Salvador de Jujuy", codigoPostal: "4600" },
    ],
  },
  {
    value: "RÍO NEGRO",
    label: "Río Negro",
    ciudades: [
      { value: "viedma", label: "Viedma", codigoPostal: "8500" },
      { value: "bariloche", label: "San Carlos de Bariloche", codigoPostal: "8400" },
    ],
  },
  {
    value: "FORMOSA",
    label: "Formosa",
    ciudades: [
      { value: "formosa-capital", label: "Formosa", codigoPostal: "3600" },
    ],
  },
  {
    value: "NEUQUÉN",
    label: "Neuquén",
    ciudades: [
      { value: "neuquen-capital", label: "Neuquén", codigoPostal: "8300" },
    ],
  },
  {
    value: "CHUBUT",
    label: "Chubut",
    ciudades: [
      { value: "rawson", label: "Rawson", codigoPostal: "9103" },
      { value: "comodoro-rivadavia", label: "Comodoro Rivadavia", codigoPostal: "9000" },
    ],
  },
  {
    value: "SAN LUIS",
    label: "San Luis",
    ciudades: [
      { value: "san-luis-capital", label: "San Luis", codigoPostal: "5700" },
    ],
  },
  {
    value: "CATAMARCA",
    label: "Catamarca",
    ciudades: [
      { value: "catamarca-capital", label: "San Fernando del Valle de Catamarca", codigoPostal: "4700" },
    ],
  },
  {
    value: "LA RIOJA",
    label: "La Rioja",
    ciudades: [
      { value: "la-rioja-capital", label: "La Rioja", codigoPostal: "5300" },
    ],
  },
  {
    value: "LA PAMPA",
    label: "La Pampa",
    ciudades: [
      { value: "santa-rosa", label: "Santa Rosa", codigoPostal: "6300" },
    ],
  },
  {
    value: "SANTA CRUZ",
    label: "Santa Cruz",
    ciudades: [
      { value: "rio-gallegos", label: "Río Gallegos", codigoPostal: "9400" },
    ],
  },
  {
    value: "TIERRA DEL FUEGO",
    label: "Tierra del Fuego",
    ciudades: [
      { value: "ushuaia", label: "Ushuaia", codigoPostal: "9410" },
    ],
  },
];

// Función para buscar ubicación por código postal
export function buscarPorCodigoPostal(codigoPostal: string): { provincia: string; ciudad: string } | null {
  const codigo = codigoPostal.trim();
  
  for (const provincia of provincias) {
    const ciudad = provincia.ciudades.find(
      (c) => c.codigoPostal === codigo
    );
    if (ciudad) {
      return {
        provincia: provincia.value,
        ciudad: ciudad.value,
      };
    }
  }
  
  return null;
}

// Función para obtener ciudades por provincia
export function obtenerCiudadesPorProvincia(provinciaValue: string): Ciudad[] {
  const provincia = provincias.find((p) => p.value === provinciaValue);
  return provincia ? provincia.ciudades : [];
}

// Función para obtener el nombre completo de la ubicación
export function obtenerNombreUbicacion(provinciaValue: string, ciudadValue: string): string {
  const provincia = provincias.find((p) => p.value === provinciaValue);
  if (!provincia) return "";
  
  const ciudad = provincia.ciudades.find((c) => c.value === ciudadValue);
  if (!ciudad) return provincia.label;
  
  return `${ciudad.label}, ${provincia.label}`;
}

