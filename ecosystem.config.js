module.exports = {
  apps: [
    {
      name: 'garage-backend',
      script: './server.js',
      cwd: './backend',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
    }
  ],
};
