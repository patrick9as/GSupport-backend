const { hash } = require('bcrypt')
const crypto = require('crypto')
const mime = require('mime-types')
const sharp = require('sharp')

async function Encrypt(senha) {
    const saltRounds = 5
    const result = await hash(senha, saltRounds)
    return result
}

/* ------ */
function FormatDate(date) {
    date = date.replace(/(\d{2})(\d{2})(\d{4})/g, '$1/$2/$3');
    return date;
}

function generateUuidImage() {
    return crypto.randomUUID()
}

function getExtension(file) {
    return mime.extension(file)

}

async function convertImageToWebp(file){
    const result = await sharp(file)
        .webp({lossless:true})
        .toBuffer() 
    return result
}
module.exports = {
    FormatDate,
    Encrypt,
    generateUuidImage,
    getExtension,
    convertImageToWebp
};