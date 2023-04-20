const {
    convertImageToWebp,
    generateUuidImage,
    getExtension,
} = require('../helper');

const { uploadFile, getObjectSignedUrl } = require('../aws/s3');

async function uploadImages(filesImages) {
    console.log('entrou na funcao Upload Images');
    // console.log(req.files);
    const files = filesImages
    // const files = req.files
    let imageArr = []

    for (let index = 0; index < files.length; index++) {
        let imageName = generateUuidImage();
        console.log(imageName);
        let ext = getExtension(files[index].mimetype)
        console.log(ext);
        let imageWebp = await convertImageToWebp(files[index].buffer);
        console.log(`imagem foi tratada`);

        let result = await uploadFile(imageWebp, imageName, files[index].mimetype, ext);

        console.log(`resultado da s3:${result}`);

        const newImageName = `${imageName}.${ext}`;

        imageArr.push(newImageName)
        console.log(`*** Colocou no array`);

        console.log(`novo nome: ${newImageName}`);

        // console.log(files[index]);

    }
    return imageArr
}


async function getImagesS3(images) {

    console.log(`*** Entrou na funcao GetImagesS3`);

    let imagesArr = []

    for (let index = 0; index < images.length; index++) {
        let image = images[index].Imagem
        let resultGetImage = await getObjectSignedUrl(image)

        imagesArr.push(resultGetImage)
    }
    
    return imagesArr
}
module.exports = { uploadImages, getImagesS3 }
