# Conector de X para Pixel & Popcorn

Este proyecto ya tiene preparada una cola en `data/x-posts.json` y un publicador en `scripts/publish-x-posts.js`.

## Pasos

1. Entra en el portal de desarrolladores de X y crea una app para Pixel & Popcorn.
2. Configura la app como automatizacion/bot o aplicacion web confidencial.
3. Activa permisos de escritura. Para publicar posts se usa `POST /2/tweets`.
4. Genera credenciales de usuario con permiso de publicacion.
5. Guarda las credenciales como variables de entorno, nunca dentro del codigo.

Opcion A, OAuth 2.0 User Context:

```powershell
$env:X_USER_ACCESS_TOKEN="TU_TOKEN_DE_USUARIO"
```

El token debe ser de usuario y tener permiso `tweet.write`.

Opcion B, OAuth 1.0a User Context:

```powershell
$env:X_API_KEY="TU_API_KEY"
$env:X_API_SECRET="TU_API_SECRET"
$env:X_ACCESS_TOKEN="TU_ACCESS_TOKEN"
$env:X_ACCESS_TOKEN_SECRET="TU_ACCESS_TOKEN_SECRET"
```

El `Access Token` de OAuth 1.0a no basta por si solo: tambien hace falta el `Access Token Secret`, ademas de la API Key y API Secret.

6. Prueba primero sin publicar:

```powershell
$env:X_DRY_RUN="1"
node scripts/publish-x-posts.js
```

7. Publica cuando el token este listo:

```powershell
$env:X_DRY_RUN="0"
node scripts/publish-x-posts.js
```

## Estados de la cola

- `pending_credentials`: post listo, falta token de X.
- `ready_dry_run`: prueba realizada sin publicar.
- `posted`: publicado correctamente.
- `error`: X rechazo la publicacion; revisar `lastError`.

## Importante

No guardes claves, secretos ni tokens en el repositorio. Usa variables de entorno o el gestor seguro que prefieras.
