module.exports = {
  apps : [{
    name: "heydaddy-back",
    script: "./server.js",
env: {
      NODE_ENV: "production"
    },
    autorestart: true,
  },
{
    name: "heydaddy-cron",
    script: "./bree.js",
    autorestart: true
  }]
}
