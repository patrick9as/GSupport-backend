const {
    checkField,
    setQuotedTextSQL,
    setDataSQL
} = require('../helper');
const {
    qryEmpresas,
    qryTotal,
    qryInsert,
    qryUpdate
} = require('../model/EmpresasModel');

async function readRecord(req,res) {
    try {
        let obj = {
            Codigo, 
            CodExterno, 
            NomeFantasia, 
            RazaoSocial, 
            CNPJ, 
            Endereco, 
            Numero, 
            Bairro, 
            Cidade, 
            UF, 
            Ativo, 
            CodCategoria,
            OrderBy
        } = req.query;

        obj.Codigo = setQuotedTextSQL(obj.Codigo);
        obj.CodExterno = setQuotedTextSQL(obj.CodExterno); 
        obj.NomeFantasia = setQuotedTextSQL(obj.NomeFantasia); 
        obj.RazaoSocial = setQuotedTextSQL(obj.RazaoSocial); 
        obj.CNPJ = setQuotedTextSQL(obj.CNPJ);
        obj.Endereco = setQuotedTextSQL(obj.Endereco);
        obj.Numero = setQuotedTextSQL(obj.Numero);
        obj.Bairro = setQuotedTextSQL(obj.Bairro);
        obj.Cidade = setQuotedTextSQL(obj.Cidade); 
        obj.UF = setQuotedTextSQL(obj.UF);
        if (!checkField(obj.Ativo)) obj.Ativo = 1;
        else obj.Ativo = obj.Ativo; 
        obj.CodCategoria = setQuotedTextSQL(obj.CodCategoria);
        if (!checkField(obj.OrderBy)) obj.OrderBy = ``;
        else obj.OrderBy = `ORDER BY ${obj.OrderBy}`;

        let resEmpresas = await qryEmpresas(obj);

        res.status(200).send(resEmpresas);
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' + error);
    }
}

module.exports = {
    readRecord
}