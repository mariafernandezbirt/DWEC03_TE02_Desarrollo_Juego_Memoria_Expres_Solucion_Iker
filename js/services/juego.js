'use strict';

// Función principal para iniciar el juego
export function iniciarJuego(dificultad) {
    const tablero = document.getElementById("tablero");
    if (!tablero) return; // salimos si no hay tablero en esta página

    const timerSpan = document.getElementById("timer");

    // Definir el tablero / número de cartas(pares) según dificultad
    let pares;

    switch(dificultad) {
        case "Fácil":
            pares = ["<i class='fa-solid fa-heart'></i>", "<i class='fa-solid fa-star'></i>", "<i class='fa-solid fa-bolt-lightning'></i>", "<i class='fa-solid fa-cloud'></i>"];
            break;
        case "Intermedio":
            pares = ["<i class='fa-solid fa-heart'></i>", "<i class='fa-solid fa-star'></i>", "<i class='fa-solid fa-moon'></i>", "<i class='fa-solid fa-cloud'></i>", "<i class='fa-solid fa-bolt-lightning'></i>", "<i class='fa-solid fa-circle'></i>"];
            break;
        case "Difícil":
            pares = ["<i class='fa-solid fa-heart'></i>", "<i class='fa-solid fa-star'></i>", "<i class='fa-solid fa-moon'></i>", "<i class='fa-solid fa-cloud'></i>", "<i class='fa-solid fa-bolt-lightning'></i>", "<i class='fa-solid fa-circle'></i>", "<i class='fa-solid fa-clover'></i>", "<i class='fa-solid fa-diamond'></i>"];
            break;
           
        default:
            console.warn("Nivel no válido, usando 'Fácil' por defecto");
            pares = ['<i class="fa-solid fa-heart"></i>', '<i class="fa-solid fa-star"></i>', '<i class="fa-solid fa-bolt-lightning"></i>', '<i class="fa-solid fa-cloud"></i>'];
    }

    // Duplicar y mezclar los pares de cartas
    let cartas = shuffle([...pares, ...pares]);

    // Limpiar tablero y crear cartas
    tablero.innerHTML = "";
    cartas.forEach(valor => {
        const carta = document.createElement("div");
        carta.classList.add("carta");
        carta.dataset.valor = valor;

        // Contenido de la carta (frente)
        const frente = document.createElement("div");
        frente.classList.add("frente");
        frente.innerHTML = valor;

        // Parte trasera
        const atras = document.createElement("div");
        atras.classList.add("atras");
        atras.textContent = "";

        carta.appendChild(frente);
        carta.appendChild(atras);
        tablero.appendChild(carta);
    });

    let cartasVolteadas = [];
    let movimientos = 0;

    // Función para voltear cartas
    function voltearCarta(carta) {
        // quitar efecto mouseover si estaba
        carta.classList.remove("carta_encima");

        carta.classList.add("girada");
        cartasVolteadas.push(carta);

        if (cartasVolteadas.length === 2) {
            movimientos++;
            if(cartasVolteadas[0].dataset.valor === cartasVolteadas[1].dataset.valor){
                cartasVolteadas.forEach(c => c.classList.add("acertada"));
                cartasVolteadas = [];
                if(document.querySelectorAll(".acertada").length === cartas.length){
                    finJuego(true);
                }
            } else {
                setTimeout(() => {
                    cartasVolteadas.forEach(c => c.classList.remove("girada"));
                    cartasVolteadas = [];
                }, 1000);
            }
        }
    }


    // Evento Click con la función para voltear cartas
    tablero.addEventListener("click", e => {
        const carta = e.target.closest(".carta");
        if(!carta || carta.classList.contains("girada") || carta.classList.contains("acertada")) return;
        voltearCarta(carta);
    });

    // Una vez generadas las cartas
    tablero.querySelectorAll(".carta").forEach(carta => {
        // Evento Mouseover
        carta.addEventListener("mouseenter", () => {
            if (!carta.classList.contains("girada") && !carta.classList.contains("acertada")) {
                carta.classList.add("carta_encima");
            }
        });
        // Evento Mouseleave
        carta.addEventListener("mouseleave", () => {
            carta.classList.remove("carta_encima");
        });
    });

    // Evento dobleClick
    tablero.addEventListener("dblclick", e => {
        const carta = e.target.closest(".carta");
        if(carta && carta.classList.contains("girada") && !carta.classList.contains("acertada")){
            carta.classList.remove("girada");
            cartasVolteadas = cartasVolteadas.filter(c => c !== carta);
        }
    });

    // Temporizador
    let tiempo = 30; 
    timerSpan.textContent = "00:30";

    let intervalo = setInterval(() => {
        tiempo -= 1; // restamos 1 segundo
        if (tiempo < 0) tiempo = 0;

        // Convertir a minutos y segundos
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;

        // Mostrar con formato 00:00
        timerSpan.textContent =
            `${minutos.toString().padStart(2, "0")}:` +
            `${segundos.toString().padStart(2, "0")}`;

        if (tiempo === 0) {
            clearInterval(intervalo);
            finJuego(false);
        }
    }, 1000); // intervalos de 1 segundo

    function finJuego(ganado) {
        clearInterval(intervalo);

        // Guardar minutos y segundos como string mm:ss
        const minutos = Math.floor(tiempo / 60);
        const segundos = tiempo % 60;
        const tiempoFormateado = `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;

        // Guardar datos en localStorage
        localStorage.setItem("resultadoJuego", JSON.stringify({
            ganado,
            movimientos,
            tiempoRestante: tiempoFormateado
        }));

            // Redirigir a página de resultados
            window.location.href = "paginas/resultados.html";
            //window.location.href = "resultados.html";
    }
}

// Función para mezclar las cartas (Array)
function shuffle(array){
    for(let i = array.length -1; i >0; i--){
        const j = Math.floor(Math.random()*(i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
