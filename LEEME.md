# Diario del bebé 2.0 · Netlify

App web instalable en el iPhone (sin App Store) que comparte en tiempo real lo que apuntáis los dos.

- **Web**: `public/` (la app, el icono y el modo sin conexión).
- **Servidor**: `netlify/functions/api.mjs`, una sola función que guarda los datos en **Netlify Blobs**, el almacenamiento incluido en Netlify. No hay base de datos que crear ni mantener.
- **Acceso**: un código compartido que solo sabéis los dos, guardado como variable de entorno en Netlify (nunca en el código).

## 1. Desplegar en Netlify

Elige una de las dos formas. Arrastrar la carpeta a «Netlify Drop» **no sirve**, porque así no se publica la función.

### Opción A: desde GitHub (recomendada)

1. Sube el contenido de esta carpeta a tu repositorio `diario-bebe` (no contiene datos ni el código de acceso).
2. En Netlify: **Add new site → Import an existing project → GitHub** y elige `diario-bebe`.
3. Netlify lee `netlify.toml` y lo configura todo solo. Pulsa **Deploy**.

Cada vez que subas un cambio al repositorio, Netlify vuelve a publicar.

### Opción B: con la CLI desde tu servidor Linux

```bash
cd diario-bebe-netlify
npm install
npx netlify-cli login
npx netlify-cli init            # crea el sitio la primera vez
npx netlify-cli deploy --prod
```

## 2. Poner el código de acceso

En Netlify: **Site configuration → Environment variables → Add a variable**

- Key: `ACCESS_CODE`
- Value: una frase que solo sepáis los dos, por ejemplo `lucia-duerme-poco-2026`

Después haz **Deploys → Trigger deploy** para que la función lo lea.
Si se os olvida o queréis cambiarlo, cámbialo aquí: los móviles pedirán el nuevo al abrir.

## 3. Instalar en cada iPhone

1. Abre la dirección del sitio (por ejemplo `https://diario-bebe.netlify.app`) en **Safari**.
2. Escribe tu nombre («Mamá», «Papá»…) y el código.
3. Compartir → «Añadir a pantalla de inicio» y ábrela siempre desde el icono.

## Cómo se comporta

| Situación | Qué pasa |
| --- | --- |
| Uno apunta algo | El otro lo ve en unos 8 segundos con la app abierta, o nada más abrirla |
| Sin cobertura | Se apunta igual; se envía al volver la conexión («Sin conexión · N cambios por enviar») |
| Los dos guardan a la vez | No se pierde nada: el servidor reintenta hasta guardar los dos cambios |
| Los dos editan el mismo registro | Gana el último cambio |
| Cambio de móvil | Entras con el código y se descargan todos los datos |

La app solo pregunta al servidor mientras está en pantalla, así que el consumo del plan gratuito de Netlify es muy bajo.

## Actualizar la app

1. Edita `src/app.html`.
2. Ejecuta `python3 build.py`, que genera `public/index.html`.
3. Cambia `diario-bebe-v2` por `diario-bebe-v3` en `public/sw.js`.
4. Despliega.

Los datos no se tocan, porque viven en Netlify Blobs.

## Ver o descargar los datos

- En la app: Perfil → «Exportar copia».
- En Netlify: **Blobs → diario-bebe → data** (un JSON con todo).
