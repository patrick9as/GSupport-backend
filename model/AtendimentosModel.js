const sql = require('../db.js');
const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function qryAtendimentos(obj) {
    let script = `DECLARE @Codigo VARCHAR(MAX) = ${obj.Codigo}, `;
    script += `\n@PageNumber INT = ${obj.PageNumber}, @Rows INT = ${obj.Rows},`;
    script += `\n@Texto VARCHAR(MAX) = ${obj.Texto}, @Assunto VARCHAR(MAX) = ${obj.Assunto},`;
    script += `\n@DataInicio VARCHAR(MAX) = ${obj.DataInicio}, @DataFim VARCHAR(MAX) = ${obj.DataFim},`;
    script += `\n@Sistema VARCHAR(MAX) = ${obj.Sistema},`;
    script += `\n@MeioComunicacao VARCHAR(MAX) = ${obj.MeioComunicacao},`;
    script += `\n@Usuario VARCHAR(MAX) = ${obj.Usuario},`;
    script += `\n@Plantao INT = ${obj.Plantao};`;

    script += `\n\nSELECT`;
    //Campos
    script += `\n   a.Codigo, a.CodUsuario,`;
    script += `\n   a.CodEmpresa, e.NomeFantasia, e.RazaoSocial, e.CNPJ,`;
    script += `\n   a.NomeCliente, a.Assunto, a.Problema, a.Solucao,`;
    script += `\n   a.CodSistema, s.Sistema,`;
    script += `\n   a.CodMeioComunicacao, mc.MeioComunicacao,`;
    script += `\n   a.DataCriacao, a.DataInicio, a.DataFim,`;
    script += `\n   a.Plantao`

    //Fontes
    script += `\nFROM sup.atendimentos a`;
    script += `\nINNER JOIN sup.empresas e ON a.CodEmpresa = e.Codigo`;
    script += `\nINNER JOIN sup.usuarios u ON a.CodUsuario = u.Codigo`;
    script += `\nINNER JOIN sup.sistemas s ON a.CodSistema = s.Codigo`;
    script += `\nINNER JOIN sup.meios_comunicacao mc ON a.CodMeioComunicacao = mc.Codigo`;

    //Filtros
    script += `\n\nWHERE (`;
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
        
    //Paginação
    script += `\n\nORDER BY a.Codigo DESC`;
    if (obj.FiltroPaginacao == 1) {
        script += `\nOFFSET (@PageNumber -1) * @Rows`;
        script += `\nROWS FETCH NEXT @Rows`;
        script += `\nROWS ONLY`;
    }

    console.log('\n-----script da consulta:-----\n' + script)
    const startTime = new Date().getTime();
    
    const retorno = await sql.query(script);

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script da consulta executado em ${executionTime / 1000} segundos`);

    return retorno.recordset;
}

async function querySelectImage(codigo){
    console.log(`***Entrou na funcao querySelectImage`);

    let script = `select Imagem from sup.imagens where CodAtendimento = ${codigo}`

    const startTime = new Date().getTime();
    result = await sql.query(script)

    const endTime = new Date().getTime();
    const executionTime = endTime - startTime;
    console.log(`script de select imagem executado em ${executionTime / 1000} segundos`);

    console.log(`***Saiu da funcao querySelectImage`);
    
    return result.recordset

}

async function qryTotal(obj) {
    let script, retorno;

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

    script = 'INSERT INTO sup.atendimentos(';
    script += '\n  CodUsuario, CodEmpresa, NomeCliente, Problema, Solucao, CodSistema, CodMeioComunicacao, DataCriacao, DataInicio, DataFim, Assunto, Plantao)';
    script += '\nOUTPUT INSERTED.Codigo';
    script += `\n  VALUES (${obj.CodUsuario}, ${obj.CodEmpresa}, ${obj.NomeCliente}, ${obj.Problema}, ${obj.Solucao}, ${obj.CodSistema}, ${obj.CodMeioComunicacao}, ${obj.DataCriacao}, ${obj.DataInicio}, ${obj.DataFim}, ${obj.Assunto}, ${obj.Plantao})`;
    
    console.log('\nscript do insert do atendimento:\n' + script);
    retorno = await sql.query(script);

    return retorno.recordset[0].Codigo;
}

async function qryInsertImagem(Imagem, CodAtendimento) {
    let script, retorno;

    script = `INSERT INTO sup.imagens(Imagem, CodAtendimento)`;
    script += `\n   OUTPUT INSERTED.Codigo`;
    script += `\n   VALUES ('${Imagem}',${CodAtendimento})`;

    console.log('\nscript do insert da imagem:\n' + script);
    retorno = await sql.query(script);

    return retorno.recordset[0].Codigo;
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
    qryUpdate,
    querySelectImage
}