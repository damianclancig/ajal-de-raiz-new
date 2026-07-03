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

'use server';

import type { ActionResponse } from '@/lib/types';
import { shippingZones } from '@/lib/shipping-zones'; // Import from root lib

export async function calculateShipping(zipCode: string, cartTotal: number): Promise<ActionResponse> {
    if (!zipCode || zipCode.length < 4) {
        return { success: false, message: "Por favor, ingresa un código postal válido." };
    }
    const cp = parseInt(zipCode, 10);
    if (isNaN(cp)) {
        return { success: false, message: "El código postal debe ser numérico." };
    }

    const zone = shippingZones.find(z => z.cps.includes(cp));

    if (!zone) {
        // Default to Zona 4 if not found in specific zones 1-3
        const zone4 = shippingZones.find(z => z.zona === 4);
        if (zone4) {
            return {
                success: true,
                message: "Envío al resto del país. El costo se calculará al finalizar la compra.",
                shippingCost: 0, // Cannot calculate automatically yet
                zone: 4
            };
        }
        return { success: false, message: "No se encontró una zona de envío para este código postal." };
    }

    let shippingCost = 0;
    let shippingMessage = "";

    if (zone.gratisDesde && cartTotal >= zone.gratisDesde) {
        shippingCost = 0;
        shippingMessage = "¡Felicidades! Tu envío es gratis.";
    } else {
        shippingCost = zone.precio || 0;
        if (zone.gratisDesde) {
            const remainingForFreeShipping = zone.gratisDesde - cartTotal;
            const formattedRemaining = new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
            }).format(remainingForFreeShipping);
            shippingMessage = `Costo de envío para Zona ${zone.zona}: $${shippingCost.toFixed(2)}. ¡Agrega ${formattedRemaining} más para obtener envío gratis!`;
        } else {
            shippingMessage = `Envío para Zona ${zone.zona} (Local): ¡Gratis!`;
        }
    }

    return { success: true, message: shippingMessage, shippingCost, zone: zone.zona };
}
