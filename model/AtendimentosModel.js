const sql = require('../db.js');

async function qryAtendimentos(obj) {
    let sqlQueryResult, retQueryResult;

    sqlQueryResult = `SELECT * FROM sup.getAtendimentos(`
    sqlQueryResult += `${obj.Codigo}, ${obj.PageNumber}, `;
    sqlQueryResult += `${obj.Rows}, ${obj.Texto}, ${obj.Assunto}, `;
    sqlQueryResult += `${obj.DataInicio}, ${obj.DataFim}, ${obj.Sistema}, `;
    sqlQueryResult += `${obj.MeioComunicacao}, ${obj.Usuario}, `;
    sqlQueryResult += `${obj.Plantao})`;

    retQueryResult = await sql.query( sqlQueryResult );
    return retQueryResult.recordset;
}

async function qryTotal(obj) {
    let sqlQueryTotal, retQueryTotal;

    sqlQueryTotal = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`;
    sqlQueryTotal += `${obj.Codigo}, 1, (SELECT COUNT(Codigo) FROM sup.atendimentos), `;
    sqlQueryTotal += `${obj.Texto}, ${obj.Assunto}, ${obj.DataInicio}, ${obj.DataFim}, `;
    sqlQueryTotal += `${obj.Sistema}, ${obj.MeioComunicacao}, ${obj.Usuario}, ${obj.Plantao})`;

    console.log(sqlQueryTotal);
    retQueryTotal = await sql.query( sqlQueryTotal );
    return retQueryTotal.recordset[0].Total;
} 

module.exports = {
    qryAtendimentos,
    qryTotal
}