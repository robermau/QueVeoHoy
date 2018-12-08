var conexionbd = require ('../lib/conexionbd')

function recomendarPelicula(req, res){
        var genero = req.query.genero;
        var anio_inicio = req.query.anio_inicio;
        var anio_fin = req.query.anio_fin;
        var puntuacion = req.query.puntuacion;
        var sql = "SELECT pelicula.id, titulo, poster, trama, genero.nombre FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE ";
        var filtro = "";
    
        if (anio_inicio != undefined || anio_fin != undefined) {
          filtro += "pelicula.anio BETWEEN " + anio_inicio + " AND " + anio_fin + " AND ";
        }
    
        if (genero != undefined){
          filtro += "genero.nombre = '" + genero + "' AND ";
        }
    
        if (puntuacion!= undefined) {
          filtro += "puntuacion >= " + puntuacion + " AND ";
        }

        filtro = filtro.slice(0,-5);
		sql += filtro;
                  
        console.log("Consulta realizada:" + sql);
        conexionbd.query(sql, function(error, resultado){
          if (error) {
              console.log("Hubo un error en la consulta", error.message);
              return res.status(500).send("Hubo un error en la consulta");
          }
    
          var response = {
            'peliculas': resultado
          } 
          res.send(JSON.stringify(response));
        });
}


module.exports = {
  recomendarPelicula : recomendarPelicula
};
