<template>
  <div>
    <div :id="type" style="width: 100%; height: 100vh"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import shenzhen from "../../src/assets/area/440300.json";
import luohu from "../../src/assets/area/440303.json";
import futian from "../../src/assets/area/440304.json";
import nanshan from "../../src/assets/area/440305.json";
import baoan from "../../src/assets/area/440306.json";
import longgan from "../../src/assets/area/440307.json";
import yantian from "../../src/assets/area/440308.json";
import longhua from "../../src/assets/area/440309.json";
import pingshan from "../../src/assets/area/440310.json";
import guangming from "../../src/assets/area/440311.json";
import dapeng from "../../src/assets/area/440312.json";

var that;
export default {
  name: "Map",
  data() {
    return {
      type: "shenzhen",
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
        that.$router.push({ name: 'MapTest', query: { id: params.data.districtId, area: params.name } });
      });
    },
    set_type() {
      switch (that.district.name) {
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
              itemStyle: { areaColor: this.getColor(res[i].districtName), borderColor: "#6D9AEC" },
            });
          }
          this.chart();
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
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
          this.chart()
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },
  },

  mounted() {
    that = this;
    this.getInfo();
  },
};
</script>

<style scoped>
</style>