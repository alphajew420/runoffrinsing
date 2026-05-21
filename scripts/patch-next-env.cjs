// Patch @next/env CJS import for Payload compatibility with Next.js 16.
// Payload's loadEnv does `require('@next/env').default.loadEnvConfig`, but
// @next/env from Next.js 16 has ESM/CJS interop issues during these scripts.
// Since env vars are already set (via the shell or Docker ENV), we mock
// loadEnvConfig as a no-op.
const Module = require('module')
const origLoad = Module._load
Module._load = function (request, parent, isMain) {
  if (request === '@next/env') {
    const mock = {
      loadEnvConfig: function () {
        return { combinedEnv: process.env, loadedEnvFiles: [] }
      },
    }
    mock.default = mock
    return mock
  }
  return origLoad.apply(this, arguments)
}
