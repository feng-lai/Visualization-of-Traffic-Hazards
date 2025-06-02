<template>
  <div>
    <div id="main-map" v-if="showHeatPoints" style="width: 100%; height: 100%; display: none"></div>
    <div :id="type" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import shenzhen from "../assets/area/440300.json";
import luohu from "../assets/area/440303.json";
import futian from "../assets/area/440304.json";
import nanshan from "../assets/area/440305.json";
import baoan from "../assets/area/440306.json";
import longgan from "../assets/area/440307.json";
import yantian from "../assets/area/440308.json";
import longhua from "../assets/area/440309.json";
import pingshan from "../assets/area/440310.json";
import guangming from "../assets/area/440311.json";
import dapeng from "../assets/area/440312.json";

var that;
export default {
  name: "Map",
  props: ["showHeatPoints"],
  data() {
    return {
      type:'shenzhen',
      area: "",
      id:'',
      option: {
        colorBy: "data",
        series: [
          {
            name: "",
            type: "map",
            map: "shenzhen",
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
      district: {}
    };
  },
  methods: {
    chart() {
      let myChart = echarts.init(document.getElementById(this.type));
      switch (this.type) {
        case "shenzhen":
          echarts.registerMap("shenzhen", shenzhen);
          break;
        case "luohu":
          echarts.registerMap("shenzhen", luohu);
          break;
        case "futian":
          echarts.registerMap("shenzhen", futian);
          break;
        case "nanshan":
          echarts.registerMap("shenzhen", nanshan);
          break;
        case "baoan":
          echarts.registerMap("shenzhen", baoan);
          break;
        case "longgan":
          echarts.registerMap("shenzhen", longgan);
          break;
        case "yantian":
          echarts.registerMap("shenzhen", yantian);
          break;
        case "longhua":
          echarts.registerMap("shenzhen", longhua);
          break;
        case "pingshan":
          echarts.registerMap("shenzhen", pingshan);
          break;
        case "guangming":
          echarts.registerMap("shenzhen", guangming);
          break;
        case "dapeng":
          echarts.registerMap("shenzhen", dapeng);
          break;
      }
      myChart.setOption(that.option);
      window.onresize = () => {
        myChart.resize();
      };
      myChart.on("click", function (params) {
        
      });
    },
    set_type() {
      switch (that.area) {
        case "罗湖区":
          this.type = "luohu";
          break;
        case "福田区":
          this.type = "futian";
          break;
        case "南山区":
          this.type = "nanshan";
          break;
        case "宝安区":
          this.type = "baoan";
          break;
        case "龙岗区":
          this.type = "longgan";
          break;
        case "盐田区":
          this.type = "yantian";
          break;
        case "龙华区":
          this.type = "longhua";
          break;
        case "坪山区":
          this.type = "pingshan";
          break;
        case "光明区":
          this.type = "guangming";
          break;
        case "大鹏新区":
          this.type = "dapeng";
          break;
      }
    },
    getColor(name){
      switch (name) {
        case "罗湖区":
          return '#A5D9BE';
        break;
        case "福田区":
          return '#D7F3A6';
          break;
        case "南山区":
          return '#F0F2A5';
          break;
        case "宝安区":
          return '#F4C2A6';
          break;
        case "龙岗区":
          return '#E59A9A';
          break;
        case "盐田区":
          return '#A2D0DB';
          break;
        case "龙华区":
          return '#F6AAA8';
          break;
        case "坪山区":
          return '#A4E8A5';
          break;
        case "光明区":
          return '#A9F3A6';
          break;
        case "大鹏新区":
          return '#A4D0C6';
          break;
      }
    },

    getDistrictInfo() {
      this.$http
        .post("/admin/index/getDistrictStatData", {
          districtId: this.id
        })
        .then((response) => {
          let res = response.data.data.subDistrictDatas;
          for (let i in res) {
            this.option.series[0].data.push({
              name: res[i].subDistrictName,
              value: res[i].dangerCount,
              districtId: res[i].subDistrictId,
              itemStyle: { areaColor: this.getColor(this.area), borderColor: "#6D9AEC" },
            });
          }
          this.chart();
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },

    async fetchDangerData() {
      const requestData = {
        districtId: this.id,
        subDistrictId: this.subDistrictId,
      };
      try {
        const response = await this.$http.post(
          "/admin/index/getDangerList",
          requestData
        );
        if (response.data && response.data.code === 0) {
          this.plotPointsOnMap(response.data.data);
          console.log(response);
        }
      } catch (error) {
        console.error("请求失败:", error);
      }
    },
    plotPointsOnMap(data) {
      if (!this.showHeatPoints) return;

      const echarts = this.$echarts;
      echarts.getInstanceByDom(document.getElementById("main-map")) ||
        echarts.init(document.getElementById("main-map"));
      let seriesData = data.map((item) => ({
        name: item.subDistrictName,
        value: [
          parseFloat(item.endLongitude),
          parseFloat(item.endLatitude),
          item.primaryDangerTypeId,
        ],
      }));

      myChart.setOption({
        series: [
          {
            name: "热力统计",
            type: "scatter",
            coordinateSystem: "geo",
            data: seriesData,
            symbolSize: function (dataItem) {
              return Math.sqrt(dataItem[2]) * 100;
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
                      return "../../pic/red.png";
                    case 2:
                      return "../../pic/yellow.png";
                    case 3:
                      return "../../pic/green.png";
                  }
                },
              },
            },
          },
        ],
      });
    },
  },

  mounted() {
    const { id, area } = this.$route.query;
    that = this;
    this.id = this.$route.query.id;
    this.area = this.$route.query.area;
    this.set_type()
    this.getDistrictInfo();
    this.fetchDangerData();
  },
};
</script>

<style scoped>
</style>