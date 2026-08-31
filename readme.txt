# ECUP8

Plataforma para publicar y encontrar torneos personalizados de eFootball. Resuelve un problema concreto: el modo Torneo Personalizado de eFootball permite armar eliminatorias de hasta 8 jugadores, pero no ofrece ninguna forma de encontrar rivales ni coordinar sin depender de un grupo disperso de WhatsApp.

🔗 **App en producción**: https://ecup8.onrender.com

## Qué hace

- Publicar un torneo con tus propias condiciones (formato, región, fecha, cupo)
- Descubrir torneos filtrando por región (para minimizar el lag)
- Unirse o darse de baja, con el cupo actualizándose solo
- Link de coordinación privado (Discord/WhatsApp), visible solo para quien esté inscrito o sea el host
- Login real con Discord

## Qué NO hace, a propósito

No lleva registro de resultados ni arma el bracket — eso ya lo resuelve el propio juego. ECUP8 coordina el armado del torneo, nada más; pedirle a alguien que cargue resultados a mano sería una tarea que nadie sostendría.

## Stack

- **Backend**: Node.js + Express
- **Vistas**: Handlebars (renderizado del lado del servidor)
- **Base de datos**: Supabase (PostgreSQL), con Row Level Security en las tablas sensibles
- **Autenticación**: OAuth con Discord, vía Supabase Auth, sesiones de servidor con `express-session`
- **Frontend**: HTML/CSS puro + JavaScript vanilla (sin frameworks del lado del cliente)

## Arquitectura

El proyecto sigue una separación en 3 capas:

```
routes/         → solo define qué URL dispara qué acción
controllers/    → lógica de negocio: validaciones, manejo de sesión, respuestas
models/         → llamadas puras a Supabase, sin saber nada de req/res
lib/            → utilidades (cliente de Supabase, diccionario de mensajes)
middlewares/    → CSRF y rate limiting, propios del proyecto
views/          → plantillas Handlebars
public/         → CSS y JavaScript del navegador
```

## Decisiones de diseño destacables

- **El formato del torneo es un dato, no código fijo.** Hoy eFootball solo permite eliminación directa; si el juego agrega otro formato, se suma como una fila nueva en la tabla `formatos`, sin tocar el código.
- **Los mensajes al usuario se gestionan en el navegador, no en el servidor.** El backend solo manda un código corto por la URL (ej. `?flash=created_tournament`); el navegador lo traduce a texto legible con `fetch()`, manteniendo la lógica de presentación separada de la de negocio.
- **La visibilidad del link de coordinación se calcula en el controlador**, no con una política de RLS compleja: solo se envía al navegador si la persona está inscrita o es el host.

## Seguridad implementada

- Row Level Security en todas las tablas con datos sensibles
- Protección CSRF en todos los formularios (`POST`)
- Rate limiting en la creación de torneos
- Cookies de sesión seguras en producción (`secure: true`, condicionado a `NODE_ENV`)
- Variables sensibles fuera del control de versiones (`.env` en `.gitignore`)

## Cómo correrlo localmente

1. Clonar el repositorio
2. `npm install`
3. Copiar `.env.example` a `.env` y completar las variables (ver abajo)
4. Correr el schema SQL en tu propio proyecto de Supabase
5. Configurar el proveedor de Discord en Supabase Authentication, con tu propia app de Discord Developer Portal
6. `npm run dev`

## Variables de entorno

| Variable | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto de Supabase |
| `SUPABASE_ANON_KEY` | Clave pública (anon) de Supabase |
| `SESSION_SECRET` | Clave random para firmar las cookies de sesión |
| `APP_URL` | URL base de la app (usada para el callback de OAuth) |
| `NODE_ENV` | `development` o `production` |
| `TZ` | Zona horaria del servidor (ej. `America/Santiago`) |
| `PORT` | Puerto local (opcional, Render lo asigna solo) |

## Autor

Daniel Schnettler | JavaScript Fullstack Developer