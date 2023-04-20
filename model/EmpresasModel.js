const sql = require('../db.js');

async function qryEmpresas(obj) {
    let script, retorno;

    script = 'SELECT * FROM sup.empresas e';
    script += `WHERE Codigo LIKE ${obj.Codigo}`;
    script += `AND CodExterno LIKE ${obj.CodExterno}`;
    script += `AND NomeFantasia LIKE ${obj.NomeFantasia}`;
    script += `AND RazaoSocial LIKE ${obj.RazaoSocial}`;
    script += `AND CNPJ LIKE ${obj.CNPJ}`;
    script += `AND Endereco LIKE ${obj.Endereco}`;
    script += `AND Numero LIKE ${obj.Numero}`;
    script += `AND Bairro LIKE ${obj.Bairro}`;
    script += `AND Cidade LIKE ${obj.Cidade}`;
    script += `AND UF LIKE ${obj.UF}`;
    script += `AND Ativo = ${obj.Ativo}`;
    script += `AND CodCategoria = ${obj.CodCategoria}`;

    console.log('\n-----script da consulta de empresas:-----\n' + script)
    const startTime = new Date().getTime();

    retorno = await sql.query(script);

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script da consulta de empresas executado em ${executionTime / 1000} segundos`);

    return retorno.recordset[0].Total;
}

module.exports = {
    qryEmpresas
}