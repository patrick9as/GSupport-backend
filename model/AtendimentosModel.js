const sql = require('../db.js');

async function qryAtendimentos(req) {
    let sqlQueryResult, retQueryResult;
    let {
        Codigo = null,
        PageNumber = null,
        Rows = null,
        Texto = null,
        Assunto = null,
        DataInicio = null,
        DataFim = null,
        Sistema = null,
        MeioComunicacao = null,
        Usuario = null,
        Plantao = null
    } = req.body;

    if (DataInicio != null) DataInicio = `'${DataInicio}'`;
    if (DataFim != null) DataFim = `'${DataFim}'`;

    sqlQueryResult = `SELECT * FROM sup.getAtendimentos(`
    sqlQueryResult += `${Codigo}, ${PageNumber}, ${Rows}, ${Texto}, ${Assunto}, ${DataInicio}, ${DataFim}, ${Sistema}, ${MeioComunicacao}, ${Usuario}, ${Plantao})`;
    
    retQueryResult = await sql.query( sqlQueryResult );
    return retQueryResult.recordset;
    
}

async function qryTotal(req) {
    let sqlQueryTotal, retQueryTotal;
    let {
        Codigo = null,
        PageNumber = null,
        Rows = null,
        Texto = null,
        Assunto = null,
        DataInicio = null,
        DataFim = null,
        Sistema = null,
        MeioComunicacao = null,
        Usuario = null,
        Plantao = null
    } = req.body;

    if (DataInicio != null) DataInicio = `'${DataInicio}'`;
    if (DataFim != null) DataFim = `'${DataFim}'`;

    sqlQueryTotal = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`
    sqlQueryTotal += `${Codigo}, 1, NULL, ${Texto}, ${Assunto}, ${DataInicio}, ${DataFim}, ${Sistema}, ${MeioComunicacao}, ${Usuario}, ${Plantao})`;

    retQueryTotal = await sql.query( sqlQueryTotal );
    return retQueryTotal.recordset[0].Total;
} 

module.exports = {
    qryAtendimentos,
    qryTotal
}