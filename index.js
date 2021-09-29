'use strict';

require('dotenv').config();

const { db } = require('./src/models');

db.sync().then(() => {
// Start the web server
require('./src/server').start(process.env.PORT);
});