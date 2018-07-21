const fs = require('fs');

module.exports = {
  useTunnel: false,
  tunnel: {
    username: '',
    host: '',
    port: 0,
    privateKey: fs.readFileSync(''),
    dstHost: '',
    dstPort: 0,
    localPort: 0,
    keepAlive: true,
  },
};
