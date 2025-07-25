# Ajal de Raiz - Vivero & Jardinería E-commerce

<p align="center">
  <img src="public/images/logo.png" alt="Ajal de Raiz Logo" width="150">
</p>

<p align="center">
  <strong>Un toque verde para la vida moderna.</strong>
</p>

## Descripción

**Ajal de Raiz** es una aplicación web full-stack moderna construida con Next.js y TypeScript. Funciona como una plataforma de e-commerce para un vivero, permitiendo a los usuarios explorar un catálogo de plantas y suministros de jardinería. La aplicación incluye un panel de administración seguro para gestionar productos, usuarios y contenido del sitio.

La interfaz es completamente responsive, multi-idioma (Español, Inglés, Portugués) y cuenta con temas claro y oscuro para una experiencia de usuario óptima en cualquier dispositivo.

## Funcionalidades

### Para Usuarios

- **Catálogo de Productos**: Explora una amplia gama de plantas y suministros con un diseño visualmente atractivo.
- **Búsqueda y Filtrado Avanzado**: Encuentra productos fácilmente usando búsqueda de texto, filtrado por categoría y múltiples opciones de ordenamiento (precio, nombre).
- **Páginas de Detalle**: Visualiza información completa de cada producto, incluyendo una galería de imágenes, descripción, precio y disponibilidad de stock.
- **Carrito de Compras Funcional**: Un sistema de carrito de compras robusto y completamente funcional para usuarios autenticados.
  - **Añadir al Carrito**: Agrega productos al carrito desde la página de detalle, respetando el stock disponible.
  - **Gestión del Carrito**: Visualiza todos los productos en una página dedicada, ajusta las cantidades o elimina artículos con una interfaz clara y responsiva.
  - **Resumen de Compra**: Muestra precios unitarios, subtotales y el costo total del pedido de forma clara.
- **Autenticación Segura**: Sistema completo de registro, inicio de sesión y recuperación de contraseña.
- **Diseño 100% Adaptable**: Experiencia de usuario optimizada y corregida para una visualización perfecta en dispositivos móviles, tablets y de escritorio.
- **Multi-idioma**: Soporte para Español, Inglés y Portugués.
- **Contacto Directo**: Botón de WhatsApp flotante para una comunicación instantánea.

### Para Administradores

- **Panel de Administración Seguro**: Acceso restringido solo para usuarios con rol de administrador.
- **Gestión Avanzada de Productos (CRUD)**: Crea, lee, actualiza, desactiva y elimina permanentemente productos del catálogo. Incluye gestión de stock.
- **Carga de Múltiples Imágenes**: Sube hasta 5 imágenes por producto directamente a Cloudinary a través de un componente dedicado.
- **Eliminación Segura**: Sistema de doble confirmación para la eliminación física de productos, requiriendo la escritura de una palabra clave para evitar borrados accidentales.
- **Gestión de Usuarios**: Visualiza todos los usuarios registrados y asigna o revoca roles de administrador.
- **Gestión de Novedades (Slides)**: Administra el carrusel de la página de inicio para destacar promociones y novedades.

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
- **Gestión de Imágenes**: [Cloudinary](https://cloudinary.com/)
- **Validación de Formularios**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Instalación y Desarrollo Local

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos

- [Node.js](https://nodejs.org/en/) (versión 18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- Una base de datos MongoDB (puedes usar una instancia local o una gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).
- Una cuenta en [Cloudinary](https://cloudinary.com/) para la gestión de imágenes.

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

# Cloudinary - Para la carga de imágenes
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name_de_cloudinary
NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key_de_cloudinary
CLOUDINARY_SECRET=tu_api_secret_de_cloudinary

# Número de WhatsApp (opcional)
NEXT_PUBLIC_WHATSAPP_NUMBER="54911xxxxxxxx"
```

### 5. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:9002](http://localhost:9002).

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
