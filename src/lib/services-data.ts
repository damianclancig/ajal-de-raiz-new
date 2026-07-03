/*
 * Copyright 2026 Clancig FullstackWeb
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import type { Service } from './types';
import { Sprout, HeartHandshake, Leaf, Cannabis, Droplets } from 'lucide-react';

export const servicesData: Service[] = [
  {
    id: 'mantenimiento',
    title: 'Mantenimiento de Kokedamas y Plantas',
    description: 'Ideal para mantener tus círculos de musgo, kokedamas y plantas sanos y vibrantes.',
    icon: Droplets,
    details: [
      'Riego por inmersión o pulverización',
      'Limpieza y poda suave',
      'Fumigación ecológica si es necesario',
      'Revisión del estado general y sugerencias de cuidado'
    ],
    price: '$25.000 por hora',
    note: 'Costo adicional por retiro a domicilio. Servicio disponible en Zona Sur de GBA.'
  },
  {
    id: 'guarderia',
    title: 'Guardería de Plantas',
    description: '¿Te vas de viaje? Las cuidamos por vos. Riego, luz natural y un espacio seguro para tus plantas.',
    icon: Leaf,
    details: [
      'Cuidado para kokedamas, plantas tropicales y medicinales',
      'Supervisión semanal y fotos de seguimiento',
      'Ambiente controlado para su bienestar'
    ],
    price: 'Desde $180.000 por semana',
    note: 'Precio base para hasta 3 plantas. Consultar por más cantidad.'
  },
  {
    id: 'asesoramiento-cannabico',
    title: 'Asesoramiento en Cultivo Cannábico',
    description: 'Consultoría personalizada para que tu cultivo crezca fuerte y sano, desde la germinación hasta la cosecha.',
    icon: Cannabis,
    details: [
      'Selección de sustratos ideales según clima y espacio',
      'Asesoramiento en cultivo artesanal',
      'Recomendaciones de germinación, vegetación y floración'
    ],
    price: '$25.000 por sesión',
    note: 'La sesión dura aproximadamente 1 hora.'
  },
  {
    id: 'souvenires',
    title: 'Souvenires Vivos para Eventos',
    description: 'Plantitas que florecen en la memoria. Ideales para casamientos, ceremonias y eventos empresariales.',
    icon: HeartHandshake,
    details: [
      'Kokedamas, suculentas o mini plantines',
      'Personalización de etiquetas, frases y packaging',
      'Un recuerdo vivo y ecológico para tus invitados'
    ],
    price: 'Desde $6.500 por unidad',
    note: 'Consultar mínimo por cantidad y opciones de personalización.'
  }
];
