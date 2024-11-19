document.getElementById("fetch-data").addEventListener("click", async () => {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "Cargando...";

  try {
    const response = await fetch(
      "https://calorie-counter-production.up.railway.app/health"
    );
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    resultDiv.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultDiv.textContent = `Error al obtener datos: ${error.message}`;
  }
});
