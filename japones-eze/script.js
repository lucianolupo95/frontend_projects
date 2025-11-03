const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTynXZNO3CQCj7DEI_f93ptMeFSN2e_O1HA6t0zOrdBYuy9SkS4wfmJ1bncNUi6677KMapPbmlRLfeU/pub?gid=1124151055&single=true&output=csv";

let words = [];
let quizPool = [];
let currentIndex = 0;
let correctCount = 0;
let audioEnabled = localStorage.getItem("audioEnabled") !== "false";

const resultMessages = {
  low: { text: "Sos un pete", image: "low.png" },
  medium: { text: "MEDIOCRE", image: "medium.png" },
  high: { text: "Casi pa!", image: "high.png" },
  perfect: { text: "¡SOS UNA BESTIAAA!", image: "perfect.png" },
};

// UI Elements
const audioBtn = document.getElementById("audioToggle");
const wordCountEl = document.getElementById("wordCount");
const progressFill = document.getElementById("progressFill");
const quizQuestion = document.getElementById("quizQuestion");
const quizProgress = document.getElementById("quizProgress");
const feedback = document.getElementById("quizFeedback");
const answerInput = document.getElementById("answerInput");
const scoreText = document.getElementById("scoreText");
const resultImage = document.getElementById("resultImage");
const retryMessage = document.getElementById("retryMessage");
const retryBlock = document.getElementById("retryBlock");
const resultsHomeBtn = document.getElementById("resultsHomeBtn");

// General functions
function showView(id) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// 🔊 Audio toggle
audioBtn.textContent = audioEnabled ? "🔊" : "🔇";
audioBtn.onclick = () => {
  audioEnabled = !audioEnabled;
  localStorage.setItem("audioEnabled", audioEnabled);
  audioBtn.textContent = audioEnabled ? "🔊" : "🔇";
};

// 📥 Fetch CSV
async function loadWords() {
  const res = await fetch(SHEET_URL);
  const text = await res.text();
  words = text
    .trim()
    .split("\n")
    .slice(1)
    .map((line) => {
      const [espanol, japones] = line.split(",");
      return { espanol, japones };
    });

  wordCountEl.textContent = `Palabras aprendidas: ${words.length}`;
  populateTable();
}
loadWords();

// 🎴 Start quiz
function startQuiz() {
  quizPool = [...words];
  for (let i = quizPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizPool[i], quizPool[j]] = [quizPool[j], quizPool[i]];
  }
  currentIndex = 0;
  correctCount = 0;
  showView("quiz");
  nextCard();
}

document.getElementById("startBtn").onclick = startQuiz;
document.getElementById("viewListBtn").onclick = () => showView("list");
document.getElementById("submitAnswer").onclick = checkAnswer;

function nextCard() {
  if (currentIndex >= quizPool.length) return showResults();

  const w = quizPool[currentIndex];
  const askJapanese = Math.random() < 0.5;

  quizQuestion.dataset.askJapanese = askJapanese; // guardamos tipo de pregunta
  quizQuestion.textContent = askJapanese
    ? `¿Cómo se dice en japonés "${w.espanol}"?`
    : `¿Qué significa en español "${w.japones}"?`;

  quizQuestion.dataset.answer = askJapanese ? w.japones : w.espanol;
  quizQuestion.dataset.wordJa = w.japones;

  quizProgress.textContent = `${currentIndex}/${quizPool.length}`;
  progressFill.style.width = `${(currentIndex / quizPool.length) * 100}%`;

  answerInput.value = "";
  answerInput.focus();

  // 🔊 Si la pregunta está en japonés, reproducir al inicio
  if (!askJapanese && audioEnabled) {
    const u = new SpeechSynthesisUtterance(w.japones);
    u.lang = "ja-JP";
    speechSynthesis.speak(u);
  }
}

function checkAnswer() {
  const correct = quizQuestion.dataset.answer.trim().toLowerCase();
  const user = answerInput.value.trim().toLowerCase();

  // 🔤 función para quitar tildes/acentos
  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const correctNorm = normalize(correct);
  const userNorm = normalize(user);

  const askJapanese = quizQuestion.dataset.askJapanese === "true";

  if (userNorm === correctNorm) {
    correctCount++;
    feedback.textContent = "Bien pibe!";
    feedback.className = "correct";

    // 🔊 Reproducir japonés solo si pregunta era español
    if (askJapanese && audioEnabled) {
      const utter = new SpeechSynthesisUtterance(quizQuestion.dataset.wordJa);
      utter.lang = "ja-JP";
      speechSynthesis.speak(utter);
    }
  } else {
    feedback.innerHTML = `✖<br><small>Correcto: ${quizQuestion.dataset.answer}</small>`;
    feedback.className = "incorrect";
  }

  setTimeout(() => {
    feedback.textContent = "";
    currentIndex++;
    nextCard();
  }, 1200);
}

function showResults() {
  showView("results");
  const pct = Math.round((correctCount / quizPool.length) * 100);

  let type =
    pct === 100 ? "perfect" : pct >= 75 ? "high" : pct >= 25 ? "medium" : "low";

  // 🔧 Asegurar que el texto se muestre siempre
  scoreText.innerHTML = `
    <strong>${resultMessages[type].text}</strong><br>
    Aciertos: ${correctCount}/${quizPool.length} (${pct}%)
  `;

  retryMessage.textContent =
    pct === 100 ? "" : "¿Vas a pechofriar y dejar sin responder todo bien?";

  resultImage.innerHTML = "";
  if (resultMessages[type].image) {
    const img = document.createElement("img");
    img.src = resultMessages[type].image;
    img.onerror = () => img.remove();
    resultImage.appendChild(img);
  }

  retryBlock.style.display = pct === 100 ? "none" : "block";
  resultsHomeBtn.classList.toggle("hidden", pct !== 100);
}

document.getElementById("retryBtn").onclick = startQuiz;

// 📋 Table view
function populateTable() {
  const tbody = document.getElementById("words-table-body");
  tbody.innerHTML = "";
  words.forEach((w) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${w.espanol}</td><td>${w.japones}</td>`;
    tbody.appendChild(tr);
  });
}

// 🔍 Search
document.getElementById("searchInput").oninput = (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll("#words-table-body tr").forEach((row) => {
    const match = row.innerText.toLowerCase().includes(term);
    row.style.display = match ? "" : "none";
  });
};

// ↕️ Sort
let sortEsAsc = true;
let sortJaAsc = true;
document.getElementById("sortEs").onclick = () => {
  words.sort((a, b) =>
    sortEsAsc
      ? a.espanol.localeCompare(b.espanol)
      : b.espanol.localeCompare(a.espanol)
  );
  sortEsAsc = !sortEsAsc;
  populateTable();
};
document.getElementById("sortJa").onclick = () => {
  words.sort((a, b) =>
    sortJaAsc
      ? a.japones.localeCompare(b.japones)
      : b.japones.localeCompare(a.japones)
  );
  sortJaAsc = !sortJaAsc;
  populateTable();
};

// 💾 Download CSV
document.getElementById("downloadCSV").onclick = () => {
  const csv =
    "Español,Japonés\n" +
    words.map((w) => `${w.espanol},${w.japones}`).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "palabras_japones.csv";
  a.click();
};
