const submitBtn = document.getElementById("submit-btn");
const optionsTextarea = document.getElementById("options-textarea");
const optionsPopup = document.getElementById("options-container");
const winnerPopup = document.getElementById("final-decision-container");
const label1 = document.getElementById("label1");
const label2 = document.getElementById("label2");
const option1btn = document.getElementById("option1-btn");
const option2btn = document.getElementById("option2-btn");
const againBtn = document.getElementById("again-btn");
let candidates = [];
let winners = [];

submitBtn.addEventListener("click", (e) => {
  submitOptions(e);
});

optionsTextarea.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.ctrlKey) {
    submitOptions(event);
  }
});

function submitOptions(event) {
  event.preventDefault();
  candidates = optionsTextarea.value
    .split("\n")
    .filter((line) => line.trim() !== "");
  if (candidates.length <= 1) {
    return;
  }
  candidates = shuffle(candidates);
  optionsPopup.style.display = "flex";
  label1.innerText = candidates[0];
  label2.innerText = candidates[1];
  toggleNumberListener(true);
}

function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
option1btn.addEventListener("click", () => {
  winners.push(candidates[0]);
  candidates.splice(0, 2);
  checkCandidatesLeft();
});
option2btn.addEventListener("click", () => {
  winners.push(candidates[1]);
  candidates.splice(0, 2);
  checkCandidatesLeft();
});

const handleNumbersKeyDown = (event) => {
  if (event.key === "1") {
    option1btn.click();
  }
  if (event.key === "2") {
    option2btn.click();
  }
};

function toggleNumberListener(active) {
  if (active) {
    document.addEventListener("keydown", handleNumbersKeyDown);
  } else {
    document.removeEventListener("keydown", handleNumbersKeyDown);
  }
}
const handleSpacebarKeyDown = (e) => {
  if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
    againBtn.click();
  }
};

function toggleSpacebarListener(active) {
  if (active) {
    document.addEventListener("keydown", handleSpacebarKeyDown);
  } else {
    document.removeEventListener("keydown", handleSpacebarKeyDown);
  }
}
function checkCandidatesLeft() {
  if (candidates.length <= 1) {
    if (winners.length == 1) {
      finishDecision();
    } else {
      if (candidates.length == 1) {
        winners.push(candidates[0]);
      }
      candidates = [...winners];
      candidates = shuffle(candidates);
      winners = [];
      label1.innerText = candidates[0];
      label2.innerText = candidates[1];
    }
  } else {
    label1.innerText = candidates[0];
    label2.innerText = candidates[1];
  }
}
function finishDecision() {
  optionsPopup.style.display = "none";
  document.getElementById("winner").innerText = winners[0];
  winners = [];
  candidates = [];
  winnerPopup.style.display = "flex";
  toggleNumberListener(false);
  toggleSpacebarListener(true);
}
againBtn.addEventListener("click", () => {
  winnerPopup.style.display = "none";
  toggleSpacebarListener(false);
});
toggleNumberListener(true);
