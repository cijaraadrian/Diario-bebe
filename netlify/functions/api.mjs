// Diario del bebé v3 · función única de la API (/api/*).
// Producción usa el almacén "diario-bebe". Deploy previews y ramas usan "diario-bebe-pruebas",
// así que una versión de pruebas nunca escribe en los datos reales.
import { getStore } from '@netlify/blobs';
import { handle } from '../lib/core.mjs';

const PROD_STORE = 'diario-bebe';
const TEST_STORE = 'diario-bebe-pruebas';

export default async (req, context) => {
  const deployContext = context?.deploy?.context || '';
  const isProd = deployContext === 'production';
  const store = getStore({ name: isProd ? PROD_STORE : TEST_STORE, consistency: 'strong' });
  // Los datos de la versión anterior (v2) solo se leen, nunca se escriben.
  const legacyStore = getStore({ name: PROD_STORE, consistency: 'strong' });
  const env = {
    ADMIN_USER: globalThis.Netlify?.env?.get?.('ADMIN_USER') ?? process.env.ADMIN_USER,
    ADMIN_PASSWORD: globalThis.Netlify?.env?.get?.('ADMIN_PASSWORD') ?? process.env.ADMIN_PASSWORD,
  };
  return handle(req, { store, legacyStore, env, deployContext });
};

export const config = { path: '/api/*' };
