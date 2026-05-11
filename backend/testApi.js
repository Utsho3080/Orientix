const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/crm/upload',
  method: 'POST',
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log('RESPONSE:', data));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.end();
