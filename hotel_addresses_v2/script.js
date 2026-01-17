document.addEventListener("DOMContentLoaded", () => {
  const hotelSelect = document.getElementById("hotelSelect");
  const generarBtn = document.getElementById("generarBtn");
  const resultado = document.getElementById("resultado");
  const preview = document.getElementById("preview");
  const previewText = document.getElementById("previewText");

  // Llenar select con los hoteles
  hotelesData.forEach((hotel, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = hotel.nombre;
    hotelSelect.appendChild(option);
  });

  generarBtn.addEventListener("click", () => {
    const selectedIndex = hotelSelect.value;
    const habitacionInput = document.getElementById("habitacion").value.trim();
    const tipoServicio = document.querySelector('input[name="tipoServicio"]:checked').value;

    // Validar selección
    if (selectedIndex === "" || !hotelesData[selectedIndex]) {
      mostrarResultado("Por favor, seleccioná un hotel.", "error");
      preview.classList.add("hidden");
      return;
    }

    const hotel = hotelesData[selectedIndex];
    const ahora = new Date();

    // Formateo a DD/MM/YY
    const dia = ahora.getDate().toString().padStart(2, '0');
    const mes = (ahora.getMonth() + 1).toString().padStart(2, '0');
    const anio = ahora.getFullYear().toString().slice(-2);
    const fecha = `${dia}/${mes}/${anio}`;

    // Formateo de hora en formato 24h
    const hora = ahora.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });

    // Determinar título según tipo de servicio
    const titulo = tipoServicio === "ambulancia"
      ? "SOLICITUD DE AMBULANCIA DE URGENCIAS"
      : "SOLICITUD DE MÉDICO A DOMICILIO";

    // Construir línea de lugar
    const lugarLinea = `-LUGAR DE URGENCIA: ${hotel.nombre}. ${hotel.direccion}.` +
      (habitacionInput ? ` Habitación ${habitacionInput}.` : "");

    // Construir texto completo
    const texto = `${titulo}

-DÍA DE SOLICITUD: ${fecha}
-HORA DE SOLICITUD: ${hora}
-SOLICITANTE: Recepción
-TELÉFONO DE CONTACTO: ${hotel.telefono}
-IDIOMA: Inglés
-MOTIVO DE URGENCIA: Se cayó y se golpeó la cabeza.

${lugarLinea}`;

    // Mostrar preview
    previewText.textContent = texto;
    preview.classList.remove("hidden");

    // Copiar al portapapeles
    navigator.clipboard.writeText(texto)
      .then(() => {
        mostrarResultado("Texto copiado al portapapeles ✅", "success");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
        mostrarResultado("Error al copiar el texto.", "error");
      });
  });

  // Función auxiliar para mostrar mensajes
  function mostrarResultado(mensaje, tipo) {
    resultado.textContent = mensaje;
    resultado.classList.remove("empty", "success", "error");
    resultado.classList.add(tipo);
  }
});
