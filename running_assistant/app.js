if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => console.log("Service Worker registrado."))
    .catch((error) =>
      console.error("Error al registrar el Service Worker:", error)
    );
}

// Pedir permiso para enviar notificaciones
if ("Notification" in window) {
  Notification.requestPermission().then((permission) => {
    console.log("Permiso de notificación:", permission);
  });
}

// Función para mostrar una notificación
function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("¡Es hora de cambiar!", {
      body: "Haz clic aquí para más detalles.",
      icon: "https://via.placeholder.com/100",
    });
  } else {
    alert("Por favor, habilita las notificaciones en tu navegador.");
  }
}

document.getElementById("start-button").addEventListener("click", () => {
  const audio = new Audio("alarm.mp3");
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
  }, 2000);
});
