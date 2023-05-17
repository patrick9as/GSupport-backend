const {S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand} =  require('@aws-sdk/client-s3')
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
    const seconds = 120
    const url = await getSignedUrl(client, command, {expiresIn: seconds})

    return url
}

async function deleteFile(key){
    const params = {
        Bucket: bucketName,
        Key: key
    }
    const command = new DeleteObjectCommand(params)
    return await client.send(command)
}

async function getImageObj (key){
    const params = {
        Bucket: bucketName,
        Key: key
    }

    const command = new GetObjectCommand(params)
    return await client.send(command)
}
module.exports = {uploadFile, getObjectSignedUrl, deleteFile, getImageObj}