
# 🚦 Visualization of Traffic Hazards

A web-based visualization system for traffic hazard data using **Vue.js**, **ECharts**, and **Amap (Gaode Map)**. This project enables multi-level administrative district visualization and presents multi-dimensional traffic hazard information through a variety of dynamic charts and interactive maps.

---

## 🌍 Translated Versions

- [日本語 (README‑jp.md)](README‑jp.md)
- [العربية (README‑ar.md)](README‑ar.md)
- [Español (README‑es.md)](README‑es.md)
- [Português (README‑pt.md)](README‑pt.md)

---

## 📌 Features

- 🌐 **Multi-layer Administrative Visualization**  
  Supports interactive geographic visualization at multiple administrative levels (province, city, district) using Amap and ECharts integration.

- 📊 **Rich Chart Types**  
  Displays traffic hazard data through bar charts, line charts, pie charts, heatmaps, and scatter plots.

- 🧭 **Dynamic Map Interaction**  
  Hover, zoom, click-to-drill, and region switching functionality integrated with map visuals.

- 🧩 **Multi-dimensional Data Display**  
  Visualizes data from various dimensions including time, location, severity, and hazard type.

- 🔧 **Modular & Scalable Architecture**  
  Built with Vue.js components for ease of development, testing, and scaling.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [Vue.js](https://vuejs.org/)
- **Data Visualization**: [ECharts](https://echarts.apache.org/) + [Amap JS API (高德地图)](https://lbs.amap.com/)
- **Development Tools**: Vue CLI, Axios, Node.js

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 14.x)
- npm or yarn

### Install Dependencies

```bash
npm install
# or
yarn install
````

### Run Development Server

```bash
npm run serve
# or
yarn serve
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Project Structure

```
Visualization-of-Traffic-Hazards/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── assets/                 # Static assets
│   ├── components/             # Vue components (map, charts, etc.)
│   ├── views/                  # Main views/pages
│   ├── router/                 # Vue Router config
│   ├── App.vue                 # Root component
│   └── main.js                 # Entry point
├── .env                        # Environment variables
├── package.json
└── README.md
```

---

## 📈 Demo Preview

> You can host locally or deploy online for an interactive demo.
> Add screenshots or link to a demo site here if available.

---

## 📄 License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute with proper attribution.

---

## 🙌 Acknowledgements

* [Vue.js](https://vuejs.org/)
* [Apache ECharts](https://echarts.apache.org/)
* [Amap API (高德地图)](https://lbs.amap.com/)


