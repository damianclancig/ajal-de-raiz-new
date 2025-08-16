
export const shippingZones = [
    {
      "zona": 1,
      "nombre": "Quilmes",
      "precio": 0,
      "gratisDesde": 0,
      "cps": [1876, 1878, 1879, 1881, 1882],
      "cobertura": ["Bernal", "Don Bosco", "Quilmes", "Ezpeleta", "San Francisco Solano"],
      "priceDetails": "¡Envío gratis!"
    },
    {
      "zona": 2,
      "nombre": "GBA Sur (Cercano)",
      "precio": 3500,
      "gratisDesde": 40000,
      "cps": [
        1870, 1872, 1874, 1875, 1877, 1880, 1884, 1885, 1886, 1887, 1888,
        1822, 1824, 1825, 1826, 1828, 1832, 1834, 1835, 1836, 1846, 1847,
        1849, 1852, 1854, 1856, 1889
      ],
      "cobertura": [
        "Avellaneda (Centro, Sarandí, Wilde, Dock Sud)",
        "Lanús (Este, Oeste, Valentín Alsina, Gerli, Monte Chingolo)",
        "Lomas de Zamora (Lomas, Temperley, Banfield, Llavallol)",
        "Almirante Brown (Adrogué, Burzaco, Rafael Calzada, San José, Don Orione)",
        "Florencio Varela (Centro, Cruce Varela, Gobernador Costa, Bosques)",
        "Berazategui (Centro, Villa España, Plátanos, Hudson)"
      ],
      "priceDetails": "Costo fijo de $3.500"
    },
    {
      "zona": 3,
      "nombre": "AMBA Extendido",
      "precio": 5500,
      "gratisDesde": 60000,
      "cps": [
        1000, 1499, // CABA
        1602, 1646, // GBA Norte (V. López, San Isidro, San Fernando, Tigre)
        1650, 1774, // GBA Oeste y Sur (completo)
        1890, 1925  // La Plata, Berisso, Ensenada
      ],
      "cobertura": [
        "Ciudad Autónoma de Buenos Aires (CABA)",
        "GBA Norte (Vicente López, San Isidro, San Fernando, Tigre)",
        "GBA Oeste (La Matanza, Morón, Tres de Febrero, etc.)",
        "Resto de GBA Sur (Ezeiza, Esteban Echeverría)",
        "La Plata, Berisso y Ensenada"
      ],
      "priceDetails": "Costo fijo de $5.500"
    },
    {
      "zona": 4,
      "nombre": "Resto del País",
      "precio": 0,
      "gratisDesde": null,
      "cps": [],
      "cobertura": ["Fuera de AMBA"],
      "priceDetails": "A calcular según Correo Argentino"
    }
];
