const hoverSound = document.getElementById("hover-sound");
const clickSound = document.getElementById("click-sound");

const links = document.querySelectorAll("ul li a");

links.forEach((link) => {
  link.addEventListener("mouseover", () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
  });

  link.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});
