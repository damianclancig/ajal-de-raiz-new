<p align="center">
  <img src="https://res.cloudinary.com/dqh1coa3c/image/upload/v1754490326/ajal-de-raiz/logo-min_ycwot1.png" alt="Ajal de Raiz Logo" width="150">
</p>

<h1 align="center">Ajal de Raíz - Vivero & Jardinería E-commerce</h1>

<p align="center">
  <strong>Un toque verde para la vida moderna.</strong>
</p>

## Descripción

**Ajal de Raíz** es una aplicación web full-stack moderna construida con Next.js y TypeScript. Funciona como una plataforma de e-commerce para un vivero, permitiendo a los usuarios explorar un catálogo de plantas y suministros de jardinería. La aplicación incluye un panel de administración seguro para gestionar productos, servicios, usuarios y contenido del sitio, así como perfiles de usuario completos con dirección de envío y fotos de perfil.

La interfaz es completamente responsive, multi-idioma (Español, Inglés, Portugués) y cuenta con temas claro y oscuro para una experiencia de usuario óptima en cualquier dispositivo.

## Funcionalidades Clave

### Para Usuarios
- **Catálogo de Productos con Carga Infinita**: Navegación fluida a través de una amplia gama de productos que se cargan dinámicamente al hacer scroll.
- **Búsqueda y Filtrado Avanzado**: Búsqueda por texto, filtrado por categoría y múltiples opciones de ordenamiento (precio, nombre). Los filtros se reflejan en la URL para compartir vistas específicas.
- **Detalle de Producto Enriquecido**: Páginas de producto con galería de imágenes y videos, descripciones, y una sección de **"Cuidados Esenciales"** con formato claro y visual.
- **Carrito y Proceso de Compra Robusto**:
  - Gestión completa del carrito de compras.
  - Múltiples métodos de pago: **Efectivo, Transferencia Bancaria y MercadoPago**.
  - Flujo de compra inteligente que solicita completar la dirección de envío si es necesario.
- **Gestión de Pedidos del Usuario**:
  - Historial completo de pedidos.
  - Para pagos por transferencia, permite **subir el comprobante de pago** para su verificación.
  - Reintentar pagos fallidos de MercadoPago y ver detalles de transacciones aprobadas.
- **Perfiles de Usuario Completos**: Los usuarios pueden editar su nombre, teléfono, dirección de envío y **subir una foto de perfil personalizada**.
- **Internacionalización**: Soporte completo para Español, Inglés y Portugués.
- **Accesibilidad**: Temas claro/oscuro y diseño 100% adaptable a cualquier dispositivo.

### Para Administradores (Panel de Administración)
- **Gestión Avanzada de Productos (CRUD)**: Creación, actualización y desactivación de productos, con un buscador integrado y carga infinita en la tabla.
- **Editor de "Cuidados del Producto"**: Campo de texto que convierte símbolos (`*`, `-`, `+`) en íconos y viñetas para una presentación atractiva.
- **Gestión de Órdenes Centralizada**:
  - Visualización y filtrado de todos los pedidos.
  - Verificación de pagos por transferencia (visualización de comprobantes).
  - Actualización de estado de los pedidos.
- **Gestión Completa de Usuarios**: Visualiza, edita y gestiona todos los datos del perfil y roles de los usuarios.
- **Gestión de Novedades (Slides)**: Administra el carrusel de la página de inicio, con formato de texto enriquecido y enlaces de botón personalizables.
- **Gestión de Servicios (CRUD)**: Crea, edita y elimina los servicios ofrecidos, incluyendo íconos, precios y detalles.
- **Carga Multimedia**: Sube hasta 5 imágenes o videos por producto a Cloudinary.
- **Centro de Logs de Errores**: Visualiza errores de la aplicación con detalles para un diagnóstico rápido y eficiente.

## Stack Tecnológico

- **Framework**: [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **UI**:
  - [React](https://reactjs.org/)
  - [ShadCN UI](https://ui.shadcn.com/) para componentes accesibles y personalizables.
  - [Tailwind CSS](https://tailwindcss.com/) para el diseño de la interfaz.
  - [Lucide React](https://lucide.dev/) para iconos.
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/)
- **Base de Datos**: [MongoDB](https://www.mongodb.com/) con Mongoose.
- **Gestión de Archivos**: [Cloudinary](https://cloudinary.com/) para imágenes y videos.
- **Pagos**: [MercadoPago SDK](https://www.mercadopago.com.ar/developers/es/docs).
- **Validación de Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/).
- **Servicio de Email**: [Maileroo](https://maileroo.com/).
- **Analíticas**: [Vercel Analytics](https://vercel.com/analytics).

## Instalación y Desarrollo Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/en/) (versión 18 o superior).
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/).
- Una base de datos MongoDB (local o en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
- Cuentas en [Cloudinary](https://cloudinary.com/), [MercadoPago](https://mercadopago.com.ar) y [Maileroo](https://maileroo.com/).

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/ajal-de-raiz.git
cd ajal-de-raiz
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto, copiando el contenido de `.env.example`.

```bash
cp .env.example .env.local
```

Abre `.env.local` y rellena las credenciales. Para `AUTH_SECRET`, puedes generar una clave segura con el siguiente comando:

```bash
openssl rand -base64 32
```

### 5. (Opcional) Cargar Datos de Prueba

Para poblar tu base de datos con productos de ejemplo, ejecuta:

```bash
npm run seed
```

### 6. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:9002](http://localhost:9002).

### 7. Configurar Webhook de MercadoPago

Para que la confirmación de pagos funcione automáticamente, debes configurar un Webhook en tu [Panel de Desarrollador de MercadoPago](https://www.mercadopago.com.ar/developers/panel).

- **URL del Webhook**: `https://<tu-dominio-de-produccion>/api/webhooks/mercadopago`
- **Eventos**: Selecciona el evento `payment`.

En desarrollo, puedes usar una herramienta como [ngrok](https://ngrok.com/) para exponer tu `localhost` a internet y recibir los webhooks.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
