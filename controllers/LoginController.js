const sql = require('../db')
const {Encrypt} = require('../helper')

async function Login(req, res) {
    try {
        const { Usuario, Senha } = req.body
        console.log(req.body)

        let script = `select * from sup.usuarios`
        script += `\nwhere Usuario = '${Usuario}' and Senha = '${Senha}'`
        //console.log(query)

        // let dados = {Usuario, "token":Senha}

        // sql.query(query, (err, data)=>{
            // if (err) console.log(`Erro ao fazer login: ${err}`)
            // console.log(data.recordset[0].Senha)
            // dados = {
            //     usuario: data.recordset[0].Usuario,
            //     token: data.recordset[0].Senha
            // }
        // })

        const [retorno, senhaHash] = await Promise.all([await sql.query(script), await Encrypt(Senha)]);
        // console.log(script);
        // const retorno = await sql.query(script);
        // const senhaHash = await Encrypt(Senha);
        //console.log(senhaHash)
        //res.status(200).json({...dados, senhaHash})
        // console.log(retorno);
        if (retorno.recordset.length > 0) 
            res.status(200).send({userData: retorno.recordset[0], senhaHash});
        else
            res.status(404).send('Usuário não encontrado!');
    } catch {
        res.status(404).send('Falha no login!');
    }
}

module.exports = {Login}