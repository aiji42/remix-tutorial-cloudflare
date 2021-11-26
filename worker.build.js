/* package.json
"scripts": {
  "build:worker": "NODE_ENV=production node worker.build.js",
  "dev:worker": "node worker.build.js",
  "start": "miniflare --build-command \"npm run dev:worker\" --watch"
}
*/

// worker.build.js
const alias = require('esbuild-plugin-alias');

require('esbuild')
  .build({
    entryPoints: ['./worker'],
    bundle: true,
    sourcemap: true,
    outdir: 'dist',
    define: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV ?? 'development'}"`,
    },
    plugins: [
      alias({
        '@prisma/client': require.resolve('@prisma/client'),
      }),
    ],
  })
  .catch(() => process.exit(1));