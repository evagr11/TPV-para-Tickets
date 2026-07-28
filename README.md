<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0%3A0F0F1A%2C50%3A6C5CE7%2C100%3AA29BFE&height=200&section=header&text=TPV+para+Tickets&fontSize=60&fontColor=fff&fontAlignY=38&desc=Una+sencilla+PWA+para+gestionar+la+venta+de+tickets+en+eventos&descAlignY=62&descSize=18" width="100%"/>
</div>

<div align="center">
  <a href="https://github.com/evagr11/TPV-para-Tickets"><img src="https://img.shields.io/badge/Ver_Código-0F0F1A?style=for-the-badge&logo=github&logoColor=white" alt="Ver Código"></a>
  <a href="https://evagr11.github.io/TPV-para-Tickets/"><img src="https://img.shields.io/badge/Ver_Demo-6C5CE7?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Ver Demo"></a>
</div>

<div align="center">
  <a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com/?font=JetBrains+Mono&size=18&duration=3500&pause=800&color=6C5CE7&center=true&vCenter=true&width=600&lines=Vanilla+JavaScript+%28ES6%2B)%3BInterfaz%20optimizada%20para%20m%C3%B3viles%3BPersistencia%20con%20LocalStorage%3BSin%20dependencias%2C%20solo%20HTML%2FCSS%2FJS" alt="Typing SVG" /></a>
</div>

# 🚀 Sobre el Proyecto

**TPV para Tickets** es una aplicación web ligera y minimalista diseñada para actuar como un Terminal Punto de Venta (TPV) en la barra de un evento o festival. Permite llevar la cuenta de las bebidas vendidas (combinados, cervezas/refrescos y agua), calcular el total de la compra y gestionar el cambio a devolver de forma rápida y eficiente, con una interfaz optimizada para su uso en dispositivos móviles.

La aplicación realiza todos los cálculos monetarios utilizando céntimos como unidad base (enteros) para **garantizar la máxima precisión** y evitar los errores de redondeo comunes al trabajar con números flotantes.

<br>

<div align="center">
  <img src="https://github.com/user-attachments/assets/ab5ec012-8959-4621-a6d4-6afc5f77493d" alt="Mockup TPV" width="70%"/>
  <p><em>Mockup TPV para Tickets</em></p>
</div>

✨ **Características principales:**

*   📱 **Interfaz Mobile-First:** Diseñada para parecer y funcionar como una app nativa en móviles, con botones grandes y fáciles de pulsar durante un evento concurrido.
*   ⚙️ **Precios Configurables:** Permite establecer y modificar los precios de cada producto. Los cambios se guardan localmente para que no sea necesario reconfigurarlos cada vez.
*   💰 **Cálculo de Cambio Preciso:** Incluye un teclado numérico tipo datáfono para introducir el importe entregado por el cliente y calcular el cambio exacto de forma instantánea.
*   💾 **Persistencia con `localStorage`:** Los precios se almacenan en el navegador del dispositivo, sobreviviendo a cierres de pestaña o reinicios.
*   🌐 **Funcionamiento Offline:** Una vez cargada por primera vez, la aplicación es 100% funcional sin conexión a internet, ideal para recintos con mala cobertura.
*   💡 **Cero Dependencias:** Construida con HTML, CSS y JavaScript puros (Vanilla JS), sin frameworks ni librerías externas, asegurando una carga ultrarrápida y máxima compatibilidad.

# 🧠 Contexto del Proyecto

Este es un **proyecto personal** creado a partir de una necesidad real: agilizar el proceso de cobro en la barra de un festival o evento. La idea era desarrollar una herramienta simple, rápida y fiable que pudiera usarse en un iPhone o cualquier otro smartphone como una "app", sin depender de conexión a internet y con una interfaz a prueba de errores.

# 🛠️ Stack Tecnológico
<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Status-Estable-brightgreen?style=for-the-badge" alt="Status Estable">
</div>

<br>

<div align="center">
  
  | Área          | Tecnología                                     |
|---------------|------------------------------------------------|
| **Frontend**  | `HTML5`, `CSS3`, `JavaScript (ES6+)`           |
| **Almacenamiento** | `localStorage` del Navegador                 |
| **Despliegue** | `GitHub Pages`                                 |
</div>



# 📂 Estructura del Proyecto

El proyecto tiene una estructura muy sencilla, contenida en tres archivos principales que componen toda la lógica y la interfaz.

```bash
.
├── index.html      # Estructura principal y contenido de la app
├── style.css       # Estilos visuales y diseño responsive
└── script.js       # Lógica de la aplicación y manejo de eventos
└── README.md
```

# 🚀 Cómo Utilizar el Proyecto

Al ser un proyecto estático sin dependencias, no requiere ningún proceso de compilación.

### 1. Despliegue en GitHub Pages (Recomendado)

La forma más sencilla de usar la aplicación es desplegarla gratuitamente con GitHub Pages:

1.  Haz un **fork** de este repositorio o crea un repositorio nuevo en tu cuenta de GitHub.
2.  Sube los archivos `index.html`, `style.css` y `script.js` a la raíz del repositorio.
3.  En tu repositorio, ve a **Settings** > **Pages**.
4.  En la sección **Build and deployment**, selecciona la fuente (`Source`) como **Deploy from a branch**.
5.  Elige la rama `main` (o `master`) y la carpeta `/ (root)`. Haz clic en **Save**.
6.  Tras unos minutos, tu aplicación estará disponible en una URL como `https://tu-usuario.github.io/tu-repositorio/`.

### 2. Uso en el evento

1.  Abre la URL en el navegador de tu móvil (preferiblemente Safari en iPhone o Chrome en Android).
2.  Para una experiencia de "app nativa", utiliza la opción **"Añadir a pantalla de inicio"** de tu navegador. Esto creará un icono en tu móvil y abrirá la app a pantalla completa.
3.  Configura los precios tocando el botón **⚙︎ Precios**. Estos se guardarán para usos futuros.

### 3. Ejecución Local

Si quieres probarlo en tu ordenador:

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/evagr11/TPV-para-Tickets.git
    ```
2.  Navega a la carpeta del proyecto:
    ```bash
    cd TPV-para-Tickets
    ```
3.  Abre el archivo `index.html` directamente en tu navegador.

<div align="center">
  <img src="https://github.com/user-attachments/assets/f8f2389c-db8c-4ec6-9606-cbc76bf26340" alt="Panel de ajuste de precios"/>
  <p><em>Panel para configurar los precios de cada tipo de ticket.</em></p>
</div>

---

<div align="center">
  <p>Creado por <strong>Eva Gallardo</strong></p>
  <a href="https://github.com/evagr11" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/eva-gallardo-romero-830362349/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</div>


<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0%3A0F0F1A%2C50%3A6C5CE7%2C100%3AA29BFE&height=120&section=footer" width="100%"/>
</div>