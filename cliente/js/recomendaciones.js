var servidor = 'http://localhost:8080';
$(document).ready(function() {
    var controladorRecomendaciones = new ControladorRecomendaciones();
    //cuando el documento esta listo se inicializan las preguntas y se le da funcionalidad a los botones
    controladorRecomendaciones.inicializarPreguntas();
});

//se crea el objeto ControladorRecomendaciones. Sus atributos se van a ir seteando a medida que se respondan las preguntas.
function ControladorRecomendaciones() {
    this.genero = '';
    this.anio_inicio;
    this.anio_fin;
    this.resultados;
    this.puntuacion;
    this.pelicula_actual;

    //esta funcion crea y les da funcionalidad a los botones (que contienen las distintas respuestas a las pregunas).
    this.inicializarPreguntas = function() {
        var self = this;
        //se muestra el paso 1
        $(".paso-1").show();

        //al clickear cada boton se debe guardar la informacion correspondiente que luego va a ser enviada para obtener la recomendacion
        $(".paso-1 .boton-estreno").click(function() {
            self.anio_inicio = 2005;
            self.anio_fin = 2020;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-bien-puntuada").click(function() {
            self.puntuacion = 7;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-clasico").click(function() {
            self.anio_inicio = 1900;
            self.anio_fin = 2005;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-cualquiera").click(function() {
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .btn-film").click(function() {
            $(".paso-1 .btn-film").removeClass('active');
            $(".paso-1 .btn-film").css('opacity', '.3');
            $(this).addClass('active');
        });

        $(".paso-2-links .pregunta").click(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        $('.paso-2 select').change(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        //se le asigna funcionalidad al boton "Ver mas" que se va a mostrar debajo de la pelicula recomendada.
        //Este funcion redirige al usuario a la pagina que muestra mas informacion de la pelicula segun su id
        $(".botones-resultado .ver-mas").click(function() {
            var id = (self.pelicula_actual).id;
            window.location.href = "info.html?id=" + id;
            console.log(id);
        });

        //se le asigna funcionalidad al boton "Otra opcion" que se va a mostrar debajo de la pelicula recomendada.
        //este boton muestra otra pelicula como recomendacion
        $(".botones-resultado .otra-opcion").click(function() {
            self.seleccionarPelicula();
        });

        //se le asigna funcionalidad al boton "Volver" que va a reiniciar la recomendacion
        $(".botones-resultado .reiniciar, .datos-pelicula-info a.close").click(function() {
            self.reiniciarRecomendacion();
            $(".header-title h1").removeClass('small');
        });

        //se le asigna funcionalidad a la alerta que se muestra cuando no hay mas peliculas para recomendar
        $(".alerta-recomendacion .alert-link").click(function() {
            self.reiniciarRecomendacion();
            $(".alerta-recomendacion").hide();
            $(".header-title h1").removeClass('small');
        });
    }

    //esta funcion carga la segunda pregunta, es decir, oculta el paso 1 y muestra el paso 2.
    this.cargarSegundaPregunta = function() {
        $(".paso-2").addClass('active');
        $(".paso-2-links").addClass('active');
    }

    this.pedirRecomendacion = function() {

        var self = this;

        //se setean los parametros correspondientes para luego ser enviados al servidor.
        var query_params = {};

        if (this.genero)
            query_params.genero = this.genero;

        if (this.anio_inicio)
            query_params.anio_inicio = this.anio_inicio;

        if (this.anio_fin)
            query_params.anio_fin = this.anio_fin;

        if (this.puntuacion)
            query_params.puntuacion = this.puntuacion;

        if (Object.keys(query_params).length !== 0) {
            var query = $.param(query_params);
            var ruta = "/peliculas/recomendacion?"
        } else {
            var ruta = "/peliculas/recomendacion";
            var query = "";
        }

        //se realiza el pedido de recomendacion al backend
        $.getJSON(servidor + ruta + query,
            function(data) {
                //la respuesta del backend va a ser un array del peliculas. Antes de guardar ese array mezclamos su contenido
                //para que no siempre se muestren las peliculas en el mismo
                var peliculas_desordenadas = self.desordenarArray(data.peliculas);
                //se guardan las peliculas desordenadas
                self.resultados = peliculas_desordenadas;
                // se ejecuta la funcion seleccionarPelicula() 
                self.seleccionarPelicula();
            });

    }

    //esta funcion se encarga de mostrar una pelicula.
    this.seleccionarPelicula = function() {
        var cantidad = this.resultados.length;
        //si no hay mas resultados se ejecuta la funcion noHayResultados()
        if (cantidad === 0) {
            this.noHayResultados("No se encontró ninguna película para recomendar");
        } else {
            //se muestra la primera pelicula del array de resultados.
            var pelicula_mostrar = this.resultados[0];
            //esta funcion elimina el primer resultado para que no vuelva a mostrarse
            this.resultados.shift();
            //se guardan los datos de la pelicula que se esta mostrando actualmente
            this.pelicula_actual = pelicula_mostrar;
            //se ejecuta la funcion mostrarPelicula() pasandole como parametro la pelicula que debe mostrar
            this.mostrarPelicula(pelicula_mostrar);
        }
    }

    //esta funcion recibe una pelicula y se encarga de mostrarla
    this.mostrarPelicula = function(data) {
        $(".pregunta").hide();
        $(".header-title h1").addClass('small');
        $(".datos-pelicula").show();
        $(".datos-pelicula .imagen").attr("src", data.poster);
        $(".datos-pelicula .trama").html(data.trama);
        $(".datos-pelicula .titulo").html(data.titulo);
        $(".datos-pelicula .genero").html(data.nombre);

    }

    //esta funcion se encarga de mostrar la alerta cuando no hay mas resultados
    this.noHayResultados = function(mensaje) {
        $(".datos-pelicula").hide();
        $(".alerta-recomendacion").show();

    }

    //esta funcion se encarga de reiniciar una recomendacion
    this.reiniciarRecomendacion = function(mensaje) {
            //se borran los resultados y las respuestas anteriores
            this.resultados = [];
            this.anio_fin = "";
            this.anio_inicio = "";
            this.genero = "";
            this.puntuacion = "";
            //se ocultan los datos de las películas
            $(".datos-pelicula").hide();
            //se muestra el paso 1 de la recomendacion
            $(".paso-1, .pregunta").show();
        }
        //esta funcion se encarga de desordenar un array
    this.desordenarArray = function(array) {

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;

    }

}