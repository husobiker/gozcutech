module.exports = {
  apps: [
    {
      name: "gozcu-yazilim",
      script: "./backend/server.js",
      cwd: "/var/www/gozcutech",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3012,
        JWT_SECRET:
          process.env.JWT_SECRET ||
          "gozcu-super-secure-secret-key-2024-change-in-production",
      },
      error_file: "/var/log/pm2/gozcu-yazilim-error.log",
      out_file: "/var/log/pm2/gozcu-yazilim-out.log",
      log_file: "/var/log/pm2/gozcu-yazilim.log",
      time: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
    },
    // Not: Frontend static site Nginx ile serve ediliyor, PM2'ye gerek yok
    // Eğer Vite preview server kullanmak istersen:
    // {
    //   name: 'gozcu-frontend',
    //   script: 'npm',
    //   args: 'run preview',
    //   cwd: '/var/www/gozcutech',
    //   env: {
    //     NODE_ENV: 'production',
    //     PORT: 3006
    //   },
    //   error_file: '/var/log/pm2/gozcu-frontend-error.log',
    //   out_file: '/var/log/pm2/gozcu-frontend-out.log',
    //   log_file: '/var/log/pm2/gozcu-frontend.log',
    //   time: true,
    //   autorestart: true,
    //   watch: false
    // }
  ],
};
