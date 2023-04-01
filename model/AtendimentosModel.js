const sql = require('../db.js');

function setTextoSQL(texto) {
    if (texto == null || texto == undefined)
        texto = `'%%'`;
    else
        texto = `'${texto}'`;
    return texto;
}

function setDataSQL(data) {
    if (data == null || data == undefined) {
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2);
        const dia = ('0' + dataAtual.getDate()).slice(-2);
        data = `'${dia}/${mes}/${ano}'`;
    }
    else
        data = `'${data}'`;

    return data;
}

function validarParametro(field) {
    if (field == null || field == undefined)
        return false;
    else
        return true;
}

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
    
    if (! validarParametro(PageNumber)) PageNumber = 1;
    if (! validarParametro(Rows)) Rows = await qryTotal(req);
    if (! validarParametro(Plantao)) Plantao = 0;

    sqlQueryResult = `SELECT * FROM sup.getAtendimentos(`
    sqlQueryResult += `${setTextoSQL(Codigo)}, ${PageNumber}, `;
    sqlQueryResult += `${Rows}, ${setTextoSQL(Texto)}, ${setTextoSQL(Assunto)}, `;
    sqlQueryResult += `${setDataSQL(DataInicio)}, ${setDataSQL(DataFim)}, ${setTextoSQL(Sistema)}, `;
    sqlQueryResult += `${setTextoSQL(MeioComunicacao)}, ${setTextoSQL(Usuario)}, `;
    sqlQueryResult += `${Plantao})`;

    //console.log(sqlQueryResult);
    retQueryResult = await sql.query( sqlQueryResult );
    return retQueryResult.recordset;
    
}

async function qryTotal(req) {
    let sqlQueryTotal, retQueryTotal;
    let {
        Codigo = null,
        Texto = null,
        Assunto = null,
        DataInicio = null,
        DataFim = null,
        Sistema = null,
        MeioComunicacao = null,
        Usuario = null,
        Plantao = null
    } = req.body;

    if (! validarParametro(Plantao)) Plantao = 0;

    sqlQueryTotal = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`;
    sqlQueryTotal += `${setTextoSQL(Codigo)}, 1, (SELECT COUNT(Codigo) FROM sup.atendimentos), `;
    sqlQueryTotal += `${setTextoSQL(Texto)}, ${setTextoSQL(Assunto)}, ${setDataSQL(DataInicio)}, ${setDataSQL(DataFim)}, `;
    sqlQueryTotal += `${setTextoSQL(Sistema)}, ${setTextoSQL(MeioComunicacao)}, ${setTextoSQL(Usuario)}, ${Plantao})`;

    retQueryTotal = await sql.query( sqlQueryTotal );
    return retQueryTotal.recordset[0].Total;
} 

module.exports = {
    qryAtendimentos,
    qryTotal
}