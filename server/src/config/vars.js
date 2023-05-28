const path = require('path');
// import .env variables
require('dotenv').config();
console.log(`pott ----`, process.env.PORT)
module.exports = {
  encruptionKey: process.env.ENCRYPTION_KEY,
  port: process.env.PORT,
  frontEncSecret: process.env.FRONT_ENC_SECRET,
  url: process.env.URL,
  mongo: {
    uri: `mongodb+srv://MWA:<password>@cluster0.wfdtd4q.mongodb.net/?retryWrites=true&w=majority`,
  },
  pwEncruptionKey: process.env.PW_ENCRYPTION_KEY,
  pwdSaltRounds: process.env.PWD_SALT_ROUNDS,
};
