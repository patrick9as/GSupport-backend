const {
    validarParametro,
    setTextoQuotedSQL,
    setDataSQL
} = require('../helper');
const {
    qryAtendimentos,
    qryTotal,
    qryInsert,
    qryInsertImagem,
    qryUpdate,
    querySelectImage
} = require('../model/AtendimentosModel');

const {uploadImages, getImagesS3} = require('../imageS3/uploadMultipleImage')

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

        obj.Codigo = setTextoQuotedSQL(obj.Codigo);
        obj.Texto = setTextoQuotedSQL(obj.Texto);
        obj.Assunto = setTextoQuotedSQL(obj.Assunto);

        obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (obj.DataInicio == null || obj.Datainicio == undefined)
            obj.DataFim = `'${setDataSQL(obj.DataFim)} 23:59:59'`;
        else
            obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;

        obj.Sistema = setTextoQuotedSQL(obj.Sistema);
        obj.MeioComunicacao = setTextoQuotedSQL(obj.MeioComunicacao);
        obj.Usuario = setTextoQuotedSQL(obj.Usuario);
        if (!validarParametro(obj.PageNumber)) obj.PageNumber = 1;
        if (!validarParametro(obj.Plantao)) obj.Plantao = -1;
        if (!validarParametro(obj.Rows) || obj.Rows <= 0) {
            obj.FiltroPaginacao = 0;
            obj.Rows = 5;
        } else obj.FiltroPaginacao = 1;

        const [resTotal, resAtendimento] = await Promise.all([qryTotal(obj), qryAtendimentos(obj)])

        // console.log(`*** Vai entrar no loop de imagem para coletar URL`);
        for (let index = 0; index < resAtendimento.length; index++) {
            let resultImage = await querySelectImage(resAtendimento[index].Codigo)
            let resultImageS3 = await getImagesS3(resultImage)
            resAtendimento[index].Imagens = resultImageS3
         }
         

        res.status(200).send(JSON.stringify({ 'Total': resTotal, 'Result': resAtendimento}));
    } catch (error) {
        res.status(404).send('Parâmetros de consulta inválidos ' + error);
    }
}

async function Inserir(req, res) {
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

        if (!validarParametro(obj.CodUsuario)) throw new Error('Código do usuário é inválido');
        else obj.CodUsuario = `'${obj.CodUsuario}'`;
        if (!validarParametro(obj.CodEmpresa)) throw new Error('Código da empresa é inválido');
        else obj.CodEmpresa = `'${obj.CodEmpresa}'`;
        if (!validarParametro(obj.NomeCliente)) throw new Error('Nome do cliente é inválido');
        else obj.NomeCliente = `'${obj.NomeCliente}'`;
        if (!validarParametro(obj.Problema)) throw new Error('Problema é inválido');
        else obj.Problema = `'${obj.Problema}'`;
        if (!validarParametro(obj.Solucao)) throw new Error('Solução é inválida');
        else obj.Solucao = `'${obj.Solucao}'`;
        if (!validarParametro(obj.Assunto)) throw new Error('Assunto é inválido');
        else obj.Assunto = `'${obj.Assunto}'`;
        if (!validarParametro(obj.CodSistema)) throw new Error('Código do sistema é inválido');
        else obj.CodSistema = `'${obj.CodSistema}'`;
        if (!validarParametro(obj.CodMeioComunicacao)) throw new Error('Código do meio de comunicação é inválido');
        else obj.CodMeioComunicacao = `'${obj.CodMeioComunicacao}'`;
        if (!validarParametro(obj.DataCriacao)) throw new Error('Data de criação é inválida');
        else obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`;
        if (!validarParametro(obj.DataInicio)) throw new Error('Data de início é inválida');
        else obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (!validarParametro(obj.DataFim)) throw new Error('Data de fim é inválida');
        else obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (!validarParametro(obj.Plantao)) obj.Plantao = 0;

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

        if (!validarParametro(obj.Codigo)) throw new Error('Código é inválido');
        else obj.Codigo = `'${obj.Codigo}'`;
        if (!validarParametro(obj.CodUsuario)) throw new Error('Código do usuário é inválido');
        else obj.CodUsuario = `'${obj.CodUsuario}'`;
        if (!validarParametro(obj.CodEmpresa)) throw new Error('Código da empresa é inválido');
        else obj.CodEmpresa = `'${obj.CodEmpresa}'`;
        if (!validarParametro(obj.NomeCliente)) throw new Error('Nome do cliente é inválido');
        else obj.NomeCliente = `'${obj.NomeCliente}'`;
        if (!validarParametro(obj.Problema)) throw new Error('Problema é inválido');
        else obj.Problema = `'${obj.Problema}'`;
        if (!validarParametro(obj.Solucao)) throw new Error('Solução é inválida');
        else obj.Solucao = `'${obj.Solucao}'`;
        if (!validarParametro(obj.Assunto)) throw new Error('Assunto é inválido');
        else obj.Assunto = `'${obj.Assunto}'`;
        if (!validarParametro(obj.CodSistema)) throw new Error('Código do sistema é inválido');
        else obj.CodSistema = `'${obj.CodSistema}'`;
        if (!validarParametro(obj.CodMeioComunicacao)) throw new Error('Código do meio de comunicação é inválido');
        else obj.CodMeioComunicacao = `'${obj.CodMeioComunicacao}'`;
        if (!validarParametro(obj.DataCriacao)) throw new Error('Data de criação é inválida');
        else obj.DataCriacao = `'${setDataSQL(obj.DataCriacao)}'`;
        if (!validarParametro(obj.DataInicio)) throw new Error('Data de início é inválida');
        else obj.DataInicio = `'${setDataSQL(obj.DataInicio)}'`;
        if (!validarParametro(obj.DataFim)) throw new Error('Data de fim é inválida');
        else obj.DataFim = `'${setDataSQL(obj.DataFim)}'`;
        if (!validarParametro(obj.Plantao)) obj.Plantao = 0;

        const retUpdate = await qryUpdate(obj);
        res.status(202).send(`Linhas afetadas: ${retUpdate.rowsAffected.length}`);
    } catch (error) {
        res.status(404).send('Informações insuficientes ou incorretas ' + error);
    }
}

module.exports = {
    Consultar,
    Inserir,
    Atualizar
}