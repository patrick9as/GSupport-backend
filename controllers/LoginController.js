const { qryValidarUsuario } = require('../model/LoginModel');
const { Encrypt } = require('../helper');


async function Login(req, res) {
    try {
        let obj = { Usuario, Senha } = req.body
                
        const resValidarUsuario = await qryValidarUsuario(obj);
        const senhaHash = await Encrypt(obj.Senha);

        if (resValidarUsuario.recordsets[0].length > 0) {
            const senhaHash = await Encrypt(obj.Senha);
            res.status(200).send({userData: resValidarUsuario.recordset[0], senhaHash});
        }
        else
            res.status(404).send('Usuário não encontrado!');
    } catch (error) {
        res.status(404).send('Falha no login ' + error);
    }
}

module.exports = { Login }