'use strict';
import { USUARIOS_DB } from "../data/juego.data.js";
import { Usuarios } from "../models/juego.model.js";


// Función para almacenar los usuarios en localStorage
function almacenarUsuarios() {
  USUARIOS_DB.forEach(usuario => {
    // Guardamos cada usuario en localStorage
    localStorage.setItem(usuario.id, JSON.stringify(usuario));
 });}

//Función para validar los datos de usuario
var btnacceder = $("#acceder");
btnacceder.click(function(event){
    event.preventDefault(); // Evita que se recargue la página al pinchar en el botón del formulario
    var usuario = $("#usuario").val();
    var contra = $("#contrasena").val();

    //Comprobamos que la contraseña sigue el patrón
    let expresionregular = new RegExp(/^[A-Za-z0-9]+$/);
    if(expresionregular.test(contra)) {
        loginUsuarios(usuario, contra);  
    } else {
        alert("No es correcto. La contraseña solo puede contener letras y números.")        
    }
})

// Función para loguearse
function loginUsuarios(usuario, contra) {
    let usuarioCorrecto = false;

    for (let i = 0; i < localStorage.length; i++) {
    let clave = localStorage.key(i); // Obtiene la clave en esa posición
    let usuarioGuardado = JSON.parse(localStorage.getItem(clave));

        // Ahora usuarioGuardado es un objeto con id, usuario, contrasena
        if (usuarioGuardado.usuario == usuario && usuarioGuardado.contrasena == contra) {
            //Si el usuario y la contraseña coinciden, salimos del bucle
            usuarioCorrecto = true;
            localStorage.setItem("usuarioLogeado", usuarioGuardado.id);
            break; // para salir del bucle
        }
    }

    // Solo se ejecuta una vez, cuando acaba el for
    if (usuarioCorrecto) {
        //window.location.href = "../paginas/bienvenida.html";
        window.location.href = "paginas/bienvenida.html";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
 }



// Comprobar si esta logueado
function checkLogin(spanId) {
    const spanNombre = document.getElementById(spanId);

    // Recuperamos el id del usuario logueado
    const idUsuario = localStorage.getItem("usuarioLogeado");

    // Si estamos en index.html, no hacemos nada
    if (window.location.pathname.endsWith("index.html")) {
        return null;
    }    

    // Si no hay usuario logueado → redirigimos al login
    if (!idUsuario) {
        //window.location.href = "../index.html";
        window.location.href = "index.html";
        return null;
    }

    // Si hay usuario logueado → recuperamos datos
    const usuarioGuardado = JSON.parse(localStorage.getItem(idUsuario));

    // Si el elemento existe, mostramos el nombre
    if (spanNombre) {
        spanNombre.textContent = usuarioGuardado.nombre;
    }

    // Devolvemos el usuario para poder usarlo en otras funciones
    return usuarioGuardado;
}


// Guardamos el nivel seleccionado y redirigimos al juego al hacer click en Comenzar
var btncomenzar = $("#btn-comenzar");
btncomenzar.click(function(event){
    event.preventDefault(); // Evitar que se recargue la página al pinchar en el botón del formulario
    // var dificultad = document.querySelector('input[name="dificultad"]:checked').value;
    var dificultad = $('input[name="dificultad"]:checked').val();
    localStorage.setItem("dificultadElegida", dificultad);   
    //window.location.href = "../paginas/juego.html";
    window.location.href = "juego.html";

})

// Función para guardar y mostrar nivel de juego
function mostrarNivel(nivelSpanId) {
    const spanNivel = document.getElementById(nivelSpanId);
    const dificultad = localStorage.getItem("dificultadElegida");
    if (spanNivel) spanNivel.textContent = dificultad;
    return dificultad;
}


// Función para mostrar resultados
function mostrarResultados(resultadoSpanId, nombreSpanId, nivelSpanId, movimientosSpanId, tiempoSpanId) {
  const resultadoJuego = JSON.parse(localStorage.getItem("resultadoJuego"));
  const idUsuario = localStorage.getItem("usuarioLogeado");
  const usuarioGuardado = idUsuario ? JSON.parse(localStorage.getItem(idUsuario)) : { nombre: "Jugador" };
  const nivelElegido = localStorage.getItem("nivelElegido") || localStorage.getItem("dificultadElegida") || "Desconocido";

  const resultadoSpan = document.getElementById(resultadoSpanId);
  const nombreSpan = document.getElementById(nombreSpanId);
  const nivelSpan = document.getElementById(nivelSpanId);
  const movimientosSpan = document.getElementById(movimientosSpanId);
  const tiempoSpan = document.getElementById(tiempoSpanId);

  if(!resultadoJuego) return;

  if(resultadoSpan) resultadoSpan.textContent = resultadoJuego.ganado
    ? `¡GANASTE! `
    : `GAME OVER `;
  if(nombreSpan) nombreSpan.textContent = usuarioGuardado.nombre;
  if(nivelSpan) nivelSpan.textContent = nivelElegido;
  if(movimientosSpan) movimientosSpan.textContent = resultadoJuego.movimientos;
  if(tiempoSpan) tiempoSpan.textContent = resultadoJuego.tiempoRestante;

    document.getElementById("btn-reiniciar")?.addEventListener("click", () => {
      //window.location.href = "../paginas/bienvenida.html";
      window.location.href = "bienvenida.html";

    });

    document.getElementById("btn-salir")?.addEventListener("click", () => {
      localStorage.clear();
      //window.location.href = "../index.html";
      window.location.href = "../index.html";
    });
}

// Exportamos todas las fucniones para el main
export const JuegoService = {
    almacenarUsuarios,
    checkLogin,
    mostrarNivel,
    mostrarResultados
};