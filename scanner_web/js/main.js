import {
  initCamera,
  stopCamera,
  isCameraActive,
  toggleCameraControls,
} from "./camera.js";
import { renderGallery, addImage, getPhotos } from "./gallery.js";
import { applyTranslation, setLanguage, t } from "./i18n.js";

const cameraElement = document.getElementById("camera");
const toggleCameraBtn = document.getElementById("toggle-camera");
const switchCameraBtn = document.getElementById("switch-camera");
const snapBtn = document.getElementById("snap");
const exportBtn = document.getElementById("export-pdf");
const uploadInput = document.getElementById("upload");
const compressCheckbox = document.getElementById("compress");
const dropArea = document.getElementById("drop-area");
const gallery = document.getElementById("gallery");
const languageSwitcher = document.getElementById("language-switcher");
const themeSwitcher = document.getElementById("theme-switcher");
const cameraControls = document.getElementById("camera-controls");

let usingFrontCamera = false;

function setupListeners() {
  toggleCameraBtn.addEventListener("click", async () => {
    if (isCameraActive()) {
      stopCamera();
      toggleCameraBtn.textContent = t("enableCamera");
      toggleCameraControls(false); // 👈 Asegurate de que esto esté acá
    } else {
      await initCamera(usingFrontCamera ? "user" : "environment");
      toggleCameraBtn.textContent = t("disableCamera");
      toggleCameraControls(true); // 👈 Y esto también al encender
    }
  });

  switchCameraBtn.addEventListener("click", async () => {
    usingFrontCamera = !usingFrontCamera;
    await initCamera(usingFrontCamera ? "user" : "environment");
  });

  snapBtn.addEventListener("click", () => {
    const canvas = document.createElement("canvas");
    canvas.width = cameraElement.videoWidth;
    canvas.height = cameraElement.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(cameraElement, 0, 0);
    const dataURL = canvas.toDataURL("image/jpeg");
    addImage({ dataURL, rotation: 0 });
    renderGallery();
  });

  uploadInput.addEventListener("change", () => {
    Array.from(uploadInput.files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        addImage({ dataURL: e.target.result, rotation: 0 });
        renderGallery();
      };
      reader.readAsDataURL(file);
    });
    uploadInput.value = "";
  });

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("highlight");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("highlight");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("highlight");
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (!file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          addImage({ dataURL: e.target.result, rotation: 0 });
          renderGallery();
        };
        reader.readAsDataURL(file);
      });
    }
  });

  exportBtn.addEventListener("click", async () => {
    const { jsPDF } = window.jspdf;
    const compress = compressCheckbox.checked;
    const pdf = new jsPDF();

    const photos = getPhotos();
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const canvas = document.createElement("canvas");
      const img = new Image();
      img.src = photo.dataURL;

      await new Promise((resolve) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((photo.rotation * Math.PI) / 180);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          ctx.restore();

          const output = canvas.toDataURL("image/jpeg", compress ? 0.5 : 1.0);
          if (i > 0) pdf.addPage();
          pdf.addImage(output, "JPEG", 10, 10, 190, 0);
          resolve();
        };
      });
    }

    pdf.save("scanner.pdf");
  });

  languageSwitcher.addEventListener("change", (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    applyTranslation(lang);
    toggleCameraBtn.textContent = isCameraActive()
      ? t("disableCamera")
      : t("enableCamera");
    renderGallery();
  });

  themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeSwitcher.checked);
    document.body.classList.toggle("light", !themeSwitcher.checked);
  });
}

function init() {
  setLanguage("es");
  applyTranslation("es");
  renderGallery();
  setupListeners();
  toggleCameraControls(false); // 👈 Esto asegura que arranque todo oculto
}

init();
