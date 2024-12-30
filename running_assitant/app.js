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

// Función para reproducir un sonido
function playSound() {
  const audio = new Audio("alarm.mp3"); // Usa el archivo de sonido que elijas
  audio
    .play()
    .catch((error) => console.error("Error al reproducir el sonido:", error));
}

// Lógica principal
document.getElementById("start-button").addEventListener("click", () => {
  showNotification();
  playSound();
});
