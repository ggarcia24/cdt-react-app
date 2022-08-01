const path = require('path');

module.exports = {
  consumer: 'cdt-react-app',
  cors: true,
  host: 'localhost',
  port: 8080,
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  loglevel: 'DEBUG',
  dir: path.resolve(process.cwd(), 'test/contract'),
};
