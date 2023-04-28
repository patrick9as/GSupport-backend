const { qryUsuarios } = require('../model/LoginModel');
const { Encrypt } = require('../helper');


async function Login(req, res) {
    try {
        let obj = { Usuario, Senha } = req.body
                
        const returnQryUsuarios = await qryUsuarios(obj);
        const passwordHash = await Encrypt(obj.Senha);

        if (returnQryUsuarios.recordsets[0].length > 0) {
            const passwordHash = await Encrypt(obj.Senha);
            res.status(200).send({userData: returnQryUsuarios.recordset[0], passwordHash});
        }
        else
            res.status(404).send('Usuário não encontrado!');
    } catch (error) {
        res.status(404).send('Falha no login ' + error);
    }
}

module.exports = { Login }