
# 🚦 交通ハザードの可視化システム

このプロジェクトは、**Vue.js**、**ECharts**、および **高徳地図（Amap）** を使用して構築された、交通ハザードデータの可視化システムです。複数階層の行政区画に対応したインタラクティブなマップと、多次元データを示す多様なグラフを通じて、交通安全に関する洞察を提供します。

---

## 🌍 多言語版

- [English (README.md)](README.md)
- [العربية (README‑ar.md)](README‑ar.md)
- [Español (README‑es.md)](README‑es.md)
- [Português (README‑pt.md)](README‑pt.md)

---

## 📌 主な機能

- 🌐 **多層行政区画の可視化**  
  高徳地図と ECharts を組み合わせて、都道府県、市区町村レベルの可視化を実現。

- 📊 **多様なグラフ表示**  
  棒グラフ、折れ線グラフ、円グラフ、ヒートマップ、散布図などで交通ハザードデータを表示。

- 🧭 **インタラクティブなマップ操作**  
  地図上でのホバー、ズーム、クリックによる階層切り替え、地域選択などの操作に対応。

- 🧩 **多次元データの表示**  
  時間、位置、深刻度、ハザードの種類など、複数の観点からデータを分析。

- 🔧 **モジュール化された拡張可能な構成**  
  Vue.js のコンポーネント設計により、再利用性と保守性を向上。

---

## 🛠️ 技術スタック

- **フロントエンドフレームワーク**: [Vue.js](https://vuejs.org/)
- **データ可視化**: [ECharts](https://echarts.apache.org/) + [高徳地図 JS API (Amap)](https://lbs.amap.com/)
- **開発ツール**: Vue CLI, Axios, Node.js

---

## 🚀 プロジェクトの始め方

### 前提条件

- Node.js (バージョン 14 以上)
- npm または yarn

### 依存関係のインストール

```bash
npm install
# または
yarn install
````

### 開発サーバーの起動

```bash
npm run serve
# または
yarn serve
```

その後、ブラウザで [http://localhost:8080](http://localhost:8080) にアクセスします。

---

## 📁 プロジェクト構成

```
Visualization-of-Traffic-Hazards/
├── public/
│   └── index.html              # HTML テンプレート
├── src/
│   ├── assets/                 # 静的アセット
│   ├── components/             # Vue コンポーネント（マップ、チャート等）
│   ├── views/                  # ページビュー
│   ├── router/                 # Vue Router 設定
│   ├── App.vue                 # ルートコンポーネント
│   └── main.js                 # エントリーポイント
├── .env                        # 環境変数
├── package.json
└── README-jp.md
```

---

## 📈 デモプレビュー

> このシステムはローカルでもホスティング可能です。
> オンラインデモやスクリーンショットがある場合は、ここに記載してください。

---

## 📄 ライセンス

このプロジェクトは MIT ライセンスのもとで提供されています。
ライセンスに従い、自由に利用・修正・配布が可能です。

---

## 🙌 謝辞

* [Vue.js](https://vuejs.org/)
* [Apache ECharts](https://echarts.apache.org/)
* [高徳地図 API (Amap)](https://lbs.amap.com/)


