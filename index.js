const server = require('./api/server');
require('dotenv').config()

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`\n*** API on port ${port} ***\n`)
});