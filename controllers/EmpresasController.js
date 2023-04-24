const {
    validarParametro,
    setTextoQuotedSQL,
    setDataSQL
} = require('../helper');
const {
    qryEmpresas,
    qryTotal,
    qryInsert,
    qryUpdate
} = require('../model/EmpresasModel');

async function Consultar(req,res) {
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

        obj.Codigo = setTextoQuotedSQL(obj.Codigo);
        obj.CodExterno = setTextoQuotedSQL(obj.CodExterno); 
        obj.NomeFantasia = setTextoQuotedSQL(obj.NomeFantasia); 
        obj.RazaoSocial = setTextoQuotedSQL(obj.RazaoSocial); 
        obj.CNPJ = setTextoQuotedSQL(obj.CNPJ);
        obj.Endereco = setTextoQuotedSQL(obj.Endereco);
        obj.Numero = setTextoQuotedSQL(obj.Numero);
        obj.Bairro = setTextoQuotedSQL(obj.Bairro);
        obj.Cidade = setTextoQuotedSQL(obj.Cidade); 
        obj.UF = setTextoQuotedSQL(obj.UF);
        if (!validarParametro(obj.Ativo)) obj.Ativo = 1;
        else obj.Ativo = obj.Ativo; 
        obj.CodCategoria = setTextoQuotedSQL(obj.CodCategoria);
        if (!validarParametro(obj.OrderBy)) obj.OrderBy = ``;
        else obj.OrderBy = `ORDER BY ${obj.OrderBy}`;

        let resEmpresas = await qryEmpresas(obj);

        res.status(200).send(resEmpresas);
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' + error);
    }
}

module.exports = {
    Consultar
}