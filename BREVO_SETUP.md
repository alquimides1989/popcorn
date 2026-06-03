# Newsletter BluePoint con Brevo

La web ya tiene el formulario y la funcion segura para crear contactos en Brevo.

## Variables necesarias

Configura estas variables en el hosting que ejecute la funcion `api/brevo-subscribe.js`:

- `BREVO_API_KEY`: clave API de Brevo.
- `BREVO_LIST_ID`: id numerico de la lista donde entraran los suscriptores.

Variables opcionales:

- `NEWSLETTER_ALLOWED_ORIGIN`: dominio publico de BluePoint, por ejemplo `https://tudominio.com`.
- `BREVO_SOURCE_ATTRIBUTE`: nombre de un atributo de contacto en Brevo para guardar la procedencia.
- `BREVO_SEGMENTS_ATTRIBUTE`: nombre de un atributo de contacto en Brevo para guardar intereses como `PS Plus` u `Ofertas`.

## Importante

No pongas la clave de Brevo en `newsletter.js` ni en ningun archivo publico. La clave debe vivir solo como variable privada del hosting.

Si publicas solo con GitHub Pages, el formulario se vera pero no podra guardar correos porque GitHub Pages no ejecuta funciones backend. Para activarlo, usa Vercel, Netlify, Cloudflare Pages Functions o un pequeno servidor Node.
