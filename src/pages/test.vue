<template style="width: 100%; height: 100%">
  <div class="home-page">
    <Header @zoom-and-pan="handleZoomAndPan" @switchMapType="switchMapType" />
    <Count
      :sendData="summaryStatData"
      v-bind:class="{ 'hide-count': shouldHideCount }"
    ></Count>
    <div class="info">
      <div class="left-side">
        <div class="title">{{ currentDistrictName }}</div>
        <div class="date">
          <img src="../assets/date.png" />
          <input type="text" v-model="rage_time[0]" disabled />
          <div>-</div>
          <input type="text" v-model="rage_time[1]" disabled />
          <el-date-picker
            v-model="rage_time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="com()"
          >
          </el-date-picker>
        </div>
        <div class="level" v-bind:class="{ 'hide-when-zoomed': zoom > 11 }">
          <div class="sub_title">
            <img src="../assets/circle.png" />风险等级
          </div>
          <div id="level"></div>
        </div>
        <div class="level" v-bind:class="{ 'hide-when-zoomed': zoom < 12 }">
          <div class="district-danger-count-container">
            <div id="districtDangerCount-title">隐患总量</div>
            <div id="districtDangerCount">{{ districtDangerCount }}</div>
          </div>
        </div>
        <div class="level" v-bind:class="{ 'hide-when-zoomed': zoom > 11 }">
          <div class="sub_title">
            <img src="../assets/circle.png" />隐患类型分布
          </div>
          <div id="dangerType"></div>
        </div>
        <div class="level" v-bind:class="{ 'hide-when-zoomed': zoom < 12 }">
          <div class="dis_title">
            <!-- 显示两个标题，允许用户点击切换 -->
            <span
              class="title-item"
              @click="setDistributionType('street')"
              :class="{ active: showStreetDistribution }"
              >街道分布</span
            >
            <span
              class="title-item"
              @click="setDistributionType('type')"
              :class="{ active: !showStreetDistribution }"
              >类型分布</span
            >
          </div>
          <div ref="distributionChart" class="chart-container">
            <div
              ref="streetDistributionChart"
              class="chart-container-content"
              v-show="showStreetDistribution"
            ></div>
            <div
              ref="typeDistributionChart"
              class="chart-container-content"
              v-show="!showStreetDistribution"
            ></div>
          </div>
        </div>
      </div>
      <div class="right-side">
        <div class="map-switch-container">
          <div class="map-switch">
            <el-radio-group v-model="currentMapType" @change="switchMapType">
              <el-radio-button
                label="city"
                :class="{ active: currentMapType === 'city' && zoom <= 12 }"
                @click="switchMapType('city')"
              >
                全市地图
              </el-radio-button>
              <el-radio-button
                label="district"
                :class="{ active: currentMapType === 'district' && zoom > 11 }"
                @click="switchMapType('district')"
              >
                区域地图
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div class="option">
          <div class="row">
            <div class="t" @click="vis(1)">
              {{ option1
              }}<img src="../assets/arrow.png" :class="vis_type1 ? 'is' : ''" />
            </div>
            <div class="sub" v-show="vis_type1">
              <div @click="chose(1, '隐患点')">隐患点</div>
              <div @click="chose(1, '亡人事故点')">亡人事故点</div>
              <div @click="chose(1, '事故警情点')">事故警情点</div>
            </div>
          </div>
          <div class="row">
            <div class="t" @click="vis(2)">
              {{ option2
              }}<img src="../assets/arrow.png" :class="vis_type2 ? 'is' : ''" />
            </div>
            <div class="sub" v-show="vis_type2">
              <div @click="chose(2, '统计分布')">统计分布</div>
              <div @click="chose(2, '热力分布')">热力分布</div>
              <div @click="chose(2, '聚类分布')">聚类分布</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
<Map class = "map-background"></Map>
  </div>
</template>
  
  <script>
import * as echarts from "echarts";
import Header from "@/components/header.vue";
import Count from "@/components/count.vue";
import Map from "@/components/map.vue";
import Map_test from "@/components/map_test.vue"

