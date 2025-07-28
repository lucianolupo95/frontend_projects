const camera = document.getElementById('camera');
const snapBtn = document.getElementById('snap');
const exportBtn = document.getElementById('export-pdf');
const switchCameraBtn = document.getElementById('switch-camera');
const enableCameraBtn = document.getElementById('enable-camera');
const uploadInput = document.getElementById('upload');
const compressCheckbox = document.getElementById('compress');
const dropArea = document.getElementById('drop-area');
const gallery = document.getElementById('gallery');

let photos = [];
let usingFrontCamera = false;
let currentStream = null;

function startCamera(facingMode = 'environment') {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  navigator.mediaDevices.getUserMedia({ video: { facingMode } })
    .then(stream => {
      currentStream = stream;
      camera.srcObject = stream;
      camera.style.display = 'block';
      snapBtn.disabled = false;
    })
    .catch(() => alert("Camera access denied"));
}

enableCameraBtn.addEventListener('click', () => {
  startCamera();
});

switchCameraBtn.addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera(usingFrontCamera ? 'user' : 'environment');
});

snapBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = camera.videoWidth;
  canvas.height = camera.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(camera, 0, 0);
  const dataURL = canvas.toDataURL('image/jpeg');
  photos.push({ dataURL, rotation: 0 });
  renderGallery();
});

uploadInput.addEventListener('change', (event) => {
  handleFiles(event.target.files);
});

dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#e0e0e0";
});

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = "#fff";
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = "#fff";
  if (e.dataTransfer.files) {
    handleFiles(e.dataTransfer.files);
  }
});

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      photos.push({ dataURL: e.target.result, rotation: 0 });
      renderGallery();
    };
    reader.readAsDataURL(file);
  });
}

function renderGallery() {
  gallery.innerHTML = '';
  photos.forEach((photo, index) => {
    const div = document.createElement('div');
    div.className = 'thumbnail';

    const img = document.createElement('img');
    img.src = photo.dataURL;
    img.style.transform = `rotate(${photo.rotation}deg)`;

    const actions = document.createElement('div');
    actions.className = 'image-actions';

    actions.innerHTML = `
      <button onclick="rotatePhoto(${index})">🔄</button>
      <button onclick="movePhotoUp(${index})">⬆️</button>
      <button onclick="movePhotoDown(${index})">⬇️</button>
      <button onclick="deletePhoto(${index})">🗑️</button>
    `;

    div.appendChild(img);
    div.appendChild(actions);
    gallery.appendChild(div);
  });
}

window.rotatePhoto = function (index) {
  photos[index].rotation = (photos[index].rotation + 90) % 360;
  renderGallery();
};

window.movePhotoUp = function (index) {
  if (index === 0) return;
  [photos[index - 1], photos[index]] = [photos[index], photos[index - 1]];
  renderGallery();
};

window.movePhotoDown = function (index) {
  if (index === photos.length - 1) return;
  [photos[index + 1], photos[index]] = [photos[index], photos[index + 1]];
  renderGallery();
};

window.deletePhoto = function (index) {
  photos.splice(index, 1);
  renderGallery();
};

exportBtn.addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const compress = compressCheckbox.checked;
  const pdf = new jsPDF();

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    const canvas = document.createElement('canvas');
    const imgElement = new Image();
    imgElement.src = photo.dataURL;

    await new Promise(resolve => {
      imgElement.onload = () => {
        canvas.width = imgElement.width;
        canvas.height = imgElement.height;
        const ctx = canvas.getContext('2d');
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((photo.rotation * Math.PI) / 180);
        ctx.drawImage(imgElement, -imgElement.width / 2, -imgElement.height / 2);
        ctx.restore();

        const finalDataURL = canvas.toDataURL('image/jpeg', compress ? 0.5 : 1.0);
        if (i > 0) pdf.addPage();
        pdf.addImage(finalDataURL, 'JPEG', 10, 10, 190, 0);
        resolve();
      };
    });
  }

  pdf.save('scanner.pdf');
});