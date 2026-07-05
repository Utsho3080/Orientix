const db = require('./db');
db.query("UPDATE users SET totp_secret = NULL WHERE email = 'founder.orientix@gmail.com'")
  .then(() => {
    console.log('Reset successful');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