export default {
  watch: {

  },
  name: "HomePage",
  components: { Header, Count, Map, Map_test},
  data() {
    return {
      summaryStatData: "",
      center: { lng: 114.064552, lat: 22.648456 },
      zoom: 11,
      rage_time: "",
      option1: "图层叠加",
      option2: "工具箱",
      vis_type1: false,
      vis_type2: false,
      showMap: false,
      riskLevelDatas: "",
      currentComponent: 'Map',
      dangerTypeDatas: "",
      districtDangerCount: 0,
      riskPoints: [],
      dangerList: [],
      points: [],
      currentDistrictName: "深圳市",
      layer1Points: [],
      layer2Points: [],
      layer3Points: [],
      pointStyles: [],
      polygonPathWithNames: [],
      polygonPath: [],
      polygonLabels: [],
      showRiskPoints: false,
      defaultCenter: { lng: 114.064552, lat: 22.588456 },
      map: null,
      zoom: 11,
      defaultZoom: 11,
      showStreetDistribution: true, // 默认显示街道分布
      distributionTitle: "街道分布",
      streetDistributionChart: null,
      typeDistributionChart: null,
      showStreetDistribution: true,
      currentMapType: "city",
      currentDistributionType: "",
      
    };
  },
  methods: {
    

    chose(type, text) {
      this.showRiskPoints = false;
      if (type === 1) {
        this.option1 = text;
        this.vis_type1 = !this.vis_type1;
      } else if (type === 2) {
        this.option2 = text;
        this.currentDistributionType = text;
        this.vis_type2 = !this.vis_type2;
        if (text === "统计分布" && this.vis_type2) {
          this.showRiskPoints = true;
        }
      }
    },

    vis(type) {
      if (type === 1) {
        this.vis_type1 = !this.vis_type1;
      } else {
        this.vis_type2 = !this.vis_type2;
      }
    },

   
    
    handleBoundaryClick(boundary) {
      this.boundaries.forEach((b) => {
        if (b.isSelected) {
          b.isSelected = false;
          b.strokeColor = b.originalStrokeColor;
          b.fillColor = b.originalFillColor;
        }
      });

      if (boundary) {
        boundary.isSelected = true;
        boundary.strokeColor = "green";
        boundary.fillColor = "green";
        this.currentDistrictName = boundary.name;

        this.center = {
          lng: boundary.center.lng,
          lat: boundary.center.lat,
        };
        this.zoom = boundary.zoom;
      }
      const districtId = boundary ? boundary.districtCode : null;

      if (districtId !== null) {
        this.fetchDangerList(districtId);
        this.getDistrictDangerCount(districtId);
        this.getDistrictStreetData(districtId).then((streetData) => {
          // 使用街道隐患数据初始化柱状图
          this.initStreetDistributionChart(streetData);
        });
        this.fetchDangerListByDistrict(districtId).then((dangerList) => {
          this.initTypeDistributionChart(dangerList);
        });
      }
    },

    setDistributionType(type) {
      this.showStreetDistribution = type === "street";
      if (type === "street") {
        this.$refs.streetDistributionChart.style.display = "block";
        this.$refs.typeDistributionChart.style.display = "none";
      } else {
        this.$refs.streetDistributionChart.style.display = "none";
        this.$refs.typeDistributionChart.style.display = "block";
      }
    },
    parseSzData(szData) {
      const features = szData.features;
      let polygonsWithNames = [];
      features.forEach((feature) => {
        if (feature.geometry.type === "MultiPolygon") {
          const coordinates = feature.geometry.coordinates[0];
          let path = [];
          coordinates.forEach((ring) => {
            ring.forEach((point) => {
              path.push({ lng: point[0], lat: point[1] });
            });
          });
          polygonsWithNames.push({
            path: path,
            name: feature.properties.name,
            code: feature.properties.code,
          });
        }
      });
      return polygonsWithNames;
    },

    showDangerPointDetail(dangerPoint) {
      const detail =
        `隐患点类别: ${dangerPoint.primaryDangerTypeName}\n` +
        `所属街道: ${dangerPoint.subDistrictName}`;
      alert(detail);
    },

    getDangerCountBySubDistrictId(subDistrictCode) {
      return new Promise((resolve, reject) => {
        if (subDistrictCode == null) {
          // 这将检查 null 或 undefined
          console.error("subDistrictCode is null or undefined");
          resolve(0);
          return;
        }

        const requestData = {
          subDistrictCode: subDistrictCode.toString(), // 安全调用 toString()
        };

        this.$http
          .post("/admin/index/getDangerList", requestData)
          .then((response) => {
            if (response.data && response.data.code === 0) {
              const dangerListData = response.data.data;
              const count = dangerListData.length;
              resolve(count);
            } else {
              console.error(
                "获取隐患数据失败或数据不存在",
                response.data.message
              );
              resolve(0); // 如果响应码不是 0，也解析为 0
            }
          })
          .catch((error) => {
            console.error("请求失败:", error);
            reject(error); // 将错误传递给 catch 处理
          });
      });
    },

    async addPolygons() {
      const szData = require("@/assets/sz.json");
      const polygonsWithNames = this.parseSzData(szData);
      console.log(
        "正在处理的多边形名称：",
        polygonsWithNames.map((p) => p.name)
      );

      for (const polygon of polygonsWithNames) {
        const centerPoint = this.getPolygonCenter(polygon.path);
        const dangerCount = await this.getDangerCountBySubDistrictId(
          polygon.code
        );
        console.log(`多边形名称：${polygon.code}，隐患总数：${dangerCount}`);
        const labelContent = `${polygon.name} (${dangerCount})`;
        this.polygonLabels.push({
          name: polygon.name,
          position: centerPoint,
          content: labelContent,
        });
      }
      this.polygonPathWithNames = polygonsWithNames;
    },

    getPolygonCenter(path) {
      let sumLng = 0;
      let sumLat = 0;
      path.forEach((point) => {
        sumLng += point.lng;
        sumLat += point.lat;
      });
      return {
        lng: sumLng / path.length,
        lat: sumLat / path.length,
      };
    },

    showLabel(index) {
      console.log("显示标签:", index);
    },

    hideLabel(index) {
      console.log("隐藏标签:", index);
    },

    getRiskPoints() {
      const requestData = {
        kw: "",
        limit: 10,
        offset: 0,
        orderBy: "",
        page: 0,
        pageSize: 10,
      };
      this.$http
        .post("/admin/index/getRiskPointList", requestData)
        .then((response) => {
          if (response.data && response.data.code === 0) {
            this.riskPoints = response.data.data.map((item) => ({
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              riskContent: item.riskContent,
            }));
            console.log(response.data);
          } else {
            console.error("获取风险点数据失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },

    showRiskDetail(point) {
      console.log(`风险点的ID: ${point.id}`);
      alert(`风险点描述：${point.riskContent}`);
    },

    fetchDangerList(districtId) {
      this.dangerList = [];
      const requestData = {
        districtId: parseInt(districtId, 10),
      };
      this.$http
        .post("/admin/index/getDangerList", requestData)
        .then((response) => {
          console.log("隐患列表请求的响应：", response);
          if (response.data && response.data.code === 0) {
            const dangerListData = response.data.data;
            dangerListData.forEach((item) => {
              const dangerPoint = {
                lng: parseFloat(item.startLongitude),
                lat: parseFloat(item.startLatitude),
                primaryDangerTypeId: parseInt(item.primaryDangerTypeId, 10),
                primaryDangerTypeName: item.primaryDangerTypeName,
                subDistrictName: item.subDistrictName,
              };
              this.dangerList.push(dangerPoint);
            });
            this.categorizeRiskPoints();
          } else {
            console.error("获取隐患列表失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },

    categorizeRiskPoints() {
      this.layer1Points = this.dangerList.filter(
        (point) => point.primaryDangerTypeId === 1
      );
      this.layer2Points = this.dangerList.filter(
        (point) => point.primaryDangerTypeId === 2
      );
      this.layer3Points = this.dangerList.filter(
        (point) => point.primaryDangerTypeId === 3
      );

      this.layer1Points.forEach((point) => {
        point.icon = {
          url: require("@/pic/red.png"),
          size: { width: 28, height: 28 },
          anchor: { width: 14, height: 14 },
        };
      });
      this.layer2Points.forEach((point) => {
        point.icon = {
          url: require("@/pic/yellow.png"),
          size: { width: 14, height: 14 },
          anchor: { width: 14, height: 14 },
        };
      });
      this.layer3Points.forEach((point) => {
        point.icon = {
          url: require("@/pic/green.png"),
          size: { width: 7, height: 7 },
          anchor: { width: 14, height: 14 },
        };
      });
    },

    getDistrictDangerCount(districtId) {
      const requestData = {
        districtId: parseInt(districtId, 10),
        endDate: this.rage_time[1],
        startDate: this.rage_time[0],
      };
      this.$http
        .post("/admin/index/getDistrictStatData", requestData)
        .then((response) => {
          if (response.data && response.data.code === 0) {
            const totalDangerCount = response.data.data.totalDangercount;
            this.districtDangerCount = totalDangerCount;
          } else {
            console.error("获取隐患数据失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },

    chart() {
      let res = 0;
      let res1 = 0;
      let res2 = 0;
      let data = this.riskLevelDatas;
      for (let i in data) {
        if (i == 0 || i == 1) {
          res += data[i].dangerCount;
        }
        if (i == 2) {
          res1 = data[i].dangerCount;
        }
        if (i == 3 || i == 4) {
          res2 += data[i].dangerCount;
        }
      }
      var chartDom = document.getElementById("level");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
          show: false,
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "70%"],
            // adjust the start and end angle
            startAngle: 180,
            endAngle: 360,
            data: [
              { value: res2, name: "高风险", label: { color: "#EF6765" } },
              { value: res1, name: "中风险", label: { color: "#FEC72F" } },
              { value: res, name: "低风险", label: { color: "#38CDD3" } },
            ],
            label: {
              fontSize: 12,
              fontWeight: 500,
              normal: {
                show: true,
                formatter: "{d}%\n{b}",
                offset: [0, 8],
              },
            },
            labelLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
        ],
        color: ["#EF6765", "#FEC72F", "#38CDD3"],
      };
      option && myChart.setOption(option);
      window.onresize=()=>{
        myChart.resize();
      }
    },

    dangerType() {
      let data = this.dangerTypeDatas;
      let name = [];
      let res = [];
      for (let i in data) {
        name.push(data[i].dangerTypeName);
        res.push(data[i].dangerCount);
      }
      var chartDom = document.getElementById("dangerType");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        grid: { containLabel: true },
        xAxis: {
          name: "",
          splitLine: {
            show: true, // 显示刻度线
            lineStyle: {
              color: "#59656E", // 设置刻度线颜色
            },
          },
        },
        yAxis: {
          data: name,
          type: "category",
          axisTick: {
            show: false, // 设置为false隐藏y轴刻度
          },
          axisLine: {
            lineStyle: {
              color: "#59656E", // 设置y轴颜色
            },
          },
        },
        series: [
          {
            data: res,
            type: "bar",
            barWidth: "7",
            itemStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 0.01,
                    color: "rgba(255,255,255,0)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#02C1FD", // 100% 处的颜色
                  },
                ],
              },
              borderRadius: [0, 10, 10, 0],
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },

    handleZoomAndPan(center, zoom, districtId, name) {
      this.center = center;
      this.zoom = zoom;
      this.districtId = districtId;
      this.currentDistrictName = name;

      this.fetchDangerList(districtId);
      this.getDistrictDangerCount(districtId);
      this.getDistrictStreetData(districtId).then((streetData) => {
        // 使用街道隐患数据初始化柱状图
        this.initStreetDistributionChart(streetData);
      });
      this.fetchDangerListByDistrict(districtId).then((dangerList) => {
        this.initTypeDistributionChart(dangerList);
      });
    },



    fetchAndPrintDistrictData() {
      this.$http
        .post("/admin/index/getCityStatData", {
          endDate: this.rage_time[1],
          startDate: this.rage_time[0],
        })
        .then((response) => {
          if (response.data && response.data.code === 0) {
            console.log("各区数据集：", response.data.data.districtDatas);
          } else {
            console.error("获取数据失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求失败:", error);
        });
    },

    async getDistrictStreetData(districtId) {
      const requestData = {
        districtId: districtId,
        startDate: this.rage_time[0],
        endDate: this.rage_time[1],
      };
      try {
        const response = await this.$http.post(
          "/admin/index/getDistrictStatData",
          requestData
        );
        console.log("街道数据请求响应：", response);
        if (response.data && response.data.code === 0) {
          return response.data.data.subDistrictDatas;
        } else {
          console.error("获取街道数据失败:", response.data.message);
        }
      } catch (error) {
        console.error("请求失败:", error);
      }
      return [];
    },

    initStreetDistributionChart(streetData) {
      if (!streetData || streetData.length === 0) {
        console.log("没有街道数据可供绘制图表");
        return;
      }

      const chartDom = this.$refs.streetDistributionChart;
      if (this.streetDistributionChart) {
        this.streetDistributionChart.dispose();
      }
      this.streetDistributionChart = echarts.init(chartDom);

      const xAxisData = streetData.map((item) => item.dangerCount);
      const yAxisData = streetData.map((item) => item.subDistrictName);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          containLabel: true,
          left: "5%",
          right: "4%",
          bottom: "3%",
          top: "3%",
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: yAxisData,
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            data: xAxisData,
            barWidth: "60%",
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                },
              },
            },
          },
        ],
      };

      this.streetDistributionChart.setOption(option);
    },

    initTypeDistributionChart(dangerList) {
      // 根据隐患类型统计数据初始化图表
      const typeCount = this.countDangerType(dangerList);
      const xAxisData = Object.keys(typeCount);
      const yAxisData = xAxisData.map((type) => ({
        value: typeCount[type],
        name: type,
      }));

      const chartDom = this.$refs.typeDistributionChart;
      if (this.typeDistributionChart) {
        this.typeDistributionChart.dispose();
      }
      this.typeDistributionChart = echarts.init(chartDom);

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          containLabel: true,
          left: "5%",
          right: "4%",
          bottom: "3%",
          top: "3%",
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: xAxisData,
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            data: yAxisData,
            barWidth: "60%",
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: "right",
                },
              },
            },
          },
        ],
      };

      this.typeDistributionChart.setOption(option);
    },

    countDangerType(dangerList) {
      return dangerList.reduce((acc, item) => {
        acc[item.primaryDangerTypeName] =
          (acc[item.primaryDangerTypeName] || 0) + 1;
        return acc;
      }, {});
    },

    async fetchDangerListByDistrict(districtId) {
      const requestData = {
        districtId: parseInt(districtId, 10),
      };
      return new Promise((resolve, reject) => {
        this.$http
          .post("/admin/index/getDangerList", requestData)
          .then((response) => {
            if (response.data && response.data.code === 0) {
              console.log("请求响应：", response);
              resolve(response.data.data);
            } else {
              console.error("获取隐患列表失败:", response.data.message);
              reject(new Error("获取隐患列表失败"));
            }
          })
          .catch((error) => {
            console.error("请求失败:", error);
            reject(error);
          });
      });
    },
    // 获取深圳市数据统计
    getCityStatData() {
      this.$http
        .post("admin/index/getCityStatData", {
          endDate: this.rage_time[1],
          startDate: this.rage_time[0],
        })
        .then((response) => {
          if (response.data && response.data.code === 0) {
            this.summaryStatData = response.data.data.summaryStatData;
            this.riskLevelDatas = response.data.data.riskLevelDatas;
            this.dangerTypeDatas = response.data.data.dangerTypeDatas;
          }
          this.chart();
          this.dangerType();
        })
        .catch((error) => {
          console.error("获取深圳市数据统计失败:", error);
        });
    },
  },
  mounted() {

    // 获取深圳市数据统计
    this.getCityStatData();
    this.fetchAndPrintDistrictData();
    this.getRiskPoints();
    this.addPolygons();
   
    this.$nextTick(() => {
      this.initStreetDistributionChart();
      this.initTypeDistributionChart();
    });
  },
};
</script>
  
