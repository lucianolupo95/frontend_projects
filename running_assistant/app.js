// Verifica si el navegador soporta Service Workers
if ("serviceWorker" in navigator) {
  // Intenta registrar un Service Worker desde el archivo "sw.js"
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker registrado.")) // Registro exitoso
    .catch(
      (error) => console.error("Error al registrar el Service Worker:", error) // Maneja errores de registro
    );
}

// Verifica si el navegador soporta notificaciones
if ("Notification" in window) {
  // Solicita permiso al usuario para enviar notificaciones
  Notification.requestPermission().then((permission) => {
    console.log("Permiso de notificación:", permission); // Muestra el estado del permiso
  });
}

// Función para mostrar una notificación al usuario
function showNotification() {
  // Comprueba si el permiso para notificaciones es "granted" (concedido)
  if (Notification.permission === "granted") {
    // Crea y muestra una nueva notificación
    new Notification("¡Es hora de cambiar!", {
      body: "Haz clic aquí para más detalles.", // Mensaje adicional en la notificación
      icon: "https://via.placeholder.com/100", // Icono mostrado junto a la notificación
    });
  } else {
    // Alerta al usuario si no ha habilitado las notificaciones
    alert("Por favor, habilita las notificaciones en tu navegador.");
  }
}

// Agrega un evento al botón con ID "start-button"
// Este evento se dispara cuando el usuario hace clic en el botón
// document.getElementById("start-button").addEventListener("click", () => {
//   // Crea un nuevo objeto de audio con el archivo "alarm.mp3"
//   const audio = new Audio("alarm.mp3");

//   // Usa un temporizador (2 segundos) antes de reproducir el sonido
//   setTimeout(() => {
//     audio
//       .play() // Intenta reproducir el sonido
//       .then(() => {
//         console.log("Sonido reproducido."); // Confirmación de que el sonido se reprodujo
//       })
//       .catch((error) => {
//         // Maneja errores al intentar reproducir el sonido (por ejemplo, sin interacción del usuario)
//         console.error("Error al reproducir sonido:", error);
//         alert("Asegúrate de interactuar con la página para reproducir sonido.");
//       });
//   }, 2000); // Retraso de 2000 ms (2 segundos)
// });
const log = document.getElementById("log");
const clock = document.getElementById("clock");
const setAlarm = (audioRoute, time) => {
  const audio = new Audio(audioRoute);
  setTimeout(() => {
    audio
      .play()
      .then(() => {
        console.log("Sonido reproducido.");
      })
      .catch((error) => {
        console.error("Error al reproducir sonido:", error);
        alert("Asegúrate de interactuar con la página para reproducir sonido.");
      });
  }, time);
};

const setSound = (type, minutes) => {
  log.innerHTML += type + " " + minutes + "<br>";
  switch (type) {
    case "start":
      setAlarm("assets/warming.mp3", 0);
      break;
    case "totalTime":
      setAlarm("assets/finished.mp3", minutes * 60000);
      break;
    case "run":
      setAlarm("assets/run.mp3", minutes * 60000);
      break;
    case "walk":
      setAlarm("assets/walk.mp3", minutes * 60000);
      break;
    case "warming":
      setAlarm("assets/warming.mp3", minutes * 60000);
      break;
    case "cooling":
      setAlarm("assets/cooling.mp3", minutes * 60000);
      break;
    default:
      alert("Error seteando alarma: " + type);
  }
};

//Lógica de notificaciones
document.getElementById("submit-btn").addEventListener("click", (e) => {
  e.preventDefault();
  totalMinutes = document.getElementById("total-minutes").value;
  //TODO Comprobar que sea Int
  totalMinutesInt = Number(totalMinutes);
  if (totalMinutesInt == 0) {
    alert("Los minutos totales no pueden ser cero");
    return;
  }
  //Setear Calentamiento
  warmingTime = document.getElementById("warming").value;
  warmingTimeInt = Number(warmingTime);
  if (warmingTimeInt == NaN) {
    alert("Revisa los minutos de calentamiento");
    return;
  }
  //Setear Run
  runningTime = document.getElementById("run").value;
  runningTimeInt = Number(runningTime);
  if (runningTimeInt == NaN) {
    alert("Revisa los minutos de correr");
    return;
  }
  //Setear Walk
  walkingTime = document.getElementById("walk").value;
  walkingTimeInt = Number(walkingTime);
  if (walkingTimeInt == NaN) {
    alert("Revisa los minutos de caminar");
    return;
  }
  //Setear Cooling
  coolingTime = document.getElementById("cooling").value;
  coolingTimeInt = Number(coolingTime);
  if (coolingTimeInt == NaN) {
    alert("Revisa los minutos de enfriar");
    return;
  }
  startTime = 0;
  endTime = totalMinutesInt;

  //Setear Alarmas
  setSound("totalTime", totalMinutesInt);
  if (coolingTimeInt > 0) {
    endTime -= coolingTimeInt;
    setSound("cooling", endTime);
  }
  if (warmingTimeInt > 0) {
    setSound("warming", 0);
    startTime += warmingTimeInt;
  }
  if (runningTimeInt > 0 || walkingTimeInt > 0) {
    for (let minutes = startTime; minutes < endTime; ) {
      if (runningTimeInt > 0) {
        setSound("run", minutes);
        minutes += runningTimeInt;
      }
      if (walkingTimeInt > 0 && minutes < endTime) {
        setSound("walk", minutes);
        minutes += walkingTimeInt;
      }
    }
  }
  currentSeconds = 0;
  const cronometer = setInterval(() => {
    clock.innerText = currentSeconds;
    currentSeconds++;
    if (currentSeconds >= totalMinutesInt * 60) {
      alert("Terminaste");
      clock.innerText = "";
      clearInterval(cronometer);
    }
  }, 1000);
});
