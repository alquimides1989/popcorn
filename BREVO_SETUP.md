# Newsletter BluePoint con Brevo

La web ya tiene el formulario y la funcion segura para crear contactos en Brevo.

## Variables necesarias

Configura estas variables en Netlify:

- `BREVO_API_KEY`: clave API de Brevo.
- `BREVO_LIST_ID`: id numerico de la lista donde entraran los suscriptores.

Variables opcionales:

- `NEWSLETTER_ALLOWED_ORIGIN`: dominio publico de BluePoint, por ejemplo `https://tudominio.com`.
- `BREVO_SOURCE_ATTRIBUTE`: nombre de un atributo de contacto en Brevo para guardar la procedencia.
- `BREVO_SEGMENTS_ATTRIBUTE`: nombre de un atributo de contacto en Brevo para guardar intereses como `PS Plus` u `Ofertas`.

## Importante

No pongas la clave de Brevo en `newsletter.js` ni en ningun archivo publico. La clave debe vivir solo como variable privada del hosting.

## Netlify

En Netlify ve a:

`Site configuration > Environment variables`

Añade:

- `BREVO_API_KEY`
- `BREVO_LIST_ID`

El archivo `netlify.toml` envia las peticiones de `/api/brevo-subscribe` a la funcion segura `netlify/functions/brevo-subscribe.js`.

Despues de guardar las variables, haz un redeploy de la web.

Si tienes activado el bloqueo de IPs en Brevo, puede fallar en Netlify porque las funciones no siempre usan una IP fija. Para Netlify, lo mas sencillo es permitir llamadas API sin lista de IPs autorizadas o usar un servidor con IP fija.