<style scoped lang="scss">
.map-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* 设置 z-index 确保地图在背后 */
}
#level {
  height: 200px;
  width: 385px;
  margin: 0 auto;
  margin-top: -30px;
  margin-left: -5px;
  margin-bottom: -60px;
}
#dangerType {
  width: 400px;
  height: 340px;
  margin: 0 auto;
  margin-left: -20px;
  margin-top: -50px;
}
.bm-view {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: cover;
}

.chart-container {
  width: 385px;
  height: 350px;
  margin: 0 auto;
}

.hide-when-zoomed {
  display: none;
}

.hide-count {
  display: none;
}
.chart-container-content {
  width: 350px;
  height: 350px;
}

.dis_title {
  display: flex;
  margin-left: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 15px; /* 根据需要调整 */
}

.title-item {
  font-weight: lighter;
  cursor: pointer;
  margin-left: 9px;
  word-spacing: 2px;
  margin-right: 37px;
  color: #e6e6e6; /* 默认非激活颜色 */
}

.title-item.active {
  color: #01c2ff; /* 激活时的颜色 */
  border-bottom: 1.5px solid #01c2ff;
  padding-bottom: 3px;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-top: 290px;
  width: 100%;
}
.left-side {
  width: 420px;
  max-height: 650px;
  background: url("../assets/left_bg.png") no-repeat;
  background-size: cover;
  z-index: 1;
  margin-left: 20px;
  .title {
    font-weight: 700;
    font-size: 24px;
    color: #01c2ff;
    text-align: left;
    padding-left: 21px;
    padding-top: 34px;
  }
  .date {
    display: flex;
    justify-content: space-between;
    padding-left: 23px;
    padding-right: 35px;
    align-items: center;
    margin-top: 28px;
    color: #ffffff;
    position: relative;
    .el-date-editor {
      position: absolute;
      left: 0;
      width: 100%;
      height: 40px;
      opacity: 0;
    }
    input {
      width: 150px;
      height: 40px;
      background: #0f2b3f;
      border-radius: 4px 4px 4px 4px;
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      color: #a8d6ff;
    }
    img {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }
  .level {
    margin-top: 42px;
    .sub_title {
      color: #fff;
      display: flex;
      align-items: center;
      width: 385px;
      margin: 0 auto;
      padding-bottom: 7px;
      font-weight: 500;
      font-size: 14px;
      color: #ffffff;
      background: url("../assets/line.png") no-repeat bottom left;
      background-size: 385px 24px;
      img {
        margin-right: 6px;
      }
    }
  }
}
.right-side {
  margin-right: 39px;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 300px;
  align-items: center;
  .option {
    position: flex;
    margin-top: 10px;
    right: 0;
    top: 11px;
    display: flex;
    font-family: Source Han Sans, Source Han Sans;
    .row {
      margin-left: 13px;
      width: 140px;
      text-align: left;
      font-weight: 400;
      font-size: 14px;
      color: #000000;
      position: relative;
      .t {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        padding: 0 11px 0 16px;
        cursor: pointer;
        img {
          width: 13px;
          height: 7px;
          transition: transform 0.25s linear;
        }
        .is {
          transform: rotate(180deg);
        }
      }
      .sub {
        width: 140px;
        position: absolute;
        top: 50px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        left: 0;
        div {
          cursor: pointer;
          padding-left: 14px;
          margin: 15px 0;
        }
        div:hover {
          color: #0256ff;
          font-weight: 700;
        }
      }
    }
  }
}

.chart-container-content {
  height: 300px;
  margin-bottom: 10px;
}

.map-control-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0px;
  justify-content: center;
  background-color: #ffffff;
}

.map-switch {
  display: flex;
  justify-content: center; /* 调整为两端对齐 */
  border: 0;
  width: 280px;
  padding: 5px 5px; /* 增加间距 */
  background-color: #fff;
  border-radius: 20px;
}

::v-deep .map-switch {
  border: 0;
}

::v-deep .el-radio-group {
  border: 0;
}

::v-deep .el-radio-button__inner {
  border: 0;
  height: 30px;
  align-content: center;
  background-color: #ffffff;
  color: #000000;
  padding: 0 15px;
  text-align: center;
  width: 135px;
  display: flex;
  align-items: center;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner{
  border: 0;
}

::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  border: 0;
  background-color: #01c2ff;
  color: #ffffff;
  border-radius: 18px;
}

.district-danger-count-container {
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  margin-left: 20px;
}

#districtDangerCount-title {
  margin-right: 30px;
  font-size: 25px;
  white-space: nowrap;
  font-weight: 400;
}

#districtDangerCount {
  font-weight: 700;
  font-size: 50px;
  color: #01c2ff;
  white-space: nowrap;
}
::v-deep .anchorBL {
  display: none !important;
}
</style>