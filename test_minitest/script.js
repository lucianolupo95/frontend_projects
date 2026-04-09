const form = document.getElementById("form");
const modal = document.getElementById("result-modal");
const resultContent = document.getElementById("result-content");
const closeModalButton = document.getElementById("close-modal");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  //   const schizofrenia = document.querySelector(
  //     'input[name="schizofrenia"]:checked',
  //   )?.value;
  //   const astrology = document.querySelector(
  //     'input[name="astrology"]:checked',
  //   )?.value;
  //   const comment = document.getElementById("comment").value;

  const data = new FormData(form);
  const result = Object.fromEntries(data.entries());
  resultContent.innerHTML = `
      <p><strong>Esquizofrenia:</strong> ${result.schizofrenia === "true" ? "Loquito" : "Normal"}</p>
      <p><strong>Astrología:</strong> ${result.astrology === "true" ? "Loquito" : "Normal"}</p>
      <p><strong>Comentario:</strong> ${result.comment ? "Dijo algo pero me chupa un huevo" : "No dejó comentario"}</p>
  `;
  console.log(result.schizofrenia);

  modal.classList.remove("hidden");
});
closeModalButton.addEventListener("click", function () {
  modal.classList.add("hidden");
});
modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.classList.add("hidden");
  }
});
