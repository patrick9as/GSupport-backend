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
    qryInsertImagem,
    qryUpdate
    } = require('../model/AtendimentosModel');
const sql = require('../db.js');

async function Consultar(req, res) {
    try {
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
            Plantao = null,
            FiltroPaginacao = null
        } = req.query;

        obj.Codigo = setTextoSQL(obj.Codigo);
        obj.Texto = setTextoSQL(obj.Texto);
        obj.Assunto = setTextoSQL(obj.Assunto);
        
        obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`; 
        if (obj.DataInicio == null || obj.Datainicio == undefined)
            obj.DataFim = `'${setDataSQL(obj.DataFim)} 23:59:59'`;
        else
            obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;

        obj.Sistema = setTextoSQL(obj.Sistema);
        obj.MeioComunicacao = setTextoSQL(obj.MeioComunicacao);
        obj.Usuario = setTextoSQL(obj.Usuario);
        if (! validarParametro(obj.PageNumber)) obj.PageNumber = 1;
        if (! validarParametro(obj.Plantao)) obj.Plantao = -1;
        if (! validarParametro(obj.Rows) || obj.Rows <= 0) {
            obj.FiltroPaginacao = 0;
            obj.Rows = 5;
        } else obj.FiltroPaginacao = 1;

        const [resTotal, resAtendimento] = await Promise.all([qryTotal(obj), qryAtendimentos(obj)])
        res.status(200).send(JSON.stringify({ 'Total': resTotal, 'Result': resAtendimento} ));
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' +  error);
    }
}

async function Inserir(req, res) {
    console.log(`*** Entrou na rota Inserir`);
    console.log(`*** Dados vindo do front: ${req.body.data}`);
    try {
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
        } = JSON.parse (req.body.data);
        console.log(`*** Dados na variavel obj: ${obj}`);

        console.log(`*** Entrou na validacao dos dados`);
        obj.CodUsuario = `'${obj.CodUsuario}'`;
        obj.CodEmpresa = `'${obj.CodEmpresa}'`;
        obj.NomeCliente = `'${obj.NomeCliente}'`;
        obj.Problema = `'${obj.Problema}'`;
        obj.Solucao = `'${obj.Solucao}'`;
        obj.Assunto = `'${obj.Assunto}'`;
        obj.CodSistema = `'${obj.CodSistema}'`;
        obj.CodMeioComunicacao = `'${obj.CodMeioComunicacao}'`;
        obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`; 
        obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (! validarParametro(obj.Plantao)) obj.Plantao = 0;

        console.log(`*** Validou os dados do req: ${obj}`);
        
        const file = req.file

        // res temporario
        //res.status(200).end()

        //comentei para testar sem salvar no banco.

         if (file != undefined) {
            const imageName = generateUuidImage();
            const ext = getExtension(file.mimetype);

            const imageWebp = await convertImageToWebp(file.buffer);
            
            const [resAtendimento, resImagem] = await Promise.all([qryInsert(obj), qryInsertImagem(imageName, ext, imageWebp, file)]);
            res.status(201).send({Codigo: resAtendimento, resImagem});
        } else {
            const resAtendimento = await qryInsert(obj);
            res.status(201).send({Codigo: resAtendimento});
        }
    } catch (error) {
        res.status(404).send('Imagem ou JSON inválidos ' +  error);
    } 
}

async function Atualizar(req, res) {
    try {
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
        } = req.body;

        obj.Codigo = setTextoSQL(obj.Codigo);
        obj.CodUsuario = setTextoSQL(obj.CodUsuario);
        obj.CodEmpresa = setTextoSQL(obj.CodEmpresa);
        obj.NomeCliente = setTextoSQL(obj.NomeCliente);
        obj.Problema = setTextoSQL(obj.Problema);
        obj.Solucao = setTextoSQL(obj.Solucao);
        obj.Assunto = setTextoSQL(obj.Assunto);
        obj.CodSistema = setTextoSQL(obj.CodSistema);
        obj.CodMeioComunicacao = setTextoSQL(obj.CodMeioComunicacao);
        obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`; 
        obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (! validarParametro(obj.Plantao)) obj.Plantao = 0;

        const retUpdate = await qryUpdate(obj);
        res.status(202).send(`Linhas afetadas: ${retUpdate.rowsAffected.length}`);
    } catch(error) {
        res.status(404).send('Informações insuficientes ou incorretas ' +  error);
    }
}

module.exports = { 
    Consultar,
    Inserir,
    Atualizar 
}