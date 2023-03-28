const { FormatDate } = require('../helper');
const sql = require('../db.js');


function Consultar(req, res) {
    let query;
    // let { DataInicio, DataFim } = req.query;
    let { Codigo, PageNumber, Rows, Texto, Usuario, Categoria, Sistema, Plantao, DataInicio, DataFim} = req.body;
    
    if (DataInicio == '' || DataInicio == undefined)
        DataInicio = new Date().toLocaleDateString('pt-BR')
    else
        DataInicio = FormatDate(DataInicio);

    if (DataFim == '' || DataFim == undefined)
        DataFim = new Date().toLocaleDateString('pt-BR');
    else
        DataFim = FormatDate(DataFim);

    query =  'DECLARE';
    query += '\n@PageNumber INT,';
    query += '\n@Rows INT,';
    query += '\n@Texto VARCHAR(MAX),';
    query += '\n@Categoria VARCHAR(MAX),';
    query += '\n@DataInicio DATETIME,';
    query += '\n@DataFim DATETIME,';
    query += '\n@Sistema VARCHAR(MAX),';
    query += '\n@Usuario VARCHAR(MAX);';
    query += '\n';
    if (PageNumber != undefined || Rows != undefined) {     
        query += `\n  SET @PageNumber = ${PageNumber};`;
        query += `\n  SET @Rows = ${Rows};`;
    }
    if (Texto == undefined) 
        query += `\n  SET @Texto = '%%';`;
    else
        query += `\n  SET @Texto = '%${Texto}%';`;
    if (Usuario == undefined) 
        query += `\n  SET @Usuario = '%%';`;
    else
        query += `\n  SET @Usuario = '%${Usuario}%';`;
    if (Categoria == undefined) 
        query += `\n  SET @Categoria = '%%';`;
    else
        query += `\n  SET @Categoria = '%${Categoria}%';`;
        if (Sistema == undefined) 
        query += `\n  SET @Sistema = '%%';`;
    else
        query += `\n  SET @Sistema = '%${Sistema}%';`;
    query += `\n  SET @DataInicio = dbo.converterData('${DataInicio}');`;
    query += `\n  SET @DataFim = dbo.converterDataHora('${DataFim}' + ' 23:59:59');`;
    query += '\n';
    query += '\nSELECT sa.* FROM sup_atendimentos sa';
    // query += '\nINNER JOIN sup_usuarios su';
    // query += '\nON sa.CodUsuario = su.Codigo';
    query += '\nWHERE (';
    query += `\n    ISNULL(sa.Empresa, '') LIKE @Texto`;
    query += `\n OR ISNULL(sa.Nome,'') LIKE @Texto`;
    query += `\n OR ISNULL(sa.Codigo,'') LIKE @Texto)`;
    query += `\nAND DataHora BETWEEN @DataInicio AND @DataFim`;
    if (Plantao != undefined) 
        query += `\nAND sa.Plantao = ${Plantao}`;
    query += `\nAND ISNULL(sa.NomeUsuario, '') LIKE @Usuario`;
    if (Codigo != undefined && Codigo != '')
        query += `\nAND sa.Codigo = ${Codigo}`;
    query += `\nORDER BY sa.Codigo DESC`; 
    if (PageNumber != undefined || Rows != undefined) {            
        query += `\nOFFSET (@PageNumber - 1) * @Rows`;    
        query += `\nROWS FETCH NEXT @Rows ROWS ONLY`;
    }

    console.log(req.body);
    console.log(query);

    sql.query(query, (err, result) => {
        if (err) console.log(err);
        res.status(200).send(JSON.stringify({"Total": result.recordset.length, Result: result.recordset }));
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