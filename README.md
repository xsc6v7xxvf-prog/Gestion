# Gestion Serviprac

Aplicación web de gestión para Serviprac: login con recuperación de
contraseña por email, gestión de clientes, órdenes de servicio y
facturación.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth (Auth.js) v5](https://authjs.dev) con proveedor de credenciales
- Envío de emails con `nodemailer` (SMTP)

## Requisitos

- Node.js 20+
- Una base de datos PostgreSQL (por ejemplo [Neon](https://neon.tech) o
  [Supabase](https://supabase.com), ambos con plan gratuito)
- Un servidor SMTP para el envío de emails de recuperación de contraseña
  (por ejemplo [Resend](https://resend.com), [SendGrid](https://sendgrid.com)
  o el SMTP de tu proveedor de correo)

## Configuración local

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno y complétalo:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: cadena de conexión de tu base de datos PostgreSQL.
   - `AUTH_SECRET`: genera uno con `npx auth secret` o `openssl rand -base64 32`.
   - `NEXTAUTH_URL`: URL pública de la app (`http://localhost:3000` en local).
   - `SMTP_*` y `EMAIL_FROM`: credenciales de tu servidor de correo.

3. Crea las tablas en la base de datos:

   ```bash
   npm run db:migrate
   ```

4. Crea el usuario administrador inicial:

   ```bash
   npm run db:seed
   ```

   Por defecto crea `admin@serviprac.com` con contraseña `changeme123`.
   Puedes personalizarlo con las variables `SEED_ADMIN_EMAIL` y
   `SEED_ADMIN_PASSWORD` antes de ejecutar el comando.

5. Levanta el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) e inicia sesión.

## Despliegue en Vercel

1. Crea una base de datos PostgreSQL en Neon o Supabase y copia su cadena
   de conexión.
2. Importa el repositorio en [Vercel](https://vercel.com/new).
3. En las variables de entorno del proyecto añade `DATABASE_URL`,
   `AUTH_SECRET`, `NEXTAUTH_URL` (la URL de producción) y las variables
   `SMTP_*` / `EMAIL_FROM`.
4. Despliega. El comando `build` ejecuta `prisma generate` automáticamente.
5. Ejecuta las migraciones contra la base de datos de producción (por
   ejemplo desde tu máquina, apuntando `DATABASE_URL` a producción):

   ```bash
   npm run db:deploy
   npm run db:seed
   ```

## Estructura principal

```
prisma/schema.prisma       Modelos: User, Client, ServiceOrder, Invoice
prisma/seed.ts             Script para crear el usuario administrador
src/auth.ts                Configuración de NextAuth
src/lib/require-auth.ts     Protección de rutas y acciones (requiere sesión)
src/actions/                Server actions (clientes, órdenes, facturas, auth)
src/app/login                Login
src/app/forgot-password      Solicitud de recuperación de contraseña
src/app/reset-password        Formulario de nueva contraseña
src/app/dashboard             Aplicación (resumen, clientes, órdenes, facturas)
```

## Scripts

- `npm run dev` – servidor de desarrollo
- `npm run build` – compilación de producción
- `npm run lint` – linter
- `npm run db:migrate` – crea/actualiza migraciones en desarrollo
- `npm run db:deploy` – aplica migraciones en producción
- `npm run db:seed` – crea el usuario administrador inicial
