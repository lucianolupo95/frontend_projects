import { t } from "./i18n.js";

let photos = [];

export function getPhotos() {
  return photos;
}

export function addImage(imageObj) {
  photos.push(imageObj);
}

export function rotateImage(index) {
  photos[index].rotation = (photos[index].rotation + 90) % 360;
}

export function deleteImage(index) {
  photos.splice(index, 1);
}

export function reorderImages(oldIndex, newIndex) {
  const moved = photos.splice(oldIndex, 1)[0];
  photos.splice(newIndex, 0, moved);
}

export function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  photos.forEach((photo, index) => {
    const container = document.createElement("div");
    container.className = "thumbnail";
    container.setAttribute("data-id", index);

    const img = document.createElement("img");
    img.src = photo.dataURL;
    img.style.transform = `rotate(${photo.rotation}deg)`;

    const actions = document.createElement("div");
    actions.className = "image-actions";

    const rotateBtn = document.createElement("button");
    rotateBtn.textContent = t("rotate");
    rotateBtn.onclick = () => {
      rotateImage(index);
      renderGallery();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = t("delete");
    deleteBtn.onclick = () => {
      deleteImage(index);
      renderGallery();
    };

    actions.appendChild(rotateBtn);
    actions.appendChild(deleteBtn);
    container.appendChild(img);
    container.appendChild(actions);
    gallery.appendChild(container);
  });

  Sortable.create(gallery, {
    animation: 150,
    onEnd: function (evt) {
      reorderImages(evt.oldIndex, evt.newIndex);
      renderGallery();
    },
  });
}
