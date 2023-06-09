const sql = require('../db')

async function readRecord(req, res){
    const {id} = req.query
    const query = id ? `select * from sup.usuarios where codigo = ${id}` : 'select * from sup.usuarios' 
    try {
        let usuarios = await sql.query(query)
        
        const usuario = usuarios.recordset.map(user =>
                user = {nome:user.Nome, cargo: user.Cargo }
            )
        res.status(202).send(usuarios.recordset)
    } catch (error) {
        console.log(error)
        res.status(500).json({error})
    }
}

module.exports = {readRecord}