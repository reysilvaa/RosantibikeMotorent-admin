// Konfigurasi PM2 untuk admin-frontend - format CommonJS
/* eslint-disable no-undef */
/** @type {import('pm2').Payload} */
module.exports = {
  apps: [
    {
      name: 'admin-frontend',
      script: 'pnpm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
}; 