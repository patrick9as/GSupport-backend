const sql = require('../db')
const {Encrypt} = require('../helper')

async function Login(req, res){
    //const { usuario, senha } = req.body
    console.log(req.body)

    //let query = `select nome, senha, id  from where usuario = ${usuario} and senha ${senha}`

    // sql.query(query, (err, result)=>{
    //     if (err) console.log(`Erro ao fazer login: ${err}`)
    // })

    const senha = "123444"
    const senhaHash = await Encrypt(senha)
    console.log(senhaHash)
    //const result  = { usuario, senha, senhaHash}
    res.status(200).json({senhaHash})
}

module.exports = {Login}