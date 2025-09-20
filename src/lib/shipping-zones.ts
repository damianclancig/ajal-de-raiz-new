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
    cps: [
      1876, // Bernal
      1878, // Don Bosco
      1879, // Quilmes
      1881, // San Francisco Solano
      1882, // Ezpeleta
    ],
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
        1873, // Crucecita
        1874, // Piñeyro
        1875, // Wilde
        // Lanús
        1822, // Valentín Alsina
        1823, // Gerli
        1824, // Lanús Oeste y Este
        1825, // Monte Chingolo, Remedios de Escalada
        1826, // Remedios de Escalada
        // Lomas de Zamora
        1828, // Banfield
        1832, // Lomas de Zamora
        1833, // Temperley
        1834, // Temperley
        1836, // Llavallol
        1838, // Turdera
        // Almirante Brown
        1846, // Adrogué, San José
        1847, // Rafael Calzada
        1849, // Claypole
        1850, // Don Orione
        1852, // Burzaco
        1854, // Longchamps
        // Florencio Varela
        1888, // Florencio Varela
        1889, // Bosques
        1890, // Cruce Varela (Zeballos)
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
      // CABA (todos los códigos postales desde 1000 a 1499)
      ...Array.from({length: 500}, (_, i) => 1000 + i), 
      // GBA Norte
      1602, 1603, 1604, 1605, 1606, 1607, 1609, 1610, 1611, 1613, 1614, 1615, 1616, 1617, 1618, 1619, 1620, 1621, 1636, 1638, 1640, 1641, 1642, 1643, 1644, 1646, 1647, 1648,
      // GBA Oeste
      1650, 1651, 1653, 1655, 1657, 1672, 1674, 1676, 1678, 1682, 1684, 1686, 1702, 1704, 1706, 1708, 1712, 1713, 1714, 1716, 1718, 1722, 1723, 1727, 1731, 1736, 1740, 1741, 1742, 1743, 1744, 1746, 1748, 1754, 1755, 1757, 1759, 1765, 1766, 1768, 1770, 1772, 1773, 1774, 1776, 1778, 1779,
      // Resto GBA Sur
      1804, 1806, 1842, // Ezeiza, Monte Grande
      // La Plata, Berisso, Ensenada
      1896, 1897, 1900, 1901, 1902, 1903, 1904, 1906, 1907, 1909, 1910, 1912, 1913, 1914, 1915, 1916, 1917, 1923, 1925
    ],
     cobertura: [
        "CABA (Completo)",
        "GBA Norte (V. López, San Isidro, Tigre, etc.)",
        "GBA Oeste (Morón, La Matanza, Merlo, Moreno, etc.)",
        "Resto GBA Sur (Ezeiza, Monte Grande)",
        "La Plata, Berisso y Ensenada."
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
