
export interface ShippingZone {
    zona: number;
    nombre: string;
    precio?: number;
    precioPorKg?: number;
    minKg?: number;
    gratisDesde: number;
    cps: number[];
    descripcion?: string;
    priceDetails?: string[]; // Mantener para la sección informativa
    cobertura?: string[]; // Mantener para la sección informativa
}

export const zones: ShippingZone[] = [
  {
    zona: 1,
    nombre: "Zona 1 – Partido de Quilmes",
    precio: 0,
    gratisDesde: 0,
    cps: [1876, 1878, 1879, 1881, 1882], // Bernal, Don Bosco, Quilmes, Solano, Ezpeleta
    cobertura: [
        "Bernal (1876)",
        "Don Bosco (1878)",
        "Quilmes (1879)",
        "San Fco. Solano (1881)",
        "Ezpeleta (1882)"
    ],
    priceDetails: [
        "$0 sin mínimo de compra."
    ]
  },
  {
    zona: 2,
    nombre: "Zona 2 – GBA cercano",
    precio: 16400,
    gratisDesde: 30000,
    cps: [
        // Avellaneda
        1870, // Avellaneda Centro
        1871, // Dock Sud
        1872, // Sarandí
        1874, // Piñeyro
        1875, // Wilde
        // Lanús
        1822, // Valentín Alsina
        1823, // Gerli
        1824, // Lanús Oeste
        1825, // Remedios de Escalada
        1826, // Lanús Este
        // Lomas de Zamora
        1828, // Banfield
        1832, // Lomas de Zamora
        1834, // Temperley
        1836, // Llavallol
        1838, // Turdera
        // Almirante Brown
        1846, // Adrogué, San José
        1847, // Rafael Calzada
        1849, // Claypole
        1850, // Don Orione
        1852, // Burzaco
        // Florencio Varela
        1888, // Florencio Varela
        1889, // Bosques
        1890, // Cruce Varela
        // Berazategui
        1884, // Berazategui
        1885, // G.E. Hudson
        1886, // Plátanos
        1891, // Villa España
        1893, // Ranelagh
        1894, // Sourigues
    ],
    cobertura: [
        "Avellaneda (Completo)",
        "Lanús (Completo)",
        "Lomas de Zamora (Completo)",
        "Alte. Brown (Adrogué, Burzaco, Calzada, etc.)",
        "Berazategui (Centro, Hudson, Plátanos, etc.)",
        "Florencio Varela (Centro, Bosques, etc.)",
    ],
    priceDetails: [
        "Costo fijo de $16.400 (hasta 5 kg).",
        "¡Envío GRATIS si tu compra supera los $30.000!"
    ]
  },
  {
    zona: 3,
    nombre: "Zona 3 – AMBA extendido",
    precioPorKg: 11130,
    minKg: 2,
    gratisDesde: 50000,
    cps: [
      // CABA (ejemplos)
      ...Array.from({length: 40}, (_, i) => 1001 + i), 
      // Zona Norte
      1636, 1638, 1640, 1641, 1642, 1643, 1644, 1646,
      // Zona Oeste
      1702, 1704, 1706, 1708, 1712, 1714, 1716,
      // Zona Sur
      1828, 1832, 1834, 1836, 1842, 1846
    ],
     cobertura: [
        "CABA (todos los CP de 1001 a 1440)",
        "Zona Norte (San Isidro, Tigre, Vicente López)",
        "Zona Oeste (Morón, San Martín, La Matanza)",
        "Sur extendido (Lomas, Ezeiza, Almirante Brown)."
    ],
    priceDetails: [
        "Costo de $11.130 por kg (mínimo 2 kg).",
        "¡Envío GRATIS si tu compra supera los $50.000!"
    ]
  },
  {
    zona: 4,
    nombre: "Zona 4 – Resto del País",
    precioPorKg: 11130,
    minKg: 2,
    gratisDesde: 50000,
    cps: [], // Zona por defecto, no necesita CP
    cobertura: [
        "Toda la Provincia de Bs. As. fuera de AMBA.",
        "Todo el interior del país."
    ],
    priceDetails: [
        "Costo de $11.130 por kg (mínimo 2 kg).",
        "¡Envío GRATIS si tu compra supera los $50.000!",
        "Envío por OCA, Andreani, Correo Argentino o encomiendas (a definir)."
    ]
  }
];
