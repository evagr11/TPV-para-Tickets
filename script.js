(() => {
  "use strict";

  // Red de seguridad extra: algunos gestos de zoom (pellizco) no los
  // bloquea el CSS por sí solo en Safari, así que los cancelamos aquí.
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());

  // ---------- Estado ----------
  // Todo el dinero se maneja en CÉNTIMOS (enteros) para que no haya
  // errores de redondeo con decimales, ni en los subtotales ni en el cambio.

  const TIPOS = ["combinado", "cerveza", "refresco", "agua"];

  const PRECIOS_POR_DEFECTO = {
    combinado: 700, // 7,00 €
    cerveza: 400,   // 4,00 €
    refresco: 300,  // 3,00 €
    agua: 200       // 2,00 €
  };

  let precios = cargarPrecios();     // céntimos
  let cantidades = { combinado: 0, cerveza: 0, refresco: 0, agua: 0 };
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
    if (centimos.length === 1) {
      centimos += "0";
    }
    if (centimos.length === 0) {
      centimos = "00";
    }
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
    return TIPOS.reduce((acc, t) => acc + precios[t] * cantidades[t], 0);
  }

  // ---------- Persistencia de precios ----------

  function cargarPrecios() {
    try {
      const guardado = localStorage.getItem("barra_precios_centimos");
      if (guardado) {
        const obj = JSON.parse(guardado);
        if (TIPOS.every(t => Number.isFinite(obj[t]))) return obj;
      }
    } catch (e) { /* si falla, usamos los de por defecto */ }
    return { ...PRECIOS_POR_DEFECTO };
  }

  function guardarPrecios() {
    try {
      localStorage.setItem("barra_precios_centimos", JSON.stringify(precios));
    } catch (e) { /* almacenamiento no disponible, seguimos igualmente */ }
  }

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
    TIPOS.forEach(t => {
      document.getElementById("pu-" + t).textContent =
        formatearCentimos(precios[t]) + " / ud";
      const input = document.getElementById("precio-" + t);
      if (input) input.value = (precios[t] / 100).toFixed(2);
    });
  }

  function renderCantidadesYSubtotales() {
    TIPOS.forEach(t => {
      document.getElementById("cant-" + t).textContent = cantidades[t];
      document.getElementById("sub-" + t).textContent =
        formatearCentimos(precios[t] * cantidades[t]);
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
      const tipo = btn.dataset.tipo;
      const accion = btn.dataset.accion;
      if (accion === "mas") {
        cantidades[tipo]++;
      } else if (accion === "menos") {
        cantidades[tipo] = Math.max(0, cantidades[tipo] - 1);
      }
      renderCantidadesYSubtotales();
      renderTotales();
    });
  });

  // ---------- Acciones: teclado numérico (pago) ----------
  // El importe se teclea "como en un datáfono": cada dígit entra por la
  // derecha (ej. 5 -> 0,05€ ; luego 0 -> 0,50€ ; luego 0 -> 5,00€).

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
          if (pagoTexto === "") {
            pagoTexto = "0,";
          } else {
            pagoTexto += ",";
          }
        }
      } else {
        if (pagoTexto.includes(",")) {
          const decimales = pagoTexto.split(",")[1];
          if (decimales.length < 2) {
            pagoTexto += key;
          }
        } else {
          pagoTexto += key;
        }
      }
      renderTotales();
    });
  });

  // ---------- Botón limpiar (siguiente cliente) ----------

  el.btnLimpiar.addEventListener("click", () => {
    cantidades = TIPOS.reduce((acc, t) => (acc[t] = 0, acc), {});
    pagoTexto = "";
    renderCantidadesYSubtotales();
    renderTotales();
  });

  // ---------- Panel de ajuste de precios ----------

  el.btnAjustes.addEventListener("click", () => {
    el.panelAjustes.classList.toggle("oculto");
  });

  el.btnGuardarPrecios.addEventListener("click", () => {
    TIPOS.forEach(t => {
      const input = document.getElementById("precio-" + t);
      const valorEuros = parseFloat(input.value.replace(",", "."));
      if (Number.isFinite(valorEuros) && valorEuros >= 0) {
        // Redondeamos a céntimos para evitar arrastrar decimales largos.
        precios[t] = Math.round(valorEuros * 100);
      }
    });
    guardarPrecios();
    el.panelAjustes.classList.add("oculto");
    renderTodo();
  });

  // ---------- Arranque ----------
  renderTodo();

})();