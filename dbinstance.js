const mysql = require('mysql');
const fs = require('fs');

let rawdata = fs.readFileSync('config.json');
let db_config = JSON.parse(rawdata).db_config;

const pool = mysql.createPool(db_config);

module.exports = pool;