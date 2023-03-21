const sql = require('mssql');

const config = {
    user: process.env.USER,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    database: process.env.DATABASE,
    trustServerCertificate: true
};

sql.connect(config, (err) => {
    if (err) console.log(`Erro ao conectar ao banco de dados: ${err}`);
});

module.exports = sql;