const { FormatDate, 
        convertImageToWebp, 
        generateUuidImage, 
        getExtension 
        } = require('../helper');
const sql = require('../db.js');
const { uploadFile, getObjectSignedUrl } = require('../aws/s3');


async function Consultar(req, res) {
    let sqlQueryResult, sqlQueryTotal;
    let RetQueryResult, RetQueryTotal;
    let { Codigo, PageNumber, Rows, Texto, Usuario, Categoria, Sistema, Plantao, DataInicio, DataFim } = req.body;

    if (DataInicio == '' || DataInicio == undefined)
        DataInicio = new Date().toLocaleDateString('pt-BR')
    else
        DataInicio = FormatDate(DataInicio);

    if (DataFim == '' || DataFim == undefined)
        DataFim = new Date().toLocaleDateString('pt-BR');
    else
        DataFim = FormatDate(DataFim);

    sqlQueryResult = 'DECLARE';
    sqlQueryResult += '\n@PageNumber INT,';
    sqlQueryResult += '\n@Rows INT,';
    sqlQueryResult += '\n@Texto VARCHAR(MAX),';
    sqlQueryResult += '\n@Categoria VARCHAR(MAX),';
    sqlQueryResult += '\n@DataInicio DATETIME,';
    sqlQueryResult += '\n@DataFim DATETIME,';
    sqlQueryResult += '\n@Sistema VARCHAR(MAX),';
    sqlQueryResult += '\n@Usuario VARCHAR(MAX);';
    sqlQueryResult += '\n';

    if (PageNumber != undefined || Rows != undefined) {
        if (PageNumber != undefined)
            sqlQueryResult += `\n  SET @PageNumber = ${PageNumber};`;
        else 
            sqlQueryResult += `\n  SET @PageNumber = 1;`;
        
        if (Rows != undefined)
            sqlQueryResult += `\n  SET @Rows = ${Rows};`;
        else
            sqlQueryResult += `\n  SET @Rows = 10`;
    }
    if (Texto == undefined)
        sqlQueryResult += `\n  SET @Texto = '%%';`;
    else
        sqlQueryResult += `\n  SET @Texto = '%${Texto}%';`;
    if (Usuario == undefined)
        sqlQueryResult += `\n  SET @Usuario = '%%';`;
    else
        sqlQueryResult += `\n  SET @Usuario = '%${Usuario}%';`;
    if (Categoria == undefined)
        sqlQueryResult += `\n  SET @Categoria = '%%';`;
    else
        sqlQueryResult += `\n  SET @Categoria = '%${Categoria}%';`;
    if (Sistema == undefined)
        sqlQueryResult += `\n  SET @Sistema = '%%';`;
    else
        sqlQueryResult += `\n  SET @Sistema = '%${Sistema}%';`;

    sqlQueryResult += `\n  SET @DataInicio = dbo.converterData('${DataInicio}');`;
    sqlQueryResult += `\n  SET @DataFim = dbo.converterDataHora('${DataFim}' + ' 23:59:59');`;
    sqlQueryResult += '\n';
    sqlQueryResult += '\nSELECT a.* FROM sup.atendimentos a';
    sqlQueryResult += '\nINNER JOIN sup.empresas e ON a.CodEmpresa = e.Codigo';
    sqlQueryResult += '\nINNER JOIN sup.usuarios u ON a.CodUsuario = u.Codigo';
    sqlQueryResult += '\nWHERE (';
    sqlQueryResult += `\n    ISNULL(e.NomeFantasia, '') LIKE @Texto`;
    sqlQueryResult += `\n OR ISNULL(e.RazaoSocial, '') LIKE @Texto`;
    sqlQueryResult += `\n OR ISNULL(a.NomeCliente,'') LIKE @Texto`;
    sqlQueryResult += `\n OR ISNULL(a.Codigo,'') LIKE @Texto)`;
    sqlQueryResult += `\nAND a.DataInicio BETWEEN @DataInicio AND @DataFim`;

    if (Plantao != undefined)
        sqlQueryResult += `\nAND a.Plantao = ${Plantao}`;
    sqlQueryResult += `\nAND ISNULL(u.Usuario, '') LIKE @Usuario`;
    if (Codigo != undefined && Codigo != '')
        sqlQueryResult += `\nAND a.Codigo = ${Codigo}`;
    sqlQueryResult += `\nORDER BY a.Codigo DESC`;

    sqlQueryTotal = sqlQueryResult;

    if (PageNumber != undefined || Rows != undefined) {
        sqlQueryResult += `\nOFFSET (@PageNumber - 1) * @Rows`;
        sqlQueryResult += `\nROWS FETCH NEXT @Rows ROWS ONLY`;
    }
    console.log(sqlQueryResult);
    RetQueryResult = await sql.query(sqlQueryResult);
    RetQueryTotal = await sql.query(sqlQueryTotal);

    res.status(200).send(JSON.stringify({ "Total": RetQueryTotal.recordset.length, Result: RetQueryResult.recordset }));
}

async function Inserir(req, res) {
    let { CodUsuario, NomeUsuario, CodEmpresa, Nome, Empresa, TipoPessoa, Problema, Solucao, Sistema, TipoChamado, DataHora, DataHoraFim, DataHoraLancamento, Categoria, SubCategoria, Plantao, Privado, Ticket, Analise, Status, Terminal, Controle, /*ImagemDescricao*/ } = req.body;
    const file = req.file
    const imageName = generateUuidImage()
    // console.log(`imageName: ${imageName}`);

    const ext = getExtension(file.mimetype)
    // console.log(`getExtension: ${ext}`);

    const imageWebp = await convertImageToWebp(file.buffer)
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

module.exports = { Consultar, Inserir, Atualizar }