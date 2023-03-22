const sql = require('../db')
const {Encrypt} = require('../helper')

async function Login(req, res){
    const { Usuario, Senha } = req.body
    //console.log(req.body)

    let query = `select Codigo, Nome, Senha from sup_usuarios`
    query += `\nwhere Nome = '${Usuario}' and Senha = '${Senha}'`
    //console.log(query)

    let dados = {Usuario, "token":Senha}

    sql.query(query, (err, data)=>{
        if (err) console.log(`Erro ao fazer login: ${err}`)
        // console.log(data.recordset[0].Senha)
        dados = {
            usuario: data.recordset[0].Nome,
            token: data.recordset[0].Senha
        }
    })


    const senhaHash = await Encrypt(Senha)
    //console.log(senhaHash)
    res.status(200).json({...dados, senhaHash})

}

module.exports = {Login}