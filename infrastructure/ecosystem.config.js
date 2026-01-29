module.exports = {
  apps: [
    {
      name: 'test-agency-backend',
      cwd: '/home/ubuntu/test-agency/backend',
      script: 'dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/home/ubuntu/logs/backend-error.log',
      out_file: '/home/ubuntu/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
    {
      name: 'test-agency-frontend',
      cwd: '/home/ubuntu/test-agency/frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      error_file: '/home/ubuntu/logs/frontend-error.log',
      out_file: '/home/ubuntu/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
