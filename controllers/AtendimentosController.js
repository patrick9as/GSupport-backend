const { FormatDate } = require('../helper');
const sql = require('../db.js');


function Consultar(req, res) {
    let query;
    let { datainicio, datafim } = req.query;
    
    if (req.query.datainicio == '' || req.query.datainicio == undefined)
        datainicio = new Date().toLocaleDateString('pt-BR')
    else
        datainicio = FormatDate(datainicio);

    if (req.query.datafim == '' || req.query.datafim == undefined)
        datafim = new Date().toLocaleDateString('pt-BR');
    else
        datafim = FormatDate(datafim);

    query = 'SELECT sa.* FROM sup_atendimentos sa';
    query += '\nINNER JOIN sup_usuarios su';
    query += '\nON sa.CodUsuario = su.Codigo';
    query += `\nWHERE DataHora BETWEEN dbo.converterData('${datainicio}') AND dbo.ConverterDataHora('${datafim} 23:59:59')`;
    query += '\nORDER BY Codigo DESC';

    sql.query(query, (err, result) => {
        if (err) console.log(err);
        res.status(200).send(JSON.stringify(result.recordset));
    });
}

function Inserir(req, res) {
    let { CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle } = req.body;
    let query;

    query = 'INSERT INTO sup_atendimentos(CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle)';
    query += `\nVALUES (${CodUsuario}, '${NomeUsuario}', ${CodEmpresa}, '${Nome}', '${Empresa}', '${TipoPessoa}', '${Problema}', '${Solucao}', '${Sistema}', '${TipoChamado}', dbo.ConverterDataHora('${DataHora}'), dbo.ConverterDataHora('${DataHoraFim}'), dbo.ConverterDataHora('${DataHoraLancamento}'), '${Categoria}', '${SubCategoria}', ${Plantao}, ${Privado}, ${Ticket}, ${Analise}, '${Status}', ${Terminal}, '${Controle}')`;

    sql.query(query, (err, result) => {
        if (err) console.log(err);
        res.status(201).send('OK!');
    });
}

function Atualizar(req, res) {
    let { Codigo, CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle } = req.body;

    query = 'UPDATE sup_atendimentos';
    query += `\nSET CodUsuario = ${CodUsuario},`;
    query += `\nNomeUsuario = '${NomeUsuario}',`;
    query += `\nCodEmpresa = ${CodEmpresa},`;
    query += `\nNome = '${Nome}',`;
    query += `\nEmpresa = '${Empresa}',`;
    query += `\nTipoPessoa = '${TipoPessoa}',`;
    query += `\nProblema = '${Problema}',`;
    query += `\nSolucao = '${Solucao}',`;
    query += `\nSistema = '${Sistema}',`;
    query += `\nTipoChamado = '${TipoChamado}',`;
    query += `\nDataHora = dbo.ConverterDataHora('${DataHora}'),`;
    query += `\nDataHoraFim = dbo.ConverterDataHora('${DataHoraFim}'),`;
    query += `\nDataHoraLancamento = dbo.ConverterDataHora('${DataHoraLancamento}'),`;
    query += `\nCategoria = '${Categoria}',`;
    query += `\nSubCategoria = '${SubCategoria}',`;
    query += `\nPlantao = '${Plantao}',`;
    query += `\nPrivado = '${Privado}',`;
    query += `\nTicket = '${Ticket}',`;
    query += `\nAnalise = '${Analise}',`;
    query += `\nStatus = '${Status}',`;
    query += `\nTerminal = '${Terminal}',`;
    query += `\nControle = '${Controle}'`;
    query += `\nWHERE Codigo = ${Codigo}`;

    sql.query(query, (err, result) => {
        if (err) console.log(err);
        res.status(202).send('OK');
    });
}

module.exports = { Consultar, Inserir, Atualizar }