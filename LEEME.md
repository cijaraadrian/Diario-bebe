# Diario del bebé 3.0 · Netlify

App web instalable en el iPhone (sin App Store) para varias familias. Cada familia es una cuenta con sus usuarios y sus bebés. El sueño es gratis y el resto son módulos de pago que activa el superadministrador desde `/admin`.

- **Web**: `public/index.html`, generado desde `src/` con `python3 build.py`.
- **Servidor**: `netlify/functions/api.mjs` (entrada) y `netlify/lib/core.mjs` (lógica). Los datos se guardan en **Netlify Blobs**, sin base de datos externa.
- **Pruebas separadas**: producción usa el almacén `diario-bebe`. Los Deploy Previews y las ramas usan `diario-bebe-pruebas`, así que nunca escriben en los datos reales.

## Variables de entorno en Netlify

En **Project configuration → Environment variables**, para todos los contextos:

| Variable | Para qué |
| --- | --- |
| `ADMIN_USER` | Tu usuario del panel `/admin` |
| `ADMIN_PASSWORD` | Tu contraseña del panel. Que sea larga |

`ACCESS_CODE` (el código compartido de la v2) ya no se usa y puedes borrarlo.

Después de añadir o cambiar variables, vuelve a desplegar (**Deploys → Trigger deploy**).

## Pasar de la v2 a la v3 (vuestros datos)

1. Añade `ADMIN_USER` y `ADMIN_PASSWORD`.
2. Publica la v3 (fusiona la rama en `main`).
3. Entra en `https://<tu-sitio>.netlify.app/admin`.
4. En «Datos de la versión anterior», pulsa **Migrar datos**. Se crea la cuenta «Casa» con vuestro bebé, todos los registros y todos los módulos para siempre. Antes se guarda una copia de los datos antiguos.
5. En la ficha de «Casa», crea vuestros dos usuarios: uno **Titular** y otro **Miembro**.
6. En cada iPhone, abre la app y entra con el usuario y la contraseña provisional. La primera vez se pide elegir una propia.

## Día a día del superadministrador (`/admin`)

- **Nueva familia**: crea la cuenta y su titular de una vez. Te da los datos para pasárselos.
- **Pagos pendientes**: cuando una familia pulsa «Ya he hecho el Bizum», aparece aquí. Confirma 1, 3 o 12 meses (o «para siempre» si es el pack) y se activa solo.
- **Ficha de cada familia**: activar módulos (+1 mes, +3, +12, prueba), quitar, pack «Todo para siempre», registrar un pago con otras fechas, usuarios, roles, contraseñas y ajustes por usuario.
- **Ajustes de venta**: tu número de Bizum, precios que se muestran y días de prueba.
- El panel **no muestra ningún dato de los bebés**.

## Módulos

| Módulo | Qué incluye |
| --- | --- |
| Sueño | Gratis: siestas, noche, despertares, línea del día |
| Tomas | Pecho con cronómetro, biberón |
| Comidas | Primeros alimentos |
| Pañales | Pis y caca |
| Salud | Vacunas, médico, medicación, temperatura |
| Notas | Notas fechadas |
| Análisis | Gráficas de 7, 14 y 30 días |
| Compartir en familia | Más usuarios en la cuenta (sin él solo entra el titular) |
| Varios bebés | Segundo bebé y siguientes |
| Baños | Baño con temperatura del agua |
| Próxima siesta | Predicción por edad y por cómo duerme |
| Crecimiento | Peso, talla y cabeza con percentiles de la OMS |
| Hitos y dientes | Hitos con foto y mapa de dientes |
| Informe para el pediatra | Resumen imprimible o en PDF |

El servidor comprueba los módulos en cada cambio: aunque alguien manipule la app, no puede guardar registros de un módulo que no tiene.

## Fuentes de datos de referencia

- Percentiles: patrones de crecimiento infantil de la OMS (0-2 años), tomados del paquete oficial `anthro` de la OMS (`src/who-lms.js`).
- Ventanas de vigilia para «Próxima siesta»: tablas orientativas publicadas por Napper y Taking Cara Babies.

## Actualizar la app

1. Edita `src/`.
2. Ejecuta `python3 build.py`.
3. Cambia el número de `CACHE` en `public/sw.js`.
4. Sube a GitHub: Netlify despliega solo.
