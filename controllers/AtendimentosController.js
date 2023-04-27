const {
    checkField,
    setQuotedTextSQL,
    setDataSQL
} = require('../helper');
const {
    qryAtendimentos,
    qryTotal,
    qryInsert,
    qryInsertImagem,
    qryUpdate,
    querySelectImagens
} = require('../model/AtendimentosModel');

const {uploadImages, getImagesS3} = require('../imageS3/uploadMultipleImage')

async function readRecord(req, res) {
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

        obj.Codigo = setQuotedTextSQL(obj.Codigo);
        obj.Texto = setQuotedTextSQL(obj.Texto);
        obj.Assunto = setQuotedTextSQL(obj.Assunto);

        obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (obj.DataInicio == null || obj.Datainicio == undefined)
            obj.DataFim = `'${setDataSQL(obj.DataFim)} 23:59:59'`;
        else
            obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;

        obj.Sistema = setQuotedTextSQL(obj.Sistema);
        obj.MeioComunicacao = setQuotedTextSQL(obj.MeioComunicacao);
        obj.Usuario = setQuotedTextSQL(obj.Usuario);
        if (!checkField(obj.PageNumber)) obj.PageNumber = 1;
        if (!checkField(obj.Plantao)) obj.Plantao = -1;
        if (!checkField(obj.Rows) || obj.Rows <= 0) {
            obj.FiltroPaginacao = 0;
            obj.Rows = 5;
        } else obj.FiltroPaginacao = 1;

        const [returnQryTotal, returnQryAtendimentos] = await Promise.all([qryTotal(obj), qryAtendimentos(obj)])

        // console.log(`*** Vai entrar no loop de imagem para coletar URL`);
        for (let index = 0; index < returnQryAtendimentos.length; index++) {
            let returnQrySelectImagens = await querySelectImagens(returnQryAtendimentos[index].Codigo)
            let returnGetImageS3 = await getImagesS3(returnQrySelectImagens)
            returnQryAtendimentos[index].Imagens = returnGetImageS3
        }
         

        res.status(200).send(JSON.stringify({ 'Total': returnQryTotal, 'Result': returnQryAtendimentos}));
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' + error);
    }
}

async function createRecord(req, res) {
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
        } = JSON.parse(req.body.data);

        obj.file = req.files;

        if (!checkField(obj.CodUsuario)) throw new Error('Código do usuário é inválido');
        else obj.CodUsuario = `'${obj.CodUsuario}'`;
        if (!checkField(obj.CodEmpresa)) throw new Error('Código da empresa é inválido');
        else obj.CodEmpresa = `'${obj.CodEmpresa}'`;
        if (!checkField(obj.NomeCliente)) throw new Error('Nome do cliente é inválido');
        else obj.NomeCliente = `'${obj.NomeCliente}'`;
        if (!checkField(obj.Problema)) throw new Error('Problema é inválido');
        else obj.Problema = `'${obj.Problema}'`;
        if (!checkField(obj.Solucao)) throw new Error('Solução é inválida');
        else obj.Solucao = `'${obj.Solucao}'`;
        if (!checkField(obj.Assunto)) throw new Error('Assunto é inválido');
        else obj.Assunto = `'${obj.Assunto}'`;
        if (!checkField(obj.CodSistema)) throw new Error('Código do sistema é inválido');
        else obj.CodSistema = `'${obj.CodSistema}'`;
        if (!checkField(obj.CodMeioComunicacao)) throw new Error('Código do meio de comunicação é inválido');
        else obj.CodMeioComunicacao = `'${obj.CodMeioComunicacao}'`;
        if (!checkField(obj.DataCriacao)) throw new Error('Data de criação é inválida');
        else obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`;
        if (!checkField(obj.DataInicio)) throw new Error('Data de início é inválida');
        else obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (!checkField(obj.DataFim)) throw new Error('Data de fim é inválida');
        else obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (!checkField(obj.Plantao)) obj.Plantao = 0;

        obj.Codigo = await qryInsert(obj);
        if (obj.file != undefined && obj.file != null) {

            //console.log(`*** Rota atendimento: Leu images`);
            const imagesResult = await uploadImages(obj.file)

            //console.log(`*** Retorno da funcao Upload Image, valor:${imagesResult}`);

            //Laço para inserir mais de uma imagem
            for (let i = 0; i < imagesResult.length; i++)
                await qryInsertImagem(imagesResult[i], obj.Codigo);
                // imagesResult[i] = { Codigo: await qryInsertImagem(imagesResult[i], obj.Codigo), [`Imagem${i}`]: imagesResult[i] };

            res.status(201).send({Status: 'OK'});
            // res.status(201).send({ Atendimento: obj.Codigo, Imagens: imagesResult });
        } //else
            //res.status(201).send({ Atendimento: obj.Codigo });
    } catch (error) {
        res.status(404).send('Imagem ou JSON inválidos ' + error);
    }
}

async function updateRecord(req, res) {
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

        if (!checkField(obj.Codigo)) throw new Error('Código é inválido');
        else obj.Codigo = `'${obj.Codigo}'`;
        if (!checkField(obj.CodUsuario)) throw new Error('Código do usuário é inválido');
        else obj.CodUsuario = `'${obj.CodUsuario}'`;
        if (!checkField(obj.CodEmpresa)) throw new Error('Código da empresa é inválido');
        else obj.CodEmpresa = `'${obj.CodEmpresa}'`;
        if (!checkField(obj.NomeCliente)) throw new Error('Nome do cliente é inválido');
        else obj.NomeCliente = `'${obj.NomeCliente}'`;
        if (!checkField(obj.Problema)) throw new Error('Problema é inválido');
        else obj.Problema = `'${obj.Problema}'`;
        if (!checkField(obj.Solucao)) throw new Error('Solução é inválida');
        else obj.Solucao = `'${obj.Solucao}'`;
        if (!checkField(obj.Assunto)) throw new Error('Assunto é inválido');
        else obj.Assunto = `'${obj.Assunto}'`;
        if (!checkField(obj.CodSistema)) throw new Error('Código do sistema é inválido');
        else obj.CodSistema = `'${obj.CodSistema}'`;
        if (!checkField(obj.CodMeioComunicacao)) throw new Error('Código do meio de comunicação é inválido');
        else obj.CodMeioComunicacao = `'${obj.CodMeioComunicacao}'`;
        if (!checkField(obj.DataCriacao)) throw new Error('Data de criação é inválida');
        else obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`;
        if (!checkField(obj.DataInicio)) throw new Error('Data de início é inválida');
        else obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (!checkField(obj.DataFim)) throw new Error('Data de fim é inválida');
        else obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (!checkField(obj.Plantao)) obj.Plantao = 0;

        const returnQryUpdate = await qryUpdate(obj);
        res.status(202).send(`Linhas afetadas: ${returnQryUpdate.rowsAffected.length}`);
    } catch (error) {
        res.status(404).send('Informações insuficientes ou incorretas ' + error);
    }
}

module.exports = {
    readRecord,
    createRecord,
    updateRecord
}