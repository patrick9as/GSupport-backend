const sql = require('../db.js');

async function qryValidarUsuario (obj) {
let script = `SELECT * FROM sup.usuarios`;
    script += `\nWHERE Usuario = '${obj.Usuario}' AND Senha = '${obj.Senha}'`;

    console.log('\n-----script da validação de usuário-----\n' + script);
    const retorno = await sql.query(script);
    
    return retorno;
}

module.exports = {
    qryValidarUsuario
}