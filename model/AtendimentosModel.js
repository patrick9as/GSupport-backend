const sql = require('../db.js');
const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function qryAtendimentos(obj) {
    let script, retorno;

    // script = `SELECT * FROM sup.getAtendimentos(`
    // script += `${obj.Codigo}, ${obj.PageNumber}, `;
    // script += `${obj.Rows}, ${obj.Texto}, ${obj.Assunto}, `;
    // script += `${obj.DataInicio}, ${obj.DataFim}, ${obj.Sistema}, `;
    // script += `${obj.MeioComunicacao}, ${obj.Usuario}, `;
    // script += `${obj.Plantao})`;
    script = `DECLARE @Codigo VARCHAR(MAX) = ${obj.Codigo}, `;
    script += `\n@PageNumber INT = ${obj.PageNumber}, @Rows INT = ${obj.Rows},`;
    script += `\n@Texto VARCHAR(MAX) = ${obj.Texto}, @Assunto VARCHAR(MAX) = ${obj.Assunto},`;
    script += `\n@DataInicio VARCHAR(MAX) = ${obj.DataInicio}, @DataFim VARCHAR(MAX) = ${obj.DataFim},`;
    script += `\n@Sistema VARCHAR(MAX) = ${obj.Sistema},`;
    script += `\n@MeioComunicacao VARCHAR(MAX) = ${obj.MeioComunicacao},`;
    script += `\n@Usuario VARCHAR(MAX) = ${obj.Usuario},`;
    script += `\n@Plantao INT = ${obj.Plantao};`;

    script += `\nSELECT`;
    script += `\na.*`;
    script += `\nFROM sup.atendimentos a`;
    script += `\nINNER JOIN sup.empresas e ON a.CodEmpresa = e.Codigo`;
    script += `\nINNER JOIN sup.usuarios u ON a.CodUsuario = u.Codigo`;
    script += `\nINNER JOIN sup.sistemas s ON a.CodSistema = s.Codigo`;
    script += `\nINNER JOIN sup.meios_comunicacao mc ON a.CodMeioComunicacao = mc.Codigo`;
    script += `\nWHERE (`;
    script += `\n   a.Problema LIKE @Texto`;
    script += `\n   OR a.Solucao LIKE @Texto`;
    script += `\n   OR e.NomeFantasia LIKE @Texto`;
    script += `\n   OR e.RazaoSocial LIKE @Texto`;
    script += `\n   OR a.NomeCliente LIKE @Texto`;
    script += `\n   OR a.Codigo LIKE @Texto`;
    script += `\n)`;
    script += `\nAND a.DataInicio BETWEEN @DataInicio AND @DataFim`;
    script += `\nAND u.Usuario LIKE @Usuario`;
    script += `\nAND s.Sistema LIKE @Sistema`;
    script += `\nAND mc.MeioComunicacao LIKE @MeioComunicacao`;
    script += `\nAND a.Codigo LIKE @Codigo`;
    script += `\nAND a.Assunto LIKE @Assunto`;
    script += `\nAND @Plantao = `;
    script += `\n    CASE WHEN @Plantao = 0 THEN a.Plantao`;
    script += `\n    WHEN @Plantao = 1 THEN a.Plantao`;
    script += `\n    WHEN @Plantao = -1 THEN @Plantao`;
    script += `\n    END`;
        
    script += `\nORDER BY a.Codigo DESC`;
    script += `\nOFFSET (@PageNumber -1) * @Rows`;
    script += `\nROWS FETCH NEXT @Rows`;
    script += `\nROWS ONLY`;

    console.log('\n-----script da consulta:-----\n' + script)
    const startTime = new Date().getTime();
    
    retorno = await sql.query(script);

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script da consulta executado em ${executionTime / 1000} segundos`);

    return retorno.recordset;
}

async function qryTotal(obj) {
    let script, retorno;

    /*script = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`;
    script += `${obj.Codigo}, 1, (SELECT COUNT(Codigo) FROM sup.atendimentos), `;
    script += `${obj.Texto}, ${obj.Assunto}, ${obj.DataInicio}, ${obj.DataFim}, `;
    script += `${obj.Sistema}, ${obj.MeioComunicacao}, ${obj.Usuario}, ${obj.Plantao})`;

    console.log('\nscript do total:\n' + script)*/

    //retorno = await sql.query(script);

    //return retorno.recordset[0].Total;

    script = `DECLARE @Codigo VARCHAR(MAX) = ${obj.Codigo}, `;
    script += `\n@Texto VARCHAR(MAX) = ${obj.Texto}, @Assunto VARCHAR(MAX) = ${obj.Assunto},`;
    script += `\n@DataInicio VARCHAR(MAX) = ${obj.DataInicio}, @DataFim VARCHAR(MAX) = ${obj.DataFim},`;
    script += `\n@Sistema VARCHAR(MAX) = ${obj.Sistema},`;
    script += `\n@MeioComunicacao VARCHAR(MAX) = ${obj.MeioComunicacao},`;
    script += `\n@Usuario VARCHAR(MAX) = ${obj.Usuario},`;
    script += `\n@Plantao INT = ${obj.Plantao};`;

    script += `\nSELECT`;
    script += `\nCOUNT(*) 'Total'`;
    script += `\nFROM sup.atendimentos a`;
    script += `\nINNER JOIN sup.empresas e ON a.CodEmpresa = e.Codigo`;
    script += `\nINNER JOIN sup.usuarios u ON a.CodUsuario = u.Codigo`;
    script += `\nINNER JOIN sup.sistemas s ON a.CodSistema = s.Codigo`;
    script += `\nINNER JOIN sup.meios_comunicacao mc ON a.CodMeioComunicacao = mc.Codigo`;
    script += `\nWHERE (`;
    script += `\n   a.Problema LIKE @Texto`;
    script += `\n   OR a.Solucao LIKE @Texto`;
    script += `\n   OR e.NomeFantasia LIKE @Texto`;
    script += `\n   OR e.RazaoSocial LIKE @Texto`;
    script += `\n   OR a.NomeCliente LIKE @Texto`;
    script += `\n   OR a.Codigo LIKE @Texto`;
    script += `\n)`;
    script += `\nAND a.DataInicio BETWEEN @DataInicio AND @DataFim`;
    script += `\nAND u.Usuario LIKE @Usuario`;
    script += `\nAND s.Sistema LIKE @Sistema`;
    script += `\nAND mc.MeioComunicacao LIKE @MeioComunicacao`;
    script += `\nAND a.Codigo LIKE @Codigo`;
    script += `\nAND a.Assunto LIKE @Assunto`;
    script += `\nAND @Plantao = `;
    script += `\n    CASE WHEN @Plantao = 0 THEN a.Plantao`;
    script += `\n    WHEN @Plantao = 1 THEN a.Plantao`;
    script += `\n    WHEN @Plantao = -1 THEN @Plantao`;
    script += `\n    END`;

    console.log('\n-----script do total de registros:-----\n' + script)
    const startTime = new Date().getTime();

    retorno = await sql.query(script);

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script do total de registros executado em ${executionTime / 1000} segundos`);

    return retorno.recordset[0].Total;
} 

async function qryInsert(obj) {
    let script, retorno;

    script = 'INSERT INTO sup.atendimentos('
    script += '\n  CodUsuario, CodEmpresa, NomeCliente, Problema, Solucao, CodSistema, CodMeioComunicacao, DataCriacao, DataInicio, DataFim, Assunto, Plantao)';
    script += '\nOUTPUT INSERTED.Codigo';
    script += `\n  VALUES (${obj.CodUsuario}, ${obj.CodEmpresa}, ${obj.NomeCliente}, ${obj.Problema}, ${obj.Solucao}, ${obj.CodSistema}, ${obj.CodMeioComunicacao}, ${obj.DataCriacao}, ${obj.DataInicio}, ${obj.DataFim}, ${obj.Assunto}, ${obj.Plantao})`;
    
    console.log('\nscript do insert:\n' + script);
    retorno = await sql.query(script);

    return retorno.recordset[0].Codigo;
}

async function qryInsertImagem(imageName, ext, imageWebp, file) {
    await uploadFile(imageWebp, imageName, file.mimetype, ext)
    const fullName = `${imageName}.${ext}`
    const imagemUrl = await getObjectSignedUrl(fullName)

    return {
        imageName,
        ext,
        originalSize: file.size,
        originalName: file.originalname,
        imageWebp: imageWebp.byteLength,
        newName: `${imageName}.${ext}`,
        imagemUrl
    }
}

async function qryUpdate (obj) {
    let script, retorno;

    script = 'UPDATE sup.atendimentos';
    script += `\nSET CodUsuario = ${obj.CodUsuario},`;
    script += `\nCodEmpresa = ${obj.CodEmpresa},`;
    script += `\nNomeCliente = ${obj.NomeCliente},`;
    script += `\nAssunto = ${obj.Assunto},`;
    script += `\nProblema = ${obj.Problema},`;
    script += `\nSolucao = ${obj.Solucao},`;
    script += `\nCodSistema = ${obj.CodSistema},`;
    script += `\nCodMeioComunicacao = ${obj.CodMeioComunicacao},`;
    script += `\nDataCriacao = ${obj.DataCriacao},`;
    script += `\nDataInicio = ${obj.DataInicio},`;
    script += `\nDataFim = ${obj.DataFim},`;
    script += `\nPlantao = ${obj.Plantao}`;
    script += `\nWHERE Codigo = ${obj.Codigo}`;

    console.log('\nscript do update:\n' + script);
    retorno = await sql.query(script);

    return retorno;
}

module.exports = {
    qryAtendimentos,
    qryTotal,
    qryInsert,
    qryInsertImagem,
    qryUpdate
}