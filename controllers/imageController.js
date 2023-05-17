const { deleteFile } = require('../aws/s3')
const { getImageObj } = require('../aws/s3')

async function deleteImage(req, res) {
    const dados = req.body
    console.log(dados.images);
    const images = dados.images
    var arrErrorImageMsg = []
    var arrSuccessImageMsg = []

    console.log("*** entrou no forlooping");
    for (let index = 0; index < images.length; index++) {
        console.log(images[index]);
        try {
            const queryResultImage = await getImageObj(images[index])
            console.log(`*** Resultado da queryResult: ${queryResultImage}`);
            await deleteFile(images[index])
            arrSuccessImageMsg.push(`Imagem '${images[index]} foi deletada!'`)
        } catch (error) {
            console.log(`Erro ao consultar imagem: ${error}`);
            arrErrorImageMsg.push(`A imagem '${images[index]}' já não consta mais no sistema / Error: ${error}`)
        }

    }

    res.status(200).json({ Sucesso: arrSuccessImageMsg, Falha: arrErrorImageMsg })
}

module.exports = { deleteImage }
