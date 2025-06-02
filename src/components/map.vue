<template>
  <div>
    <div id="shenzhen" class="map"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import shenzhen from "../../src/assets/area/440300.json";

var that;
export default {
  name: "Map",
  props: {
    showHeatPoints: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      myChart: null,
      type: "shenzhen",
      option: {
        colorBy: "data",
        series: [
          {
            name: "",
            type: "map",
            map: "shenzhen",
            scaleLimit: {
              min: 1.2,
            },
            label: {
              show: true,
              formatter: "{b}\n\n{c}",
              color: "#829BE1",
              fontSize: 14,
              fontWeight: 700,
            },
            data: [],
          },
        ],
      },
      district: {},
      districtColors: {
        罗湖区: "#A5D9BE",
        福田区: "#D7F3A6",
        南山区: "#F0F2A5",
        宝安区: "#F4C2A6",
        龙岗区: "#E59A9A",
        盐田区: "#A2D0DB",
        龙华区: "#F6AAA8",
        坪山区: "#A4E8A5",
        光明区: "#A9F3A6",
        大鹏新区: "#A4D0C6",
      },
    };
  },
  methods: {
    chart() {
      this.myChart = echarts.init(document.getElementById("shenzhen"));
      echarts.registerMap("shenzhen", shenzhen);

      this.myChart.setOption(this.option);
      window.onresize = () => {
        this.myChart.resize();
      };

      this.myChart.on("click", function (params) {
        that.$emit("setArea", params.data.districtId, params.name);
      });
    },
    getInfo() {
      this.$http
        .post("/admin/index/getCityStatData", {})
        .then((response) => {
          let res = response.data.data.districtDatas;
          for (let i in res) {
            this.option.series[0].data.push({
              name: res[i].districtName,
              value: res[i].dangerCount,
              districtId: res[i].districtId,
              itemStyle: {
                areaColor: this.getColor(res[i].districtName),
                borderColor: "#6D9AEC",
              },
            });
          }
          this.chart();
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },
    getColor(name) {
      switch (name) {
        case "罗湖区":
          return "#A5D9BE";
          break;
        case "福田区":
          return "#D7F3A6";
          break;
        case "南山区":
          return "#F0F2A5";
          break;
        case "宝安区":
          return "#F4C2A6";
          break;
        case "龙岗区":
          return "#E59A9A";
          break;
        case "盐田区":
          return "#A2D0DB";
          break;
        case "龙华区":
          return "#F6AAA8";
          break;
        case "坪山区":
          return "#A4E8A5";
          break;
        case "光明区":
          return "#A9F3A6";
          break;
        case "大鹏新区":
          return "#A4D0C6";
          break;
      }
    },
    getDistrictInfo() {
      this.$http
        .post("/admin/index/getDistrictStatData", {
          districtId: this.district.data.districtId,
        })
        .then((response) => {
          let res = response.data.data.subDistrictDatas;
          for (let i in res) {
            this.option.series[0].data.push({
              name: res[i].subDistrictName,
              value: res[i].dangerCount,
              districtId: res[i].subDistrictId,
              itemStyle: { areaColor: "#ACF6A9", borderColor: "#6D9AEC" },
            });
          }
          this.chart();
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },
    
    hideHeatMap() {
      if (this.myChart) {
        const scatterSeriesIndex = this.myChart
          .getOption()
          .series.findIndex((series) => series.name === "热力统计");
        if (scatterSeriesIndex !== -1) {
          this.myChart.dispose()
          this.getInfo()
        }
      }
    },
    plotPointsOnMap(data) {
      if (!this.myChart) {
        this.chart();
      }
      let scatterSeries = {
        name: "热力统计",
        type: "scatter",
        geoindex: 0,

        coordinateSystem: "geo",
        data: data.map((item) => ({
          name: item.subDistrictName,
          value: [
            parseFloat(item.startLongitude),
            parseFloat(item.startLatitude),
            item.primaryDangerTypeId,
          ],
        })),
        symbolSize: function (dataItem) {
          return Math.sqrt(dataItem[2]) * 10;
        },
        label: {
          emphasis: {
            show: false,
          },
        },
        itemStyle: {
          normal: {
            iconType: "image",
            imageUrl: function (dataItem) {
              switch (dataItem[2]) {
                case 1:
                  return require("@/pic/red.png");
                case 2:
                  return require("@/pic/yellow.png");
                case 3:
                  return require("@/pic/green.png");
              }
            },
          },
        },
      };

      const originalOption = this.myChart.getOption();

      this.myChart.setOption({
        geo: {
          map: "shenzhen",
          show: false,
        },
        series: originalOption.series.concat(scatterSeries),
      });
    },
  },

  mounted() {
    that = this;
    this.getInfo();
  },
};
</script>

<style scoped  lang="scss">
.map {
  width: 1441px;
  height: 767px;
}
</style>