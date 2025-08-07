
# 🚦 Visualización de Peligros de Tráfico

Este proyecto es un sistema de visualización de datos de peligros de tráfico desarrollado con **Vue.js**, **ECharts** y **Amap (Gaode Map)**. Permite la visualización interactiva de divisiones administrativas en múltiples niveles, y presenta información de tráfico desde múltiples dimensiones mediante gráficos dinámicos y mapas interactivos.

---

## 🌍 Versiones traducidas

- [English (README.md)](README.md)
- [日本語 (README‑jp.md)](README‑jp.md)
- [العربية (README‑ar.md)](README‑ar.md)
- [Português (README‑pt.md)](README‑pt.md)

---

## 📌 Funcionalidades

- 🌐 **Visualización de divisiones administrativas multinivel**  
  Soporta visualización geográfica interactiva a nivel de provincia, ciudad y distrito mediante Amap y ECharts.

- 📊 **Diversos tipos de gráficos**  
  Visualiza datos de tráfico mediante gráficos de barras, líneas, pastel, mapas de calor y diagramas de dispersión.

- 🧭 **Interacción dinámica con el mapa**  
  Interacción en el mapa con funciones como pasar el cursor, hacer zoom, clic para explorar y cambiar de región.

- 🧩 **Visualización multidimensional de datos**  
  Presenta datos desde diferentes perspectivas como tiempo, ubicación, gravedad y tipo de peligro.

- 🔧 **Arquitectura modular y escalable**  
  Basado en componentes Vue.js para facilitar el desarrollo, mantenimiento y escalabilidad.

---

## 🛠️ Tecnologías utilizadas

- **Framework Frontend**: [Vue.js](https://vuejs.org/)
- **Visualización de datos**: [ECharts](https://echarts.apache.org/) + [Amap JS API](https://lbs.amap.com/)
- **Herramientas de desarrollo**: Vue CLI, Axios, Node.js

---

## 🚀 Comenzando

### Requisitos previos

- Node.js (>= versión 14)
- npm o yarn

### Instalar dependencias

```bash
npm install
# o
yarn install
````

### Ejecutar servidor de desarrollo

```bash
npm run serve
# o
yarn serve
```

Luego abre tu navegador y visita [http://localhost:8080](http://localhost:8080).

---

## 📁 Estructura del proyecto

```
Visualization-of-Traffic-Hazards/
├── public/
│   └── index.html              # Plantilla HTML
├── src/
│   ├── assets/                 # Recursos estáticos
│   ├── components/             # Componentes Vue (mapas, gráficos, etc.)
│   ├── views/                  # Vistas/páginas principales
│   ├── router/                 # Configuración de Vue Router
│   ├── App.vue                 # Componente raíz
│   └── main.js                 # Punto de entrada
├── .env                        # Variables de entorno
├── package.json
└── README-es.md
```

---

## 📈 Vista previa de demostración

> Puedes alojar el proyecto localmente o implementarlo en línea para una demostración interactiva.
> Agrega capturas de pantalla o un enlace al sitio de demostración aquí si está disponible.

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.
Puedes usarlo, modificarlo y distribuirlo libremente con la debida atribución.

---

## 🙌 Agradecimientos

* [Vue.js](https://vuejs.org/)
* [Apache ECharts](https://echarts.apache.org/)
* [API de Amap (Gaode Map)](https://lbs.amap.com/)
