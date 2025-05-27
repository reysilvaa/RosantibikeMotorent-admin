// Konfigurasi PM2 untuk admin-frontend - format CommonJS
module.exports = {
  apps: [
    {
      name: 'admin-frontend',
      script: 'pnpm',
      args: 'start',
      cwd: './',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}; 