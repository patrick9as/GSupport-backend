//------------------------- index.js
const express = require('express')

const multer = require('multer')
const sharp = require('sharp')
const crypt = require('crypto')
const mime = require('mime-types')

const {uploadFile, getObjectSignedUrl} = require('./s3')


const app = express()


const storage = multer.memoryStorage()
const upload = multer ({ storage: storage})

app.post('/images', upload.single('image'), async (req, res)=>{
    console.log(process.env.AWS_BUCKET_NAME);
    const file = req.file
    const caption = req.body.caption
    const imageName = crypt.randomUUID()
    const ext = mime.extension(req.file.mimetype)
    //console.log();
    console.log(ext);

    const convertImageToWebp =  await sharp(file.buffer)
        .webp({lossless: true})
        .toBuffer()

        await uploadFile(convertImageToWebp, imageName, file.mimetype, ext)
    const data = {
        imageName: `${imageName}.${ext}`,
        caption,
        size: req.file.size,
        convertion: convertImageToWebp.byteLength
    }

    console.log(data);
    res.send(data)
})

app.get('/images', async (req, res) =>{
    const result = await getObjectSignedUrl('23a5c71c-4d01-4b8c-aed5-e84f27c19fab.png')
    console.log(result)
    res.send(result)
} )
app.listen(3000, ()=>{
    console.log('localhost 3000');
})

//------------------------------ s3
require('dotenv').config()

const {S3Client, PutObjectCommand, GetObjectCommand} =  require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY 

const client = new S3Client ({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
})

function uploadFile (fileBuffer, fileName, mimetype, ext){
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: `${fileName}.${ext}`,
        ContentType: mimetype
    }
    return client.send(new PutObjectCommand(uploadParams))
}

async function getObjectSignedUrl(key){
    const params = {
        Bucket: bucketName,
        Key: key
    }
    const command = new GetObjectCommand(params)
    const seconds = 60
    const url = await getSignedUrl(client, command, {expiresIn: seconds})

    return url
}
module.exports = {uploadFile, getObjectSignedUrl}
