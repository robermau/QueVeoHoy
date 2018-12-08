//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var buscadorController = require('./controladores/buscarController');
var generoController = require('./controladores/generoController');
var recomendarController = require('./controladores/calificarController')
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
// pedidos a los controller  --> Falta test 
app.get('/peliculas/' , buscadorController.buscarPeliculas)
app.get('/generos' , generoController.obtenerGenero)
app.get('/peliculas/recomendacion', recomendarController.recomendarPelicula);
app.get('/peliculas/:id', buscadorController.getPelicula)
//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

