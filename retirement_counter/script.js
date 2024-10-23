const spainTripDay = new Date("2026-02-29");

// Actualizar cuenta regresiva
const updateCountdown = () => {
  const now = new Date();
  const timeLeft = spainTripDay - now;
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
  document.getElementById(
    "countdown"
  ).innerText = `${days} días, \n ${hours} horas,\n ${minutes} minutos,\n ${seconds} segundos,\n para jubilarte`;
};
updateCountdown();
setInterval(updateCountdown, 1000); // Actualizar cada segundo

const images = [
  "assets/photos/albir1.png",
  "assets/photos/altea1.jpg",
  "assets/photos/benidorm1.jpg",
  "assets/photos/benidorm2.jpg",
  "assets/photos/villajoyosa1.jpg",
];

const songs = [
  "assets/songs/Phil Collins - I can't dance.mp3",
  "assets/songs/Phil Collins - One More Night.mp3",
  "assets/songs/Led Zeppelin - Stairway To Heaven.mp3",
  "assets/songs/Lazy - Deep Purple.mp3",
];

let lastSongIndex = -1; // Guardar el índice de la última canción reproducida

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

const getRandomSong = () => {
  let randomIndex;

  // Asegurarse de que la próxima canción no sea la misma que la anterior
  do {
    randomIndex = Math.floor(Math.random() * songs.length);
  } while (randomIndex === lastSongIndex);

  lastSongIndex = randomIndex; // Actualizar el índice de la última canción reproducida
  return songs[randomIndex];
};

const setRandomBackgroundImage = () => {
  const img1 = document.getElementById("spain-img1");
  const img2 = document.getElementById("spain-img2");

  const visibleImg = img1.classList.contains("visible") ? img1 : img2;
  const hiddenImg = visibleImg === img1 ? img2 : img1;

  hiddenImg.src = getRandomImage(); // Cargar nueva imagen en la imagen oculta

  hiddenImg.classList.remove("hidden");
  hiddenImg.classList.add("visible");
  visibleImg.classList.remove("visible");
  visibleImg.classList.add("fade");

  setTimeout(() => {
    visibleImg.classList.remove("fade");
    visibleImg.classList.add("hidden");
  }, 1500);
};
setRandomBackgroundImage();
setInterval(setRandomBackgroundImage, 10000);

const audioElement = document.getElementById("background-audio");
audioElement.src = getRandomSong();
let isPlaying = false;
const togglePlayPause = () => {
  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
    document.getElementById("toggle-play-pause-btn").innerText = "►";
  } else {
    audioElement.play();
    isPlaying = true;
    document.getElementById("toggle-play-pause-btn").innerText = "||";
  }
};
const playRandomSong = () => {
  const newSong = getRandomSong();
  audioElement.src = newSong;
  audioElement.play();
  isPlaying = true;
};
document
  .getElementById("toggle-play-pause-btn")
  .addEventListener("click", () => {
    togglePlayPause();
  });

audioElement.addEventListener("ended", () => {
  playRandomSong();
});

const nextSong = () => {
  audioElement.pause();
  playRandomSong();
};
document.getElementById("next-song-btn").addEventListener("click", nextSong);
