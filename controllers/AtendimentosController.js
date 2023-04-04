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
    qryTotal
    } = require('../model/AtendimentosModel');
const sql = require('../db.js');
const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function Consultar(req, res) {
    let obj = {
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

    obj.Codigo = setTextoSQL(obj.Codigo);
    obj.Texto = setTextoSQL(obj.Texto);
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
    let { CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle, /*ImagemDescricao*/ } = req.body;
    const file = req.file
    const imageName = generateUuidImage();
    // console.log(`imageName: ${imageName}`);

    const ext = getExtension(file.mimetype);
    // console.log(`getExtension: ${ext}`);

    const imageWebp = await convertImageToWebp(file.buffer);
    // console.log(`imageWebp: ${imageWebp.byteLength}`)

    // console.log(file);

    try {
        await uploadFile(imageWebp, imageName, file.mimetype, ext)
        const fullName = `${imageName}.${ext}`
        const imagemUrl = await getObjectSignedUrl(fullName)

        res.send({
            imageName,
            ext,
            originalSize: file.size,
            originalName: file.originalname,
            imageWebp: imageWebp.byteLength,
            newName: `${imageName}.${ext}`,
            imagemUrl
        })
    } catch (error) {
        res.send({
            erro: `Erro ao fazer upload de imagem `,
            motivo: error
        })
    }

    //comentei porque conta da tabela do banco
    /*
    let query;

    query = 'INSERT INTO sup_atendimentos(CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle)';
    query += `\nVALUES (${CodUsuario}, '${NomeUsuario}', ${CodEmpresa}, '${Nome}', '${Empresa}', '${TipoPessoa}', '${Problema}', '${Solucao}', '${Sistema}', '${TipoChamado}', dbo.ConverterDataHora('${DataHora}'), dbo.ConverterDataHora('${DataHoraFim}'), dbo.ConverterDataHora('${DataHoraLancamento}'), '${Categoria}', '${SubCategoria}', ${Plantao}, ${Privado}, ${Ticket}, ${Analise}, '${Status}', ${Terminal}, '${Controle}')`;

    sql.query(query, (err, result) => {
        if (err) console.log(err);
        res.status(201).send('OK!');
    });
    */
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