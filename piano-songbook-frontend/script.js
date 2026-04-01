const songs = [
  "My chemical romance	Welcome to the black parade",
  "Yiruma	River Flows in You",
  "Yoshiki	Red Swan (OP 3 Attack on Titans)",
  "Cacho Castaña	Si te agarro con otro",
  "Agrupación Marilyn	Su Florcita",
  "Luck ra	La Morocha",
  "Amar Azul	Me enamore",
  "Manu Pilas	Bella Ciao",
  "Boca	Dale dale boca",
  "Aina the end & Yuuri	On The way (Dan da Dan opening 2)",
];
const chosenSong = document.getElementById("song");

function shuffleSong() {
  chosenSong.innerText = songs[Math.floor(Math.random() * songs.length)];
}

shuffleSong();
