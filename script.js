(() => {
  "use strict";

  // Red de seguridad extra: algunos gestos de zoom (pellizco) no los
  // bloquea el CSS por sí solo en Safari, así que los cancelamos aquí.
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());

  // ---------- Catálogo ----------
  // Todo el dinero se maneja en CÉNTIMOS (enteros) para que no haya
  // errores de redondeo con decimales, ni en los subtotales ni en el cambio.
  //
  // Para cambiar un producto o un precio por defecto, edita solo este array.
  // "categoria" decide en qué bloque aparece (ver CATEGORIAS más abajo).
  const CATEGORIAS = [
    { id: "bebida", titulo: "La bebida" },
    { id: "v400",   titulo: "Vaso 400 ml" },
    { id: "v900",   titulo: "Vaso 900 ml" }
  ];

  const PRODUCTOS = [
    { id: "vaso",       categoria: "bebida", icono: "🥛", nombre: "Vaso",            precio: 100 },
    { id: "agua",       categoria: "bebida", icono: "💧", nombre: "Agua",            precio: 200 },
    { id: "monster",    categoria: "bebida", icono: "⚡", nombre: "Monster",         precio: 400 },

    { id: "cerveza400", categoria: "v400",   icono: "🍺", nombre: "Cerveza",         precio: 400 },
    { id: "tinto400",   categoria: "v400",   icono: "🍷", nombre: "Tinto de Verano", precio: 400 },
    { id: "refresco400",categoria: "v400",   icono: "🥤", nombre: "Refresco",        precio: 400 },
    { id: "combi400",   categoria: "v400",   icono: "🍹", nombre: "Combinado",       precio: 800 },

    { id: "cerveza900", categoria: "v900",   icono: "🍺", nombre: "Cerveza",         precio: 800 },
    { id: "tinto900",   categoria: "v900",   icono: "🍷", nombre: "Tinto de Verano", precio: 800 },
    { id: "refresco900",categoria: "v900",   icono: "🥤", nombre: "Refresco",        precio: 800 },
    { id: "combi900",   categoria: "v900",   icono: "🍹", nombre: "Combinado",       precio: 1600 }
  ];

  const IDS = PRODUCTOS.map(p => p.id);
  const PRECIOS_POR_DEFECTO = PRODUCTOS.reduce((acc, p) => (acc[p.id] = p.precio, acc), {});
  const CLAVE_STORAGE = "barra_precios_contempopranea_v2"; // clave nueva: ignora precios guardados de la versión anterior

  // ---------- Estado ----------
  let precios = cargarPrecios(); // céntimos
  let cantidades = IDS.reduce((acc, id) => (acc[id] = 0, acc), {});
  let pagoTexto = "";

  function pagoEnCentimos() {
    if (pagoTexto === "") return 0;
    if (!pagoTexto.includes(",")) {
      // Solo euros
      return parseInt(pagoTexto, 10) * 100;
    }
    const partes = pagoTexto.split(",");
    const euros = partes[0] === "" ? 0 : parseInt(partes[0], 10);
    let centimos = partes[1] || "";
    if (centimos.length === 1) centimos += "0";
    if (centimos.length === 0) centimos = "00";
    return euros * 100 + parseInt(centimos, 10);
  }

  // ---------- Utilidades de dinero ----------
  function formatearCentimos(centimos) {
    const euros = centimos / 100;
    return euros.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + " €";
  }

  function totalCentimos() {
    return IDS.reduce((acc, id) => acc + precios[id] * cantidades[id], 0);
  }

  // ---------- Persistencia de precios ----------
  function cargarPrecios() {
    try {
      const guardado = localStorage.getItem(CLAVE_STORAGE);
      if (guardado) {
        const obj = JSON.parse(guardado);
        if (IDS.every(id => Number.isFinite(obj[id]))) return obj;
      }
    } catch (e) { /* si falla, usamos los de por defecto */ }
    return { ...PRECIOS_POR_DEFECTO };
  }

  function guardarPrecios() {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(precios));
    } catch (e) { /* almacenamiento no disponible, seguimos igualmente */ }
  }

  // ---------- Construcción de la interfaz ----------
  const contenedorProductos = document.getElementById("listaProductos");
  const contenedorAjustes = document.getElementById("ajustesLista");

  function construirProductos() {
    contenedorProductos.innerHTML = CATEGORIAS.map(cat => {
      const tarjetas = PRODUCTOS.filter(p => p.categoria === cat.id).map(p => `
        <article class="ticket-card" data-categoria="${cat.id}">
          <div class="ticket-info">
            <span class="ticket-icono">${p.icono}</span>
            <div class="ticket-textos">
              <span class="ticket-nombre">${p.nombre}</span>
              <span class="ticket-precio" id="pu-${p.id}">0,00 €</span>
            </div>
          </div>
          <div class="ticket-controles">
            <button class="btn-contador menos" data-id="${p.id}" data-accion="menos" aria-label="Restar ${p.nombre}">−</button>
            <span class="ticket-cantidad" id="cant-${p.id}">0</span>
            <button class="btn-contador mas" data-id="${p.id}" data-accion="mas" aria-label="Sumar ${p.nombre}">+</button>
          </div>
          <div class="ticket-subtotal" id="sub-${p.id}">0,00 €</div>
        </article>`).join("");
      return `
        <h2 class="categoria-titulo" data-categoria="${cat.id}">${cat.titulo}</h2>
        ${tarjetas}`;
    }).join("");

    contenedorAjustes.innerHTML = CATEGORIAS.map(cat => {
      const filas = PRODUCTOS.filter(p => p.categoria === cat.id).map(p => `
        <div class="ajuste-fila">
          <span class="ajuste-label">${p.icono} ${p.nombre}</span>
          <input type="number" inputmode="decimal" step="0.10" min="0" class="ajuste-input" id="precio-${p.id}">
        </div>`).join("");
      return `<p class="ajuste-categoria">${cat.titulo}</p>${filas}`;
    }).join("");
  }

  construirProductos();

  // ---------- Referencias DOM ----------
  const el = {
    totalCifra: document.getElementById("totalCifra"),
    pagoCifra: document.getElementById("pagoCifra"),
    cambioCifra: document.getElementById("cambioCifra"),
    cambioFila: document.getElementById("cambioFila"),
    avisoInsuficiente: document.getElementById("avisoInsuficiente"),
    btnAjustes: document.getElementById("btnAjustes"),
    panelAjustes: document.getElementById("panelAjustes"),
    btnGuardarPrecios: document.getElementById("btnGuardarPrecios"),
    btnLimpiar: document.getElementById("btnLimpiar")
  };

  // ---------- Render ----------
  function renderPrecios() {
    IDS.forEach(id => {
      document.getElementById("pu-" + id).textContent =
        formatearCentimos(precios[id]) + " / ud";
      const input = document.getElementById("precio-" + id);
      if (input) input.value = (precios[id] / 100).toFixed(2);
    });
  }

  function renderCantidadesYSubtotales() {
    IDS.forEach(id => {
      document.getElementById("cant-" + id).textContent = cantidades[id];
      document.getElementById("sub-" + id).textContent =
        formatearCentimos(precios[id] * cantidades[id]);
    });
  }

  function renderTotales() {
    const total = totalCentimos();
    el.totalCifra.textContent = formatearCentimos(total);

    const pagoCentimos = pagoEnCentimos();
    el.pagoCifra.textContent = formatearCentimos(pagoCentimos);

    const cambio = pagoCentimos - total;
    if (cambio < 0) {
      el.cambioFila.classList.add("negativo");
      el.cambioCifra.textContent = formatearCentimos(Math.abs(cambio));
      el.avisoInsuficiente.classList.remove("oculto");
    } else {
      el.cambioFila.classList.remove("negativo");
      el.cambioCifra.textContent = formatearCentimos(cambio);
      el.avisoInsuficiente.classList.add("oculto");
    }
  }

  function renderTodo() {
    renderPrecios();
    renderCantidadesYSubtotales();
    renderTotales();
  }

  // ---------- Acciones: contadores ----------
  document.querySelectorAll(".btn-contador").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const accion = btn.dataset.accion;
      if (accion === "mas") {
        cantidades[id]++;
      } else if (accion === "menos") {
        cantidades[id] = Math.max(0, cantidades[id] - 1);
      }
      renderCantidadesYSubtotales();
      renderTotales();
    });
  });

  // ---------- Acciones: teclado numérico (pago) ----------
  document.querySelectorAll(".tecla").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;

      if (key === "borrar") {
        pagoTexto = pagoTexto.slice(0, -1);
      } else if (key === "exacto") {
        pagoTexto = (totalCentimos() / 100)
          .toFixed(2)
          .replace(".", ",");
      } else if (key === ",") {
        if (!pagoTexto.includes(",")) {
          pagoTexto = pagoTexto === "" ? "0," : pagoTexto + ",";
        }
      } else {
        if (pagoTexto.includes(",")) {
          const decimales = pagoTexto.split(",")[1];
          if (decimales.length < 2) pagoTexto += key;
        } else {
          pagoTexto += key;
        }
      }
      renderTotales();
    });
  });

  // ---------- Botón limpiar (siguiente cliente) ----------
  el.btnLimpiar.addEventListener("click", () => {
    cantidades = IDS.reduce((acc, id) => (acc[id] = 0, acc), {});
    pagoTexto = "";
    renderCantidadesYSubtotales();
    renderTotales();
  });

  // ---------- Panel de ajuste de precios ----------
  el.btnAjustes.addEventListener("click", () => {
    el.panelAjustes.classList.toggle("oculto");
  });

  el.btnGuardarPrecios.addEventListener("click", () => {
    IDS.forEach(id => {
      const input = document.getElementById("precio-" + id);
      const valorEuros = parseFloat(input.value.replace(",", "."));
      if (Number.isFinite(valorEuros) && valorEuros >= 0) {
        // Redondeamos a céntimos para evitar arrastrar decimales largos.
        precios[id] = Math.round(valorEuros * 100);
      }
    });
    guardarPrecios();
    el.panelAjustes.classList.add("oculto");
    renderTodo();
  });

  // ---------- Arranque ----------
  renderTodo();
})();

// ---------- Uso sin conexión ----------
// Registra el service worker (sw.js) para que la app abra aunque no haya cobertura.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* sin service worker la app sigue funcionando online */ });
  });
}
