const sql = require('../db')

function Consultar(req, res){
    const {id} = req.params
    
    let query = `select top 5 * from sup_usuarios where codigo = ${id}`

    sql.query(query, (err, result)=>{
        if(err){
            console.warn(`Erro ao buscar usuario: ${err}`)
        }
        console.log(result)
        res.status(200).json(result.recordset)
    })
}

module.exports = {Consultar}