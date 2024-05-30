import './style.css';

const colors = ['red', 'green', 'black'];
const textLabels = { red: '💎', green: '✂️', black: '🧻' };

let started = false;
let gameInterval = null; // Variable para almacenar el intervalo del juego

// Crear el tablero
const canvas = document.getElementById('tablero');
const ctx = canvas.getContext('2d');

// Tamaño del cuadro
const cuadroRojo = 6;
const velocidad = 0.5;

const cantidadCuadros = 45;
const maxColorCount = Math.floor(cantidadCuadros / 3);

// Crear un array de cuadros
const cuadros = [];
const colorCounts = { red: 0, green: 0, black: 0 };

// Función para obtener un color manteniendo el equilibrio
function obtenerColorEquilibrado() {
  const coloresDisponibles = colors.filter(color => colorCounts[color] < maxColorCount);
  const colorSeleccionado = coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)];
  colorCounts[colorSeleccionado]++;
  return colorSeleccionado;
}

// Función para inicializar los cuadros
function inicializarCuadros() {
  cuadros.length = 0; // Limpiar el array de cuadros antes de inicializarlo de nuevo

  for (let i = 0; i < cantidadCuadros; i++) {
    const color = obtenerColorEquilibrado();
    cuadros.push({
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
      direccionX: Math.random() < 0.5 ? 1 : -1,
      direccionY: Math.random() < 0.5 ? 1 : -1,
      color
    });
  }
}

// Dibujar los cuadros
function dibujarCuadros() {
  const colorCounts = { red: 0, green: 0, black: 0 };
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
  ctx.font = `${cuadroRojo}px Arial`; // Ajustar el tamaño de la fuente para que el texto se vea bien

  cuadros.forEach(cuadro => {
    ctx.fillStyle = cuadro.color;
    ctx.fillText(textLabels[cuadro.color], cuadro.x, cuadro.y + cuadroRojo / 2);
    colorCounts[cuadro.color]++;
  });

  // Comprobar si todos los cuadros son del mismo color
  const colors = Object.keys(colorCounts);
  for (const color of colors) {
    if (colorCounts[color] === cantidadCuadros) {
      winner(color);
      return; // Detener el juego una vez que haya un ganador
    }
  }
}

// Colisiones entre los cuadros y si colisionan cambiar de dirección
function colisiones() {
  for (let i = 0; i < cuadros.length; i++) {
    for (let j = i + 1; j < cuadros.length; j++) {
      const cuadro1 = cuadros[i];
      const cuadro2 = cuadros[j];

      const leftCuadro1 = cuadro1.x;
      const rightCuadro1 = cuadro1.x + cuadroRojo;
      const topCuadro1 = cuadro1.y;
      const bottomCuadro1 = cuadro1.y + cuadroRojo / 2;

      const leftCuadro2 = cuadro2.x;
      const rightCuadro2 = cuadro2.x + cuadroRojo;
      const topCuadro2 = cuadro2.y;
      const bottomCuadro2 = cuadro2.y + cuadroRojo / 2;

      if (
        rightCuadro1 > leftCuadro2 &&
        leftCuadro1 < rightCuadro2 &&
        bottomCuadro1 > topCuadro2 &&
        topCuadro1 < bottomCuadro2
      ) {
        cuadro1.direccionX *= -1;
        cuadro1.direccionY *= -1;
        cuadro2.direccionX *= -1;
        cuadro2.direccionY *= -1;

        guerra(cuadro1, cuadro2);
      }
    }
  }
}

// Reglas de piedra, papel, tijera
function guerra(cuadro1, cuadro2) {
  if (cuadro1.color === 'red' && cuadro2.color === 'green') {
    cuadro2.color = 'red';
  } else if (cuadro1.color === 'green' && cuadro2.color === 'black') {
    cuadro2.color = 'green';
  } else if (cuadro1.color === 'black' && cuadro2.color === 'red') {
    cuadro2.color = 'black';
  } else if (cuadro2.color === 'red' && cuadro1.color === 'green') {
    cuadro1.color = 'red';
  } else if (cuadro2.color === 'green' && cuadro1.color === 'black') {
    cuadro1.color = 'green';
  } else if (cuadro2.color === 'black' && cuadro1.color === 'red') {
    cuadro1.color = 'black';
  }
}

// Función para manejar el evento de finalización del juego
function winner(color) {
  // Mostrar un mensaje de alerta con el texto del ganador
  alert("Ganador: " + textLabels[color]);
  clearInterval(gameInterval); // Detener el intervalo del juego
  gameInterval = null; // Reiniciar el intervalo a null
  started = false;// Reiniciar el estado del juego
  let buttonStart = document.getElementById('start')
  buttonStart.disabled = true;
  let buttonReset = document.getElementById('reset')
  buttonReset.disabled = true;
  setTimeout(() => {
    window.location.reload();
  }, 1000);

}

// Función para mover los cuadros y aplicar colisiones
function moverCuadros() {
  cuadros.forEach(cuadro => {
    cuadro.x += velocidad * cuadro.direccionX;
    cuadro.y += velocidad * cuadro.direccionY;

    if (cuadro.x <= 0 || cuadro.x >= canvas.width - cuadroRojo) {
      cuadro.direccionX *= -1;
    }
    if (cuadro.y <= 0 || cuadro.y >= canvas.height - cuadroRojo / 2) {
      cuadro.direccionY *= -1;
    }
  });

  colisiones();
  dibujarCuadros();
}

// Event listener para el botón Start
let botonStart = document.getElementById('start');
botonStart.addEventListener('click', () => {
  if (!started) {
    if (gameInterval === null) {
      inicializarCuadros(); // Inicializar los cuadros antes de iniciar el juego
      gameInterval = setInterval(moverCuadros, 10);
    }
    started = true;
  } else {
    alert('El juego ya ha comenzado');
  }
});

// Event listener para el botón Reset
let botonReset = document.getElementById('reset');
botonReset.addEventListener('click', () => {
  window.location.reload();
  if (gameInterval !== null) {
    clearInterval(gameInterval); // Detener el intervalo del juego actual
    gameInterval = null; // Reiniciar el intervalo a null
  }
  inicializarCuadros(); // Inicializar los cuadros
  dibujarCuadros(); // Dibujar los cuadros inicializados
  started = false; // Reiniciar el estado del juego
});
