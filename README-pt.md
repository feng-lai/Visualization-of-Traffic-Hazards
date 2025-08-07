
# 🚦 Visualização de Riscos de Trânsito

Este projeto é um sistema de visualização de dados sobre riscos de trânsito desenvolvido com **Vue.js**, **ECharts** e **Amap (Gaode Map)**. Ele permite a visualização interativa de divisões administrativas em múltiplos níveis e apresenta informações sobre perigos de trânsito a partir de diversas dimensões, usando gráficos dinâmicos e mapas interativos.

---

## 🌍 Versões Traduzidas

- [English (README.md)](README.md)
- [日本語 (README‑jp.md)](README‑jp.md)
- [العربية (README‑ar.md)](README‑ar.md)
- [Español (README‑es.md)](README‑es.md)

---

## 📌 Funcionalidades

- 🌐 **Visualização de Divisões Administrativas em Múltiplos Níveis**  
  Suporte para visualização geográfica interativa nos níveis de província, cidade e distrito, com integração de Amap e ECharts.

- 📊 **Diversos Tipos de Gráficos**  
  Exibição de dados por meio de gráficos de barras, linhas, pizza, mapas de calor e gráficos de dispersão.

- 🧭 **Interação Dinâmica com o Mapa**  
  Funcionalidades como passar o cursor, zoom, clique para detalhar e troca de região.

- 🧩 **Exibição de Dados Multidimensionais**  
  Visualização de dados com base em tempo, localização, gravidade e tipo de risco.

- 🔧 **Arquitetura Modular e Escalável**  
  Desenvolvido com componentes Vue.js para facilitar a expansão, manutenção e reutilização.

---

## 🛠️ Tecnologias Utilizadas

- **Framework Front-end**: [Vue.js](https://vuejs.org/)
- **Visualização de Dados**: [ECharts](https://echarts.apache.org/) + [Amap JS API](https://lbs.amap.com/)
- **Ferramentas de Desenvolvimento**: Vue CLI, Axios, Node.js

---

## 🚀 Primeiros Passos

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalar Dependências

```bash
npm install
# ou
yarn install
````

### Rodar o Servidor de Desenvolvimento

```bash
npm run serve
# ou
yarn serve
```

Depois abra o navegador e acesse [http://localhost:8080](http://localhost:8080).

---

## 📁 Estrutura do Projeto

```
Visualization-of-Traffic-Hazards/
├── public/
│   └── index.html              # Modelo HTML
├── src/
│   ├── assets/                 # Arquivos estáticos
│   ├── components/             # Componentes Vue (mapas, gráficos, etc.)
│   ├── views/                  # Páginas principais
│   ├── router/                 # Configuração do Vue Router
│   ├── App.vue                 # Componente principal
│   └── main.js                 # Ponto de entrada
├── .env                        # Variáveis de ambiente
├── package.json
└── README-pt.md
```

---

## 📈 Visualização de Demonstração

> O sistema pode ser executado localmente ou implantado online para uma demonstração interativa.
> Adicione capturas de tela ou um link para o site de demonstração aqui, se disponível.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
Sinta-se à vontade para usar, modificar e distribuir com a devida atribuição.

---

## 🙌 Agradecimentos

* [Vue.js](https://vuejs.org/)
* [Apache ECharts](https://echarts.apache.org/)
* [API do Amap (Gaode Map)](https://lbs.amap.com/)


