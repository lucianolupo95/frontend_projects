document.addEventListener("DOMContentLoaded", () => {
  const hotelInput = document.getElementById("hotelInput");
  const hotelDropdown = document.getElementById("hotelDropdown");
  const generarBtn = document.getElementById("generarBtn");
  const resultado = document.getElementById("resultado");
  const preview = document.getElementById("preview");
  const previewText = document.getElementById("previewText");

  // Crear array con índice original y ordenar alfabéticamente
  const hotelesOrdenados = hotelesData
    .map((hotel, index) => ({ ...hotel, originalIndex: index }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

  let selectedHotelIndex = null;

  // Función para mostrar el dropdown con hoteles filtrados
  function mostrarDropdown(filtro = "") {
    const filtroLower = filtro.toLowerCase();
    const hotelesFiltrados = hotelesOrdenados.filter(hotel =>
      hotel.nombre.toLowerCase().includes(filtroLower)
    );

    if (hotelesFiltrados.length === 0) {
      hotelDropdown.innerHTML = '<div class="autocomplete-item no-results">No se encontraron hoteles</div>';
    } else {
      hotelDropdown.innerHTML = hotelesFiltrados
        .map(hotel => `<div class="autocomplete-item" data-index="${hotel.originalIndex}">${hotel.nombre}</div>`)
        .join('');
    }

    hotelDropdown.classList.remove("hidden");
  }

  // Ocultar dropdown
  function ocultarDropdown() {
    hotelDropdown.classList.add("hidden");
  }

  // Seleccionar hotel
  function seleccionarHotel(index) {
    const hotel = hotelesData[index];
    if (hotel) {
      hotelInput.value = hotel.nombre;
      selectedHotelIndex = index;
      ocultarDropdown();
    }
  }

  // Mostrar dropdown al hacer focus
  hotelInput.addEventListener("focus", () => {
    mostrarDropdown(hotelInput.value);
  });

  // Filtrar al escribir
  hotelInput.addEventListener("input", (e) => {
    selectedHotelIndex = null; // Reset selección al escribir
    mostrarDropdown(e.target.value);
  });

  // Manejar click en items del dropdown
  hotelDropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".autocomplete-item");
    if (item && item.dataset.index) {
      seleccionarHotel(parseInt(item.dataset.index));
    }
  });

  // Ocultar dropdown al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-container")) {
      ocultarDropdown();
    }
  });

  // Navegación con teclado
  hotelInput.addEventListener("keydown", (e) => {
    const items = hotelDropdown.querySelectorAll(".autocomplete-item:not(.no-results)");
    const activeItem = hotelDropdown.querySelector(".autocomplete-item.active");
    let currentIndex = Array.from(items).indexOf(activeItem);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (currentIndex < items.length - 1) {
        if (activeItem) activeItem.classList.remove("active");
        items[currentIndex + 1].classList.add("active");
        items[currentIndex + 1].scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIndex > 0) {
        if (activeItem) activeItem.classList.remove("active");
        items[currentIndex - 1].classList.add("active");
        items[currentIndex - 1].scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeItem && activeItem.dataset.index) {
        seleccionarHotel(parseInt(activeItem.dataset.index));
      }
    } else if (e.key === "Escape") {
      ocultarDropdown();
    }
  });

  generarBtn.addEventListener("click", () => {
    const habitacionInput = document.getElementById("habitacion").value.trim();
    const tipoServicio = document.querySelector('input[name="tipoServicio"]:checked').value;

    // Validar selección
    if (selectedHotelIndex === null || !hotelesData[selectedHotelIndex]) {
      mostrarResultado("Por favor, seleccioná un hotel de la lista.", "error");
      preview.classList.add("hidden");
      return;
    }

    const hotel = hotelesData[selectedHotelIndex];
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

  // Email copy functionality
  const emailLink = document.getElementById("emailLink");
  const emailToast = document.getElementById("emailToast");

  emailLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("lnlupo95@gmail.com").then(() => {
      emailToast.classList.remove("hidden");
      setTimeout(() => emailToast.classList.add("show"), 10);
      setTimeout(() => {
        emailToast.classList.remove("show");
        setTimeout(() => emailToast.classList.add("hidden"), 300);
      }, 2000);
    });
  });
});
