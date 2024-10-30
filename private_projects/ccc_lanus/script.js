const imageToPick = document.querySelector("#img-to-show");
const defaultImage = "./newGame.png";
imageToPick.src = defaultImage;
const buttoncoger = document.querySelector("#button-coger");
const buttonCasar = document.querySelector("#button-casar");
const buttonMatar = document.querySelector("#button-matar");
const buttonAgain = document.querySelector("#button-again");
const imagecoger = document.querySelector("#img-coger");
const imageCasar = document.querySelector("#img-casar");
const imageMatar = document.querySelector("#img-matar");
let canSelect = false;
let finishedGame = false;
let options = {
  coger: false,
  casar: false,
  matar: false,
};
selectedPhoto = 0;
randomizingImages = false;
imageToPick.addEventListener("click", () => {
  if (randomizingImages) {
    return;
  }
  randomizingImages = true;
  if (linksArray.length > 1) {
    photosArray = sortArray(linksArray);
    linksArray = photosArray;
    index = 0;
    stop = photosArray.length - 1;
    let showPhotos = setInterval(() => {
      imageToPick.src = photosArray[index];
      if (index == stop || index == 15) {
        imageToPick.src = photosArray[stop];
        canSelect = true;
        clearInterval(showPhotos);
        linksArray.pop();
        return;
      }
      index++;
    }, 200);
  } else {
    imageToPick.src = linksArray[0];
    imageToPick.classList.add("inactive");
  }
});

const selectOption = (boolean, image) => {
  if (!options[boolean] && canSelect) {
    image.src = imageToPick.src;
    options[boolean] = true;
    canSelect = false;
  } else {
    navigator.vibrate(200);
  }
  if (options.casar && options.coger && options.matar) {
    buttonAgain.style.opacity = 1;
    finishedGame = true;
    return;
  }
  randomizingImages = false;
};
buttoncoger.addEventListener("click", () => selectOption("coger", imagecoger));
buttonCasar.addEventListener("click", () => selectOption("casar", imageCasar));
buttonMatar.addEventListener("click", () => selectOption("matar", imageMatar));
buttonAgain.addEventListener("click", () => {
  if (finishedGame) {
    imageToPick.src = defaultImage;
    imagecoger.src = "";
    imageCasar.src = "";
    imageMatar.src = "";
    canSelect = false;
    finishedGame = false;
    options.coger = false;
    options.casar = false;
    options.matar = false;
    randomizingImages = false;
    buttonAgain.style.opacity = 0;
  }
});

const sortArray = (arrayOriginal) => {
  array = [...arrayOriginal];
  shuffledArray = [];
  arrayLength = array.length;
  while (array.length != 0) {
    shuffledArray.push(
      array.splice(Math.floor(Math.random() * array.length), 1)[0]
    );
  }
  return shuffledArray;
};

linksArray = [
  "assets/a (1).jpg",
  "assets/a (2).jpg",
  "assets/a (3).jpg",
  "assets/a (4).jpg",
  "assets/a (5).jpg",
  "assets/a (6).jpg",
  "assets/a (7).jpg",
  "assets/a (8).jpg",
  "assets/a (9).jpg",
  "assets/a (10).png",
  "assets/a (11).jpg",
  "assets/a (12).png",
  "assets/a (13).png",
  "assets/a (14).jpg",
  "assets/a (15).jpg",
  "assets/a (16).jpg",
  "assets/a (17).jpg",
  "assets/a (18).jpg",
  "assets/a (19).jpg",
  "assets/a (20).jpg",
  "assets/a (21).jpg",
  "assets/a (22).jpg",
  "assets/a (23).jpg",
  "assets/a (24).jpg",
  "assets/a (25).jpg",
  "assets/a (26).jpg",
  "assets/a (27).jpg",
  "assets/a (28).jpg",
  "assets/a (29).jpg",
  "assets/a (30).jpg",
  "assets/a (31).jpg",
  "assets/a (32).jpg",
  "assets/a (33).jpg",
  "assets/a (35).jpg",
  "assets/a (36).png",
  "assets/a (37).png",
  "assets/a (38).jpg",
  "assets/a (39).jpg",
  "assets/a (40).jpg",
  "assets/a (41).jpg",
  "assets/a (42).jpg",
  "assets/a (43).jpg",
  "assets/a (44).jpg",
  "assets/a (45).jpg",
  "assets/a (46).jpg",
  "assets/a (47).jpg",
  "assets/a (48).jpg",
  "assets/a (49).jpg",
  "assets/a (50).jpg",
  "assets/a (51).png",
  "assets/a (52).png",
  "assets/a (53).png",
  "assets/a (54).jpg",
  "assets/a (55).jpg",
  "assets/a (56).jpg",
  "assets/a (57).jpg",
  "assets/a (58).jpg",
  "assets/a (59).jpg",
  "assets/a (60).jpg",
  "assets/a (61).png",
  "assets/a (62).png",
  "assets/a (63).png",
  "assets/a (64).png",
  "assets/a (65).png",
  "assets/a (66).png",
  "assets/a (67).png",
  "assets/a (68).png",
  "assets/a (69).png",
  "assets/a (70).png",
];
