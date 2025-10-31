'use strict';

console.log("Fichero main.js cargado correctamente");


// Importamos las contastes / variables de los otros archivos que necesitemos usar
import { JuegoService } from "./services/juego.services.js";
import { iniciarJuego } from "./services/juego.js";


// Ejecutamos la función para almacenar los usuarios
JuegoService.almacenarUsuarios();


// Cuando se cargue el DOM:
document.addEventListener("DOMContentLoaded", () => {
    // Comprobar si está logueado y mostrar nombre
    const usuario = JuegoService.checkLogin("nombre-jugador");
    // Comprobar si hay nivel elegido y mostrar    
    const nivel = JuegoService.mostrarNivel("nivel-jugador");

    // Detectar si estamos en la página del JUEGO
    const tablero = document.getElementById("tablero");
    if (tablero) {
        // Guardar el nivel elegido
        if (nivel) {
            localStorage.setItem("nivelElegido", nivel);
        }
        // Iniciar el juego
        iniciarJuego(nivel);
        return;
    }

  // Si estamos en la página de resultados
  const resultadoSpan = document.getElementById("resultado-jugador");
  if(resultadoSpan){
    JuegoService.mostrarResultados(
      "resultado-jugador",
      "nombre-jugador",
      "nivel-jugador",
      "movimientos-jugador",
      "tiempo-jugador"
    );
  }
});
