var conexionbd = require ('../lib/conexionbd')



function  buscarPeliculas(req, res) {
        
       var queryParams = ''
       if(req.query.genero){
                queryParams = " AND genero_id = " + req.query.genero;
       }        
        if(req.query.titulo){
                queryParams = "AND titulo LIKE '%" + req.query.titulo + "%'";
        }
        if(req.query.anio){
                queryParams = "AND anio =" + req.query.anio
        }
        if (req.query.columna_orden) {
                queryParams += " ORDER BY " + req.query.columna_orden + " ";
        }
        
        if (req.query.tipo_orden){
                queryParams += req.query.tipo_orden;
        }
        
        if (req.query.cantidad) {
                var cant= req.query.cantidad;
        } else {
                var cant = 52;
        }
        
        if (req.query.pagina) {
                var comienzo = (req.query.pagina - 1) * cant;
        }   else {
                var comienzo = 0;
        }
        
        var querysql = "SELECT * FROM pelicula WHERE 1 = 1 " + queryParams + " LIMIT " + comienzo + "," + cant + ";";
        
        conexionbd.query(querysql, function(error, resultado) {
                if(error) {
                    console.log('ERROR', error.message);
                    return res.status(500).send(error);
                } 
        
                var sql2 = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1 " + queryParams;
                conexionbd.query(sql2, function(error, total, fields) {
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(404).send("Hubo un error en la consulta");
                    }
            
                    var response = {
                        'total': total[0].total
                    };
            
                    response.peliculas = resultado;
        
                    res.send(JSON.stringify(response));
                });
        });

        
}

function getPelicula(req, res) {
        var id = req.params.id;
    
        var peliculas = "SELECT poster, titulo, anio, trama, fecha_lanzamiento, director, duracion, puntuacion, genero.nombre FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = " + id;
    
        conexionbd.query(peliculas, function(error, resultado) {
            if(error) {
                console.log('ERROR', error.message);
                return res.status(404).send(error);
            }
    
            if (resultado.length == 0) {
                console.log("ERROR");
                return res.status(404).send(error);
            }
    
            var actores = "SELECT actor.nombre FROM actor_pelicula JOIN pelicula ON pelicula_id = pelicula.id JOIN actor ON actor_id = actor.id WHERE pelicula.id = " + id;
    
            conexionbd.query(actores, function(error, actor, fields) {
                if (error) {
                    console.log("ERROR", error.message);
                    return res.status(404).send(error);
                }
    
                if (actor.length == 0) {
                    console.log("ERROR", error.message);
                    return res.status(404).send(error);
                }
    
                var generos = "SELECT genero.nombre FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = " + id;
    
                conexionbd.query(generos, function(error, genero, fields) {
                    if (error) {
                        console.log("ERROR", error.message);
                        return res.status(404).send(error);
                    }
    
                    if (genero.length == 0) {
                        console.log("ERROR", error.message);
                        return res.status(404).send(error);
                    }
                    
                        var response = {
                            'pelicula': resultado[0],
                            'actores' : actor,
                            'genero' : genero
                        };
            
                res.send(JSON.stringify(response));
                console.log(response);
                
                });
            });
        });
    
    }



module.exports = {
        buscarPeliculas : buscarPeliculas,
        getPelicula : getPelicula
};
