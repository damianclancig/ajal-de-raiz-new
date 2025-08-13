
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
    nombre: "Zona 1 – Local",
    precio: 0,
    gratisDesde: 0,
    cps: [1876, 1878, 1879, 1882], // Bernal, Don Bosco, Quilmes, Ezpeleta
    cobertura: [
        "Bernal (1876)",
        "Don Bosco (1878)",
        "Quilmes (1879)",
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
    cps: [1875, 1870, 1872, 1874, 1824, 1884, 1886, 1888, 1889], // Wilde, Avellaneda, Lanús, Berazategui, F. Varela
    cobertura: [
        "Wilde (1875)",
        "Avellaneda (1870, 1872, 1874)",
        "Lanús (1824)",
        "Berazategui (1884, 1886, 1888)",
        "Florencio Varela (1888, 1889)",
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
