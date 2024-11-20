const mongoose = require('mongoose');


require('dotenv').config();
const { DB_HOST: urlDb } = process.env;
const connection = mongoose.connect(urlDb);

module.exports = connection;