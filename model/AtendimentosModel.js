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

    retorno = await sql.query(script);
    return retorno.recordset;
}

async function qryTotal(obj) {
    let script, retorno;

    script = `SELECT COUNT(*) 'Total' FROM sup.getAtendimentos(`;
    script += `${obj.Codigo}, 1, (SELECT COUNT(Codigo) FROM sup.atendimentos), `;
    script += `${obj.Texto}, ${obj.Assunto}, ${obj.DataInicio}, ${obj.DataFim}, `;
    script += `${obj.Sistema}, ${obj.MeioComunicacao}, ${obj.Usuario}, ${obj.Plantao})`;

    retorno = await sql.query(script);
    return retorno.recordset[0].Total;
} 

async function qryInsert(obj) {
    let script, retorno;

    script = 'INSERT INTO sup.atendimentos('
    script += '\n  CodUsuario, CodEmpresa, NomeCliente, Problema, Solucao, CodSistema, CodMeioComunicacao, DataCriacao, DataInicio, DataFim, Assunto, Plantao)';
    script += `\n  VALUES (${obj.CodUsuario}, ${obj.CodEmpresa}, ${obj.NomeCliente}, ${obj.Problema}, ${obj.Solucao}, ${obj.CodSistema}, ${obj.CodMeioComunicacao}, ${obj.DataCriacao}, ${obj.DataInicio}, ${obj.DataFim}, ${obj.Assunto}, ${obj.Plantao})`;
    console.log('script\n\n' + script);
    retorno = await sql.query(script);
    console.log('retorno do async\n\n' + retorno.rowsAffected.length);
    return retorno.rowsAffected.length;
}

async function qryInsertImagem(imageName, ext, imageWebp, file) {
    try {
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
    } catch (error) {
        return {
            erro: `Erro ao fazer upload de imagem`,
            motivo: error
        }
    }
}

module.exports = {
    qryAtendimentos,
    qryTotal,
    qryInsert,
    qryInsertImagem
}