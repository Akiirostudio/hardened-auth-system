const fs = require('fs');
const path = require('path');

module.exports = function log(event, username, ip) {
    const line = `${new Date().toISOString()} [${event}] user=${username} ip=${ip}\n`;
    fs.appendFileSync(path.join(__dirname, '../logs/audit.log'), line);
};
