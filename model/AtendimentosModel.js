const sql = require('../db.js');
const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function qryAtendimentos(obj) {
    let script, retorno;

    script = `SELECT * FROM sup.getAtendimentos(`
    script += `${obj.Codigo}, ${obj.PageNumber}, `;
    script += `${obj.Rows}, ${obj.Texto}, ${obj.Assunto}, `;
    script += `${obj.DataInicio}, ${obj.DataFim}, ${obj.Sistema}, `;
    script += `${obj.MeioComunicacao}, ${obj.Usuario}, `;
    script += `${obj.Plantao})`;

    console.log('\nscript da consulta:\n' + script)
    retorno = await sql.query(script);

    return retorno.recordset;
}

async function qryTotal(obj) {
    let script, retorno;

    script = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`;
    script += `${obj.Codigo}, 1, (SELECT COUNT(Codigo) FROM sup.atendimentos), `;
    script += `${obj.Texto}, ${obj.Assunto}, ${obj.DataInicio}, ${obj.DataFim}, `;
    script += `${obj.Sistema}, ${obj.MeioComunicacao}, ${obj.Usuario}, ${obj.Plantao})`;

    console.log('\nscript do total:\n' + script)
    retorno = await sql.query(script);

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