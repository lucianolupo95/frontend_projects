let currentStream = null;

export function isCameraActive() {
  return currentStream !== null;
}

export async function initCamera(facingMode = "environment") {
  stopCamera();

  try {
    currentStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode },
    });

    const camera = document.getElementById("camera");
    camera.srcObject = currentStream;
  } catch (err) {
    alert("No se pudo acceder a la cámara.");
    currentStream = null;
  }
}

export function stopCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
  }
}

export function toggleCameraControls(show) {
  const controls = document.getElementById("camera-controls");
  const video = document.getElementById("camera");
  if (show) {
    controls.classList.remove("hidden");
    video.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
    video.classList.add("hidden");
  }
}
