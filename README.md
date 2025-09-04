
# Pasión-Uruguay — Fullstack Starter (Netlify Functions + Neon + MercadoPago)

**Propósito:** Repo listo para subir a GitHub y desplegar en Netlify. Incluye un frontend estático y funciones serverless (Node) para registro, login, perfiles y pagos (MercadoPago).  
**Advertencia legal:** Este proyecto es un ejemplo técnico que incluye contenido para adultos. No publiques datos reales sin cumplir la legislación local y normas de privacidad.


## Estructura del repo

```
pasion-uruguay-repo/
├─ index.html
├─ login.html
├─ profile.html
├─ publicar.html
├─ profiles/*.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/auth-client.js
│  ├─ js/profile-client.js
│  └─ js/app-client.js
├─ netlify/
│  └─ functions/
│      ├─ package.json
│      ├─ register.js
│      ├─ login.js
│      ├─ get-profile.js
│      ├─ update-profile.js
│      ├─ create-payment.js
│      └─ mercadopago-webhook.js
├─ migrations.sql
├─ netlify.toml
└─ README.md
```

---

## Pasos rápidos para subir a GitHub y desplegar en Netlify (recomendado)

1. **Cloná o descargá este repo** (descargá el ZIP adjunto y descomprimilo).
2. **Crear un repo nuevo** en GitHub y subí todos los archivos (puedes usar GitHub Desktop o `git` en tu terminal):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - pasion uruguay starter"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```
3. **Crear la base de datos en Neon** (https://neon.tech) y copiar `DATABASE_URL` (Postgres connection string).
4. **Ejecutar migraciones** en Neon (usá la consola de Neon o `psql`):
   ```bash
   psql "$DATABASE_URL" -f migrations.sql
   ```
5. **Conectar Netlify** con tu repo en GitHub:
   - En Netlify: *New site from Git* → conectá tu GitHub → seleccioná el repo.
   - En *Site settings → Build & deploy → Environment*, agregá las variables:
     - `DATABASE_URL` = tu Neon connection string
     - `JWT_SECRET` = una cadena secreta larga
     - `MP_ACCESS_TOKEN` = tu token de MercadoPago (sandbox o producción)
     - `MP_BACK_URL_SUCCESS` y `MP_BACK_URL_FAILURE` (opcional)
6. Netlify detectará las funciones en `netlify/functions` y hará `npm install` allí automáticamente. El deploy finalizará y tendrás tu dominio `*.netlify.app`.

---

## Notas técnicas y recomendaciones

- **Dependencias de funciones:** `netlify/functions/package.json` contiene `pg`, `bcryptjs`, `jsonwebtoken`, `node-fetch`. Netlify instalará estas dependencias durante build.  
- **Subida de imágenes:** este starter no implementa almacenamiento de imágenes. Para subir fotos en producción usa Cloudinary o S3 y guarda las URLs en la DB.  
- **Seguridad:** no dejes `DATABASE_URL` ni `MP_ACCESS_TOKEN` en repositorios públicos. Usa repo privado o secretos en Netlify. Añadí verificación de email y validaciones servidor-side antes de producción.  
- **MercadoPago:** la integración aquí crea preferencias y espera un webhook. Asegurate de configurar correctamente las URLs de webhook y validar los eventos con la API de MercadoPago.

---

Si preferís, puedo:
- Generar un `README` más corto para la landing de GitHub (lo puedo dejar en `README.md` como está).  
- Añadir plantillas para issues o PR en `.github/` (p. ej. ISSUE_TEMPLATE).

