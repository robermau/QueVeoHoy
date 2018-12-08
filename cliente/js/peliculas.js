//ip y puerto al que se le realizaran los pedidos
var servidor = 'http://localhost:8080';
$(document).ready(function() {
    //se hace el pedido al backend de todos los generos para cargalos en el listado de géneros
    $.getJSON(servidor + "/generos",
        function(data) {
            for (i = 0; i < data.generos.length; i++) {
                //se duplica una opcion de la lista de selección
                var opcion = $(".genero-select option[value='0']").clone();
                //a esa opcion se le asigna como valor el id del genero, dato que luego va a servir para filtrar por id de genero.
                opcion.attr("value", (data.generos)[i].id);
                //se le pone el nombre del genero al texto de la opcion
                opcion.html((data.generos)[i].nombre);
                //se agrega la opcion a la lista de seleccion
                $(".genero-select").append(opcion);
            }
        });

    var controladorPeliculas = new ControladorPeliculas();
    //se le asigna la funcion buscarPeliculas() al boton de buscar
    $('.buscar').click(function() {
        $(".alerta-resultados").hide();
        controladorPeliculas.buscarPeliculas();
    });
    //se ejecuta la funcion buscarPeliculas() para cargar la primera pagina del listado
    controladorPeliculas.buscarPeliculas();
});

function ControladorPeliculas() {
    //esta funcion recibe la pagina y la cantidad de resultados que se quiere mostrar y se encarga de armar el pedido
    //que se le va a hacer al backend para obtener las peliculas
    this.buscarPeliculas = function(pagina, cantidad) {
            var self = this;
            //se obtienen los valores por los cuales se va a filtrar
            var titulo = $(".titulo-busqueda").val();
            var genero = $(".genero-select option:selected").attr("value");
            var orden = $(".orden-select option:selected").attr("value");
            var anio = $(".anio-busqueda").val();
            
            //si se recibio como parametro el numero de pagina se envia ese valor, sino, se pide la pagina 1
            var pagina_solicitada = (pagina) ? pagina : 1;

            //se crea un objeto que tenga como atributos los parámetros que vamos a pasarle al backend
            var query_params = {
                pagina: pagina_solicitada
            };
            //solo se envia el parametro titulo si hay algun valor para filtrar por ese campo
            if (titulo) {
                query_params.titulo = titulo;
            }

            //Si el value del género que se seleccionó es igual a 0, significa que se selecciono la opcion
            //"Todos". Por eso, si se elige ver todos los generos, no se envia ese parametro de filtro.
            if (genero != 0) {
                query_params.genero = genero;
            }

            //solo se envia el parametro año si hay algun valor para filtrar por ese campo
            if (anio) {
                query_params.anio = anio;
            }

            //si se recibio como parametro la cantidad de resultados a mostrar se envia ese valor, sino, se piden 52 peliculas
            query_params.cantidad = (cantidad) ? cantidad : 52;

            //el value de cada opcion de la lista de seleccion de "Ordenar por" esta formado por:
            //nombre de la columna por la que se va a ordenar - tipo de orden (descendente o ascendente)
            //aca se divide el value de la opcion seleccionada en dos campos, la columna orden y el tipo de orden
            var orden_array = orden.split("-");
            query_params.columna_orden = orden_array[0];
            query_params.tipo_orden = orden_array[1];

            var query = $.param(query_params);

            //se hace el pedido al backend de las peliculas
            $.getJSON(servidor + "/peliculas?" + query,
                function(data) {
                    //se ejecuta la funcion cargarListado() pasandole como parametro las peliculas que se obtuvieron
                    self.cargarListado(data.peliculas);
                    //se ejecuta la fucion cargarBotones() pasandole el total de peliculas que se obtienen como resultado
                    self.cargarBotones(data.total);
                });
        },

        //esta función recibe como parámetro todas las películas que se quieren mostrar y se encarga de crear los elementos html correspondientes
        this.cargarListado = function(peliculas) {
            //se vacia el contenedor de las peliculas
            $(".contenedor-peliculas").empty();
            var self = this;
            var cantidad = peliculas.length;
            if (cantidad == 0) {
                //en el caso de no haber resultados, se muestra la alerta
                $(".alerta-resultados").show();
            } else {
                for (i = 0; i < cantidad; i++) {
                    //se clona un elemento que funciona como ejemplo de como se van a mostrar las peliculas por pantalla
                    var pelicula = $(".ejemplo-pelicula").clone();
                    //se cargan los datos de las películas
                    pelicula.find(".imagen").attr("src", peliculas[i].poster);
                    pelicula.find(".trama").html(peliculas[i].trama);
                    pelicula.find(".titulo").html(peliculas[i].titulo);
                    pelicula.attr("id", peliculas[i].id);
                    //cuando se haga click en una película, se va a redirigir la aplicación a la página info.html  
                    pelicula.click(function() {
                        window.location.href = "info.html?id=" + this.id;
                    });
                    //se agrega la pelicula que al contenedor de peliculas
                    pelicula.appendTo($(".contenedor-peliculas"));
                    //esta pelicula no va a ser mas de la clase ejemplo-pelicula
                    pelicula.removeClass("ejemplo-pelicula");
                    //se muestra la pelicula que se creo
                    pelicula.show();
                }

            }
        },

        //esta función recibe como parámetro el total de películas que se obtienen como resultado. Según esa cantidad 
        //crea los botones de la paginación y les da la funcionalidad correspondiente
        this.cargarBotones = function(total) {
            //se establece que se van a mostrar 52 resultados por pagina
            var cantidad_por_pagina = 20;
            var self = this;
            //la cantidad de paginas va a ser el total de resultados que existen dividido la cantidad de resultados que se
            //van a mostrar por pagina.
            cantidad_paginas = Math.ceil(total / cantidad_por_pagina);
            //se vacia el contenedor de botones de paginacion
            $(".btn-group").empty();
            for (i = 0; i < cantidad_paginas; i++) {
                //se clona un boton de ejemplo
                var boton = $(".ejemplo-boton").clone();
                //le asignamos al botón el numero de pagina
                boton.html(i + 1);
                //le asignamos el atributo numero de pagina
                boton.attr("numero-pagina", i + 1);
                //agregamos el botón al contenedor de botones
                boton.appendTo($(".btn-group"));
                //este botón no va a ser mas de la clase ejemplo-boton
                boton.removeClass("ejemplo-boton");
                //se muestra el botón creado
                boton.show();
            }
            $(".boton-pagina").click(function() {
                //cada boton tiene como funcionalidad buscarPeliculas(). A esta funcion se le pasa como parametro
                //el atributo "numero-pagina".
                self.buscarPeliculas($(this).attr("numero-pagina"));
                scroll(0, 0);
            });
        }

}