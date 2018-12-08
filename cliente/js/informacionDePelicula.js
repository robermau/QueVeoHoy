(function() {
    var server = 'http://localhost:8080';
    var params = location.search
    //se obtiene el id de la película de la cuál tenemos que obtener la información
    var id = (params.split("="))[1];

    var controladorInformacionDePelicula = new ControladorInformacionDePelicula();
    //se obtiene la información de la película
    controladorInformacionDePelicula.obtenerPelicula(id);

    function ControladorInformacionDePelicula() {
        this.cargarDetalle = function(data) {
                var pelicula, actores;
                
                pelicula = data.pelicula;
                actores = data.actores;
                genero = data.pelicula.nombre;

                $(".imagen").attr("src", pelicula.poster);
                $(".titulo, title").html(pelicula.titulo + " (" + pelicula.anio + ")");
                $(".trama").html(pelicula.trama);
                var fecha = new Date(pelicula.fecha_lanzamiento);
                $(".lanzamiento").html(fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getUTCFullYear());
                $(".genero").html(genero);
                $(".director").html(pelicula.director);
                $(".duracion").html(pelicula.duracion);
                $(".rank").html(pelicula.puntuacion + "/10");
                var actores_string = '';
                for (i = 0; i < actores.length; i++) {
                    actores_string += actores[i].nombre + ", "
                }
                $(".actores").html(actores_string.slice(0, -2));
            },
            //esta función recibe como parámetro el id de una película y se encarga de pedirle al backend la información de la misma.
            this.obtenerPelicula = function(id) {
                var self = this;
                $.getJSON(server + "/peliculas/" + id,
                    function(data) {
                        self.cargarDetalle(data);
                        //en el caso de que no se encuentre la pelicula, redirigir a la pagina de error
                    }).fail(function() {
                    window.location.href = "error.html";
                });
            }

    }
})();