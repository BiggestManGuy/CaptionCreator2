const path = require('path');
const argv = require('./argv');
const port = require('./port');

// import .env variables
require('dotenv-safe').load({
  path: path.join(__dirname, './.env'),
  sample: path.join(__dirname, './.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  isDev: process.env.NODE_ENV !== 'production',
  // get the intended host and port number, use localhost and port 3000 if not provided
  // Let http.Server use its default IPv6/4 host
  host: argv.host || process.env.HOST || null,
  port,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
