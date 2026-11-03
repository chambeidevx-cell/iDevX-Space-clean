import { readFileSync } from 'node:fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const { version, buildNumber } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

/**
 * iDevX Space's version is four places — `v3.5.2.4`.
 *
 * The first three are the release, and stay in `package.json` where npm can
 * read them: a fourth segment there is not valid semver and the tooling would
 * reject it. The fourth is the build of that release, kept beside it as
 * `buildNumber`, so two builds of the same release can be told apart when one
 * of them is the one misbehaving.
 */
const appVersion = `${version}.${buildNumber ?? 0}`;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = parseInt(env.VITE_PORT) || 5173;

  return {
    define: {
      __APP_VERSION__: JSON.stringify(appVersion),
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: port,
    },
  };
});
