var conexionbd = require ('../lib/conexionbd')




function  obtenerGenero(req, res) {
    id = req.query.id
    var querysql =  "select * from genero;"
    conexionbd.query(querysql,function(error,resultado){
       if(error){ 
            console.log("Hubo un error en la consulta" ,error.message);
            return res.status(404).send("hubo un error en la consulta")
       }
       
       var response = {
            'generos' : resultado
            };
        console.log(response);    
       res.send(JSON.stringify(response));
    });
}

module.exports = {
    obtenerGenero : obtenerGenero
};
