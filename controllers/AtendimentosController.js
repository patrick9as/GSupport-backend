const { 
    convertImageToWebp, 
    generateUuidImage, 
    getExtension,
    validarParametro,
    setTextoSQL,
    setDataSQL
    } = require('../helper');
const { 
    qryAtendimentos,
    qryTotal,
    qryInsert,
    qryInsertImagem
    } = require('../model/AtendimentosModel');
const sql = require('../db.js');

async function Consultar(req, res) {
    let obj = {
        Codigo = null,
        PageNumber = null,
        Rows = null,
        Problema = null,
        Solucao = null,
        Assunto = null,
        DataInicio = null,
        DataFim = null,
        Sistema = null,
        MeioComunicacao = null,
        Usuario = null,
        Plantao = null
    } = req.body;

    obj.Codigo = setTextoSQL(obj.Codigo);
    obj.Problema = setTextoSQL(obj.Problema);
    obj.Solucao = setTextoSQL(obj.Solucao);
    obj.Assunto = setTextoSQL(obj.Assunto);
    obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
    obj.DataFim = `'${setDataSQL(obj.DataFim)} 23:59:59'`;
    obj.Sistema = setTextoSQL(obj.Sistema);
    obj.MeioComunicacao = setTextoSQL(obj.MeioComunicacao);
    obj.Usuario = setTextoSQL(obj.Usuario);
    if (! validarParametro(obj.PageNumber)) obj.PageNumber = 1;
    if (! validarParametro(obj.Plantao)) obj.Plantao = -1;
    if (! validarParametro(obj.Rows) || obj.Rows <= 0) obj.Rows = 5;

    const [resTotal, resAtendimento] = await Promise.all([qryTotal(obj), qryAtendimentos(obj)])
    res.status(200).send(JSON.stringify({ 'Total': resTotal, 'Result': resAtendimento} ));
}

async function Inserir(req, res) {
    let obj = {
        CodUsuario = null,
        CodEmpresa = null,
        NomeCliente = null,
        Problema = null,
        Solucao = null,
        Assunto = null,
        CodSistema = null,
        CodMeioComunicacao = null,
        DataCriacao = null,
        DataInicio = null,
        DataFim = null,
        Plantao = null
    } = JSON.parse(req.body.data);

    obj.CodUsuario = setTextoSQL(obj.CodUsuario);
    obj.CodEmpresa = setTextoSQL(obj.CodEmpresa);
    obj.NomeCliente = setTextoSQL(obj.NomeCliente);
    obj.Problema = setTextoSQL(obj.Problema);
    obj.Solucao = setTextoSQL(obj.Solucao);
    obj.Assunto = setTextoSQL(obj.Assunto);
    obj.CodSistema = setTextoSQL(obj.CodSistema);
    obj.CodMeioComunicacao = setTextoSQL(CodMeioComunicacao);
    obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`;
    obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
    obj.DataFim = `'${setDataSQL(obj.DataFim)} 23:59:59'`;
    if (! validarParametro(obj.Plantao)) obj.Plantao = 0;

    const file = req.file
    const imageName = generateUuidImage();
    const ext = getExtension(file.mimetype);

    const imageWebp = await convertImageToWebp(file.buffer);

    if (file != undefined) {
        const [resAtendimento, resImagem] = await Promise.all([qryInsert(obj), qryInsertImagem(imageName, ext, imageWebp, file)]);
        res.status(201).send({resAtendimento, resImagem});
    } else {
        const resAtendimento = await qryInsert(obj);
        res.status(201).send(resAtendimento);
    }
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

module.exports = { 
    Consultar,
    Inserir,
    Atualizar 
}