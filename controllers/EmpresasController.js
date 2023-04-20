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
} = require('../model/AtendimentosModel');

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
            CodCategoria
        } = req.query;

        obj.Codigo = setTextoQuotedSQL(obj.Codigo);
        obj.CodExterno, 
        NomeFantasia, 
        RazaoSocial, 
        CNPJ, 
        Endereco, 
        Numero, 
        Bairro, 
        Cidade, 
        UF, 
        Ativo, 
        CodCategoria
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' + error);
    }
}