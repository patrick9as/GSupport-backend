const sql = require('mssql');

console.log(process.env.USER);
console.log(process.env.PASSWORD);
console.log(process.env.SERVER);
console.log(process.env.DATABASE);

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    trustServerCertificate: true
};

sql.connect(config, (err) => {
    if (err) console.log(err);
});

module.exports = sql;