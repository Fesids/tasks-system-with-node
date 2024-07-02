const mysql = require('mysql2');

const poolOptions = {
    host: "localhost",
    port: 3306,
    database: "node_db",
    user: "root",
    password: "67890000"
};


const MySQLConfig = mysql.createPool(poolOptions);


module.exports = MySQLConfig;