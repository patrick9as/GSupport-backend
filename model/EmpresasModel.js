const sql = require('../db.js');

async function qryEmpresas(obj) {
    let script, retorno;

    script = 'SELECT * FROM sup.empresas e';
    script += `\nWHERE Codigo LIKE ${obj.Codigo}`;
    script += `\nAND CodExterno LIKE ${obj.CodExterno}`;
    script += `\nAND NomeFantasia LIKE ${obj.NomeFantasia}`;
    script += `\nAND RazaoSocial LIKE ${obj.RazaoSocial}`;
    script += `\nAND CNPJ LIKE ${obj.CNPJ}`;
    script += `\nAND Endereco LIKE ${obj.Endereco}`;
    script += `\nAND Numero LIKE ${obj.Numero}`;
    script += `\nAND Bairro LIKE ${obj.Bairro}`;
    script += `\nAND Cidade LIKE ${obj.Cidade}`;
    script += `\nAND UF LIKE ${obj.UF}`;
    script += `\nAND Ativo = ${obj.Ativo}`;
    script += `\nAND CodCategoria LIKE ${obj.CodCategoria}`;

    //ORDER BY
    script += `\n${obj.OrderBy}`;

    console.log('\n-----script da consulta de empresas:-----\n' + script)
    const startTime = new Date().getTime();

    retorno = await sql.query(script);

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script da consulta de empresas executado em ${executionTime / 1000} segundos`);

    return retorno.recordset;
}

module.exports = {
    qryEmpresas
}