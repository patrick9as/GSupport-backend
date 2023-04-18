const {
    convertImageToWebp,
    generateUuidImage,
    getExtension,
} = require('../helper');

const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function uploadImage(req, res) {
    console.log('entrou na rota de upload');
    // console.log(req.files);
    const files = req.files

    for (let index = 0; index < files.length; index++) {
        const imageName = generateUuidImage();
        console.log(imageName);
        const ext = getExtension(files[index].mimetype)
        console.log(ext);
        const imageWebp = await convertImageToWebp(files[index].buffer);
        console.log(`imagem tratada foi tratada`);

        const result = await uploadFile(imageWebp, imageName, files[index].mimetype, ext);

        console.log(`resultado da s3:${result}`);

        const newImageName = `${imageName}.${ext}`;

        console.log(`novo nome: ${newImageName}`);

        console.log(files[index]);
        
    }
res.send(req.file)


}

module.exports = uploadImage
