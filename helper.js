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

    console.log('\ndata antes de formatar: ' + date);
    date = date.replace(/(\d{2})(\d{2})(\d{4})/g, '$1/$2/$3');
    console.log('dataformatada: ' + date);
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

function setTextoQuotedSQL(texto) {
    if (texto == null || texto == undefined)
        texto = `'%%'`;
    else
        texto = `'%${texto}%'`;
    return texto;
}

function setDataSQL(data) {
    /*if (data == null || data == undefined) {
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2);
        const dia = ('0' + dataAtual.getDate()).slice(-2);
        data = `${ano}-${mes}-${dia}`;
    else*/
    if (/\d{8}/.test(data)) {
        // Se a data tem exatamente 8 dígitos, assume que está no formato yyyymmdd e adiciona hífen para formatar como yyyy-mm-dd
        data = `${data.slice(0, 4)}-${data.slice(4, 6)}-${data.slice(6, 8)}`;
        /*const dataObj = new Date(Date.parse(data.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')));
        data = `${dataObj.getFullYear()}-${('0' + (dataObj.getMonth() + 1)).slice(-2)}-${('0' + dataObj.getDate()).slice(-2)}`;*/
    } else {    
        if (data == null || data == undefined) {
            const dataAtual = new Date();
            const ano = dataAtual.getFullYear();
            const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2);
            const dia = ('0' + dataAtual.getDate()).slice(-2);
            data = `${ano}-${mes}-${dia}`;
        }else {

        console.log('\ndata antes de formatar:' + data);
        const dataObj = new Date(Date.parse(data.replace(/(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2}):(\d{2})/, '$2/$1/$3 $4:$5:$6')));
        console.log('dataObj: ' + dataObj);
        data = `${dataObj.getFullYear()}-${('0' + (dataObj.getMonth() + 1)).slice(-2)}-${('0' + dataObj.getDate()).slice(-2)} ${('0' + dataObj.getHours()).slice(-2)}:${('0' + dataObj.getMinutes()).slice(-2)}:${('0' + dataObj.getSeconds()).slice(-2)}`;
        console.log('dataformatada: ' + data);
        }
    }

    //A data sempre será retornada no formato yyyy-mm-dd hh:mm:ss
    return data;
}

function validarParametro(field) {
    if (field == null || field == undefined)
        return false;
    else
        return true;
}

module.exports = {
    FormatDate,
    Encrypt,
    generateUuidImage,
    getExtension,
    convertImageToWebp,
    setTextoQuotedSQL,
    setDataSQL,
    validarParametro
};