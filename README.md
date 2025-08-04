
# Ajal de Raiz - Vivero & Jardinería E-commerce

<p align="center">
  <img src="public/images/logo.png" alt="Ajal de Raiz Logo" width="150">
</p>

<p align="center">
  <strong>Un toque verde para la vida moderna.</strong>
</p>

## Descripción

**Ajal de Raiz** es una aplicación web full-stack moderna construida con Next.js y TypeScript. Funciona como una plataforma de e-commerce para un vivero, permitiendo a los usuarios explorar un catálogo de plantas y suministros de jardinería. La aplicación incluye un panel de administración seguro para gestionar productos, usuarios y contenido del sitio, así como perfiles de usuario completos con dirección de envío y fotos de perfil.

La interfaz es completamente responsive, multi-idioma (Español, Inglés, Portugués) y cuenta con temas claro y oscuro para una experiencia de usuario óptima en cualquier dispositivo.

## Funcionalidades

### Para Usuarios

- **Catálogo de Productos**: Explora una amplia gama de plantas y suministros con un diseño visualmente atractivo que soporta tanto imágenes como videos por producto.
- **Búsqueda y Filtrado Avanzado**: Encuentra productos fácilmente usando búsqueda de texto, filtrado por categoría y múltiples opciones de ordenamiento (precio, nombre).
- **Páginas de Detalle**: Visualiza información completa de cada producto, incluyendo una galería de imágenes y videos, descripción, precio y disponibilidad de stock.
- **Carrito de Compras y Pedidos**: Un sistema robusto para que los usuarios autenticados gestionen sus compras.
  - **Añadir al Carrito**: Agrega productos al carrito desde la página de detalle, respetando el stock disponible.
  - **Gestión del Carrito**: Visualiza todos los productos en una página dedicada, ajusta las cantidades o elimina artículos.
  - **Proceso de Pedido Inteligente**: Al finalizar la compra, si los datos de domicilio están incompletos, el sistema solicitará la información necesaria para continuar con el pago. Elige entre "Pagar en Efectivo", "Transferencia Bancaria" o "MercadoPago".
  - **Mis Pedidos**: Accede a un historial completo de todas tus órdenes. Para pagos por transferencia, visualiza los datos bancarios, el monto total y sube tu comprobante de pago para confirmar la transacción. Para pagos con MercadoPago, puedes reintentar un pago si falló y, una vez aprobado, ver los detalles de la transacción (método de pago, cuotas, etc.).
- **Autenticación y Perfil Completo**:
  - **Registro en Dos Pasos**: Un sistema de registro que primero captura los datos básicos y luego ofrece completar el perfil con información de envío.
  - **Gestión de Perfil ("Mi Perfil")**: Los usuarios pueden editar su nombre, teléfono, dirección de envío y subir una foto de perfil personalizada, optimizada para un rendimiento eficiente.
- **Diseño 100% Adaptable**: Experiencia de usuario optimizada para una visualización perfecta en móviles, tablets y de escritorio.
- **Multi-idioma**: Soporte para Español, Inglés y Portugués.
- **Contacto Directo**: Botón de WhatsApp flotante para una comunicación instantánea.

### Para Administradores

- **Panel de Administración Seguro**: Acceso restringido solo para usuarios con rol de administrador.
- **Gestión Avanzada de Productos (CRUD)**: Crea, lee, actualiza, desactiva y elimina permanentemente productos del catálogo. Incluye gestión de stock y carga de videos.
- **Gestión de Órdenes**:
  - **Listado Centralizado**: Visualiza todos los pedidos realizados por los clientes en una tabla organizada, con estados destacados para una fácil identificación.
  - **Detalle de la Orden**: Accede a una vista detallada de cada pedido, incluyendo información del cliente, productos, montos y el ID de pago de MercadoPago.
  - **Verificación de Pagos**: Visualiza los comprobantes de transferencia subidos por los clientes directamente en el detalle del pedido. Los pagos con MercadoPago se confirman automáticamente vía webhook.
  - **Actualización de Estado**: Modifica el estado de cada pedido (ej. de "Pendiente de Confirmación" a "Confirmado") para mantener informado al cliente y gestionar el flujo de trabajo.
- **Gestión de Usuarios Completa**:
    - **Vista Desplegable**: Visualiza todos los usuarios registrados en una lista interactiva. Cada usuario se puede expandir para mostrar sus datos de contacto y dirección completa.
    - **Edición Total**: Edita toda la información del perfil de un usuario, incluyendo nombre, teléfono, dirección de envío y rol de administrador.
- **Carga de Múltiples Imágenes y Videos**: Sube hasta 5 archivos multimedia (imágenes o videos) por producto directamente a Cloudinary.
- **Gestión de Novedades (Slides)**: Administra el carrusel de la página de inicio para destacar promociones.

## Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**:
  - [React](https://reactjs.org/)
  - [ShadCN UI](https://ui.shadcn.com/) para componentes accesibles y personalizables.
  - [Tailwind CSS](https://tailwindcss.com/) para el diseño de la interfaz.
  - [Lucide React](https://lucide.dev/) para iconos.
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/)
- **Base de Datos**: [MongoDB](https://www.mongodb.com/)
- **Gestión de Imágenes y Videos**: [Cloudinary](https://cloudinary.com/)
- **Validación de Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Pagos**: [MercadoPago SDK](https://www.mercadopago.com.ar/developers/es/docs)

## Instalación y Desarrollo Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/en/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Una base de datos MongoDB (puedes usar una instancia local o una gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
- Una cuenta en [Cloudinary](https://cloudinary.com/) para la gestión de imágenes y videos.
- Una cuenta en [MercadoPago](https://mercadopago.com.ar) para gestionar los pagos.

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ajal-de-raiz.git
cd ajal-de-raiz
```

### 3. Instalar Dependencias

```bash
npm install
# O si usas yarn:
# yarn install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto, copiando el contenido de `.env.example`.

```bash
cp .env.example .env.local
```

Ahora, edita el archivo `.env.local` con tus propias credenciales:

```env
# MongoDB
MONGODB_URI="tu_string_de_conexion_a_mongodb"

# NextAuth
# Genera un secreto con: openssl rand -base64 32
AUTH_SECRET="tu_secreto_para_nextauth"
NEXTAUTH_URL="http://localhost:9002"

# Cloudinary - Para la carga de imágenes y videos
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_SECRET=tu_api_secret_de_cloudinary

# MercadoPago - Para procesar pagos
MERCADOPAGO_ACCESS_TOKEN="tu_access_token_de_produccion_o_testing"
MERCADOPAGO_WEBHOOK_SECRET="tu_secreto_para_verificar_webhooks"

# Redes Sociales y Contacto
NEXT_PUBLIC_WHATSAPP_NUMBER="54911xxxxxxxx"
NEXT_PUBLIC_INSTAGRAM_USERNAME="tu_usuario_de_instagram"
NEXT_PUBLIC_CONTACT_EMAIL="tu@email_de_contacto.com"

# Datos Bancarios para Transferencias
BANK_ALIAS="tu.alias.mp"
BANK_CBU="0000003100055555555555"
BANK_CUIT="20-12345678-9"
BANK_ACCOUNT_NAME="Nombre del Titular"

# Emailing Service (Maileroo)
MAILEROO_API_KEY="tu_api_key_de_maileroo"
MAILEROO_FROM_EMAIL="tu@emailverificado.com"
MAILEROO_TO_CONTACT="email_para_recibir_contactos@dominio.com"
```

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:9002](http://localhost:9002).

### 6. Configurar Webhook de MercadoPago

Para que la confirmación de pagos funcione automáticamente, debes configurar un Webhook en tu [Panel de Desarrollador de MercadoPago](https://www.mercadopago.com.ar/developers/panel).

- **URL del Webhook**: `https://tu-dominio-de-produccion.com/api/webhooks/mercadopago`
- **Eventos**: Selecciona el evento `payment`.

En desarrollo, puedes usar una herramienta como [ngrok](https://ngrok.com/) para exponer tu `localhost` a internet y recibir los webhooks.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

