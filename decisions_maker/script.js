const optionsTextarea = document.getElementById("options-textarea");
const simpleBtn = document.getElementById("simple-decision-btn");
const fullBtn = document.getElementById("full-decision-btn");
const optionsContainer = document.getElementById("options-container");
const option1Label = document.getElementById("label1");
const option2Label = document.getElementById("label2");
const option1Btn = document.getElementById("option1-btn");
const option2Btn = document.getElementById("option2-btn");
const finalContainer = document.getElementById("final-decision-container");
const winnerText = document.getElementById("winner");
const againBtn = document.getElementById("again-btn");
const counterText = document.getElementById("counter");
const progressContainer = document.getElementById("progress-container");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");

let options = [];
let scores = [];
let pairs = [];
let index = 0;
let decisionMode = null;

optionsTextarea.addEventListener("input", () => {
  const lines = optionsTextarea.value
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);
  counterText.innerText = `Opciones: ${lines.length}`;
});

function submitOptions(mode) {
  const lines = optionsTextarea.value
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l);

  if (lines.length < 2) {
    alert("Ingresá al menos dos opciones.");
    return;
  }

  options = lines;
  scores = [...options];
  decisionMode = mode;
  index = 0;

  document.getElementById("form").style.display = "none";
  optionsContainer.style.display = "flex";
  progressContainer.style.display = "block";  // Mostrar la barra siempre

  if (mode === "complete") {
    pairs = generateAllPairs(options);
    shuffleArray(pairs);
    scores = {};
    options.forEach(option => scores[option] = 0);
  }

  updateProgress();
  showNextPair();
}

simpleBtn.addEventListener("click", () => submitOptions("simple"));
fullBtn.addEventListener("click", () => submitOptions("complete"));

option1Btn.addEventListener("click", () => chooseOption(0));
option2Btn.addEventListener("click", () => chooseOption(1));

function chooseOption(selectedIndex) {
  if (decisionMode === "simple") {
    scores.splice(selectedIndex === 0 ? 1 : 0, 1);
  } else {
    const [a, b] = pairs[index];
    const winner = selectedIndex === 0 ? a : b;
    scores[winner] = (scores[winner] || 0) + 1;
    index++;
  }

  showNextPair();
}

function showNextPair() {
  if (decisionMode === "simple") {
    if (scores.length === 1) {
      endDecision();
      return;
    }
    [option1Label.innerText, option2Label.innerText] = [scores[0], scores[1]];
    updateProgress();  // Aunque no haya pares, mostrará el progreso visual
  } else {
    if (index >= pairs.length) {
      endDecision();
      return;
    }
    const [a, b] = pairs[index];
    option1Label.innerText = a;
    option2Label.innerText = b;
    updateProgress();
  }
}

function endDecision() {
  optionsContainer.style.display = "none";
  finalContainer.style.display = "flex";

  if (decisionMode === "simple") {
    winnerText.innerText = scores[0];
  } else {
    const sorted = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .map(([name, score]) => ({ name, score }));

    let html = "<table border='1' style='color:white; font-size: 20px;'>";
    html += "<tr><th>Opción</th><th>Puntaje</th></tr>";
    for (const row of sorted) {
      html += `<tr><td>${row.name}</td><td>${row.score}</td></tr>`;
    }
    html += "</table>";
    winnerText.innerHTML = html;
  }
  updateProgress();

}

againBtn.addEventListener("click", () => {
  options = [];
  scores = [];
  pairs = [];
  index = 0;
  decisionMode = null;
  optionsTextarea.value = "";
  counterText.innerText = "Opciones: 0";
  finalContainer.style.display = "none";
  document.getElementById("form").style.display = "flex";
  progressContainer.style.display = "none";  // Ocultar al reiniciar
});

function generateAllPairs(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      result.push([arr[i], arr[j]]);
    }
  }
  return result;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

document.addEventListener("keydown", (e) => {
  if (!decisionMode) return;
  if (["1", "ArrowLeft"].includes(e.key) || e.code === "Numpad1") {
    option1Btn.click();
  } else if (["2", "ArrowRight"].includes(e.key) || e.code === "Numpad2") {
    option2Btn.click();
  }
});

function updateProgress() {
  const total = decisionMode === "complete" ? pairs.length : options.length - 1;
  const done = decisionMode === "complete" ? index : options.length - scores.length;
  const remaining = total - done;
  const percent = total > 0 ? Math.floor((done / total) * 100) : 0;

  progressText.innerText = `Comparaciones: ${done} / ${total} | Faltan: ${remaining} | ${percent}%`;
  progressFill.style.width = `${percent}%`;
  if (percent >= 100) {
    progressFill.style.backgroundColor = 'limegreen';
  } else {
    progressFill.style.backgroundColor = 'gold';
  }
}
