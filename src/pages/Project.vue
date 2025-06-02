<template>
  <div class="home-page">
    <Header></Header>
    <Count :sendData="summaryStatData"></Count>
    <div class="info">
      <div class="left-side">
        <div class="title">{{ selectedProjectName }}</div>
        <div class="date" v-if="showDateRangePicker">
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
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            @change="com()"
          >
          </el-date-picker>
        </div>
        <div class="district-danger-count-container" v-if="isProjectSelected">
          <div class="count-title-container" style="margin-right: 0px">
            <div class="count-value">{{ districtDangerCount }}</div>
            <div class="count-title">隐患总量</div>
          </div>
          <div class="count-title-container">
            <div class="count-value" :style="{ color: '#fedf5f' }">
              {{ totalInvestMoney | formatMoney }}
            </div>
            <div class="count-title">投资估算（万元）</div>
          </div>
        </div>
        <div class="level">
          <div class="sub_title">
            <img src="../assets/circle.png" />风险等级
          </div>
          <div id="level"></div>
        </div>
        <div
          id="stackedBarChart"
          v-show="stackedBarChartVisible"
          style="width: 500px; height: 30px"
        ></div>
        <div class="chart-title-container">
          <div class="chart-title" v-show="stackedBarChartVisible">
            分批实施计划
          </div>
          <div class="chart-legend" v-if="stackedBarChartVisible">
            <span
              class="legend-item"
              :style="{ backgroundColor: colors[0] }"
            ></span>
            一批
            <span
              class="legend-item"
              :style="{ backgroundColor: colors[1] }"
            ></span>
            二批
            <span
              class="legend-item"
              :style="{ backgroundColor: colors[2] }"
            ></span>
            三批
          </div>
        </div>
        <div class="level">
          <div class="sub_title">
            <img src="../assets/circle.png" />隐患类型分布
          </div>
          <div id="dangerType"></div>
        </div>
      </div>
      <div class="left-side right-side">
        <div class="title">选择项目</div>
        <div class="search">
          <i class="el-icon-search"></i>
          <input
            type="text"
            placeholder="搜索项目名称"
            v-model="searchKeyword"
          />
          <div class="btn" @click="onSearch">搜索</div>
        </div>
        <div class="project">
          <div class="entry" v-for="project in projectList" :key="project.id">
            <div class="row" @click="selectProject(project.id)">
              <div>{{ project.projectName }}</div>
              <el-radio
                v-model="selectedProjectId"
                :label="project.id"
              ></el-radio>
            </div>
          </div>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalProjects"
            layout="prev, pager, next"
            prev-text="上一页"
            next-text="下一页"
            background
          >
          </el-pagination>
        </div>
        <div class="btn_group">
          <div @click="cancelSelection">取消</div>
          <div @click="confirmSelection">确定</div>
        </div>
      </div>
    </div>
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
      @ready="handler"
      :scroll-wheel-zoom="true"
      ><template v-if="isProjectSelected">
        <bm-boundary
          v-for="(boundary, index) in boundaries"
          :key="index"
          :name="boundary.name"
          :strokeweight="2"
          :strokeOpacity="0.5"
          :fillOpacity="0.5"
          :strokeColor="boundary.isSelected ? 'green' : boundary.strokeColor"
          :fillColor="boundary.isSelected ? 'green' : boundary.fillColor"
          :clicking="true"
          @click="handleBoundaryClick(boundary)"
        ></bm-boundary> </template
    ></baidu-map>
  </div>
</template>

<script>
import * as echarts from "echarts";
import Header from "@/components/header.vue";
import Count from "@/components/count.vue";
export default {
  name: "HomePage",
  components: { Header, Count },
  data() {
    return {
      summaryStatData: "",
      center: { lng: 0, lat: 0 },
      zoom: 3,
      rage_time: "",
      riskLevelDatas: "",
      dangerTypeDatas: "",
      checked: false,
      checkedArray: [],
      projectList: [],
      allProjects: [],
      searchKeyword: "",
      currentPage: 1,
      colors: ["#4792fe", "#79ffb1", "#fedf5f"],
      pageSize: 7,
      totalProjects: 0,
      defaultCenter: { lng: 114.064552, lat: 22.588456 },
      map: null,
      zoom: 11,
      defaultZoom: 11,
      selectedProjectId: null,
      showDateRangePicker: true,
      isProjectSelected: false,
      correctBatchDatas: [],
      stackedBarChartVisible: false,
      selectedProjectName: "深圳市",
      totalInvestMoney: 0,
      isFetchingTotal: false,
      isSelectionVisible: true,
      boundaries: [
        {
          name: "深圳市宝安区",
          strokeColor: "blue",
          fillColor: "blue",
          originalStrokeColor: "blue",
          originalFillColor: "blue",
          isSelected: false,
          districtCode: 6,
          center: { lng: 113.889322, lat: 22.549912 },
          zoom: 12,
        },
        {
          name: "深圳市罗湖区",
          strokeColor: "blue",
          fillColor: "blue",
          originalStrokeColor: "blue",
          originalFillColor: "blue",
          isSelected: false,
          districtCode: 4,
          center: { lng: 114.13743190157, lat: 22.554484875856 },
          zoom: 12,
        },
        {
          name: "深圳市福田区",
          strokeColor: "red",
          fillColor: "red",
          originalStrokeColor: "red",
          originalFillColor: "red",
          isSelected: false,
          districtCode: 3,
          center: { lng: 114.055036, lat: 22.52153 },
          zoom: 12,
        },
        {
          name: "深圳市南山区",
          strokeColor: "yellow",
          fillColor: "yellow",
          originalStrokeColor: "yellow",
          originalFillColor: "yellow",
          isSelected: false,
          districtCode: 5,
          center: { lng: 113.93653916925, lat: 22.538500195784 },
          zoom: 12,
        },
        {
          name: "深圳市龙岗区",
          strokeColor: "blue",
          fillColor: "blue",
          originalStrokeColor: "blue",
          originalFillColor: "blue",
          isSelected: false,
          districtCode: 7,
          center: { lng: 114.249751, lat: 22.718203 },
          zoom: 12,
        },
        {
          name: "广东省深圳市龙华区",
          strokeColor: "blue",
          fillColor: "blue",
          originalStrokeColor: "blue",
          originalFillColor: "blue",
          isSelected: false,
          districtCode: 9,
          center: { lng: 114.045441, lat: 22.696678 },
          zoom: 12,
        },
        {
          name: "广东省深圳市坪山区",
          strokeColor: "yellow",
          fillColor: "yellow",
          originalStrokeColor: "yellow",
          originalFillColor: "yellow",
          isSelected: false,
          districtCode: 10,
          center: { lng: 114.350844, lat: 22.708786 },
          zoom: 12,
        },
        {
          name: "光明区",
          strokeColor: "yellow",
          fillColor: "yellow",
          originalStrokeColor: "yellow",
          originalFillColor: "yellow",
          isSelected: false,
          districtCode: 11,
          center: { lng: 113.944289, lat: 22.752009 },
          zoom: 12,
        },
        {
          name: "深圳市盐田区",
          strokeColor: "red",
          fillColor: "red",
          originalStrokeColor: "red",
          originalFillColor: "red",
          isSelected: false,
          districtCode: 8,
          center: { lng: 114.2434301551, lat: 22.563437914836 },
          zoom: 12,
        },
        {
          name: "广东省深圳市大鹏新区",
          strokeColor: "yellow",
          fillColor: "yellow",
          originalStrokeColor: "yellow",
          originalFillColor: "yellow",
          isSelected: false,
          districtCode: 12,
          center: { lng: 114.416298, lat: 22.696678 },
          zoom: 12,
        },
      ],
    };
  },
  watch: {
    rage_time(newVal, oldVal) {
      console.log("rage_time changed from", oldVal, "to", newVal);
    },
  },
  methods: {
    com() {
      this.getCityStatData();
      console.log(this.rage_time);
    },

    handleZoomAndPan(center, zoom) {
      this.center = center;
      this.zoom = zoom;
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
      myChart.resize();
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
      window.onresize=()=>{
        myChart.resize();
      }
    },

    calculateStackedBarData() {
      if (!this.correctBatchDatas.length) return;
      const total = this.correctBatchDatas.reduce(
        (acc, cur) => acc + cur.correctDangerCount,
        0
      );
      this.stackedBarData = this.correctBatchDatas.map((item) => ({
        name: `批次${item.correctBatchNumber}`,
        value: item.correctDangerCount,
        percent: ((item.correctDangerCount / total) * 100).toFixed(2) + "%",
      }));
      console.log("Stacked Bar Data:", this.stackedBarData);
      this.stackedBarChart();
    },

    stackedBarChart() {
      const chartDom = document.getElementById("stackedBarChart");
      const myChart = echarts.init(chartDom);

      const dataNames = ["实施计划"];
      const dataPercents = this.stackedBarData.map((item) =>
        parseFloat(item.percent)
      );
      const name = this.stackedBarData.map((item) => item.name);

      let accumulatedData = [];
      dataPercents.forEach((percent, index) => {
        if (index === 0) {
          // 第一个数据直接使用原始百分比
          accumulatedData.push(percent);
        } else {
          // 其他数据基于前一个数据进行累加
          accumulatedData.push(accumulatedData[index - 1] + percent);
        }
      });

      // 将数据分为三个批次
      const batchSize = Math.ceil(dataPercents.length / 3);
      const batches = [];

      for (let i = 0; i < 3; i++) {
        const start = i * batchSize;
        const end = Math.min(start + batchSize, dataPercents.length);
        const batchData = dataPercents.slice(start, end);
        const batchAccumulatedData = batchData.reduce((acc, curr, idx) => {
          if (idx === 0) {
            acc.push(curr);
          } else {
            acc.push(acc[idx - 1] + curr);
          }
          return acc;
        }, []);
        batches.push(batchAccumulatedData);
      }

      const option = {
        legend: {
          orient: "vertical",
          right: "start",
          bottom: "start",
          data: name,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          top: "60%",
          left: "5%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
          width: "45%",
          height: "100%",
        },
        xAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          data: dataNames,
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        series: [
          {
            name: "第一批",
            type: "bar",
            stack: "stack",
            barCategoryGap: "0%",
            itemStyle: {
              normal: {
                color: "#4792fe",
              },
            },
            data: batches[0],
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: (params) => {
                  const percent = batches[0][params.dataIndex];
                  return `${percent}%`;
                },
              },
            },
          },

          {
            name: "第二批",
            type: "bar",
            stack: "stack",
            barCategoryGap: "0%",
            itemStyle: {
              normal: {
                color: "#79ffb1",
              },
            },
            data: batches[1],
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: (params) => {
                  const percent = batches[1][params.dataIndex];
                  return `${percent}%`;
                },
              },
            },
          },
          {
            name: "第三批",
            type: "bar",
            stack: "stack",
            barCategoryGap: "0%",
            itemStyle: {
              normal: {
                color: "#fedf5f",
              },
            },
            data: batches[2],
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: (params) => {
                  const percent = batches[2][params.dataIndex];
                  return `${percent}%`;
                },
              },
            },
          },
        ],
      };

      myChart.setOption(option);
      this.stackedBarChartVisible = true;
    },

    handler({ BMap, map }) {
      this.center.lng = 114.064552;
      this.center.lat = 22.648456;
      this.zoom = 11;
      this.map = map;
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

        this.center = {
          lng: boundary.center.lng,
          lat: boundary.center.lat,
        };
        this.zoom = boundary.zoom;
      }
      const districtId = boundary ? boundary.districtCode : null;
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

    fetchProjectList() {
      this.$http
        .post("/admin/index/getProjectList", {
          projectName: this.searchKeyword,
          page: 1,
          pageSize: this.pageSize,
        })
        .then((response) => {
          if (response.data && response.data.code === 0) {
            this.allProjects = response.data.data;
            this.totalProjects = this.allProjects.length;
            this.updateDisplayedProjects();
            console.log(this.allProjects);
          } else {
            console.error("获取项目列表失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求项目列表时发生错误:", error);
        });
    },

    onSearch() {
      this.currentPage = 1;
      this.fetchProjectList();
    },

    confirmSelection() {
      if (!this.selectedProjectId) {
        alert("请先选择一个项目");
        return;
      }

      const project = this.projectList.find(
        (p) => p.id === this.selectedProjectId
      );

      if (project) {
        this.getProjectStatData(this.selectedProjectId);
        this.isProjectSelected = true;
        this.selectedProjectName = project.projectName;
      } else {
        alert("选择的项目不存在");
      }
    },

    selectProject(projectId) {
      const project = this.projectList.find((p) => p.id === projectId);
      if (project) {
        this.selectedProjectId = projectId;
      }
    },

    cancelSelection() {
      this.selectedProjectId = null;
      this.isProjectSelected = false;
      this.selectedProjectName = "深圳市";
      this.showDateRangePicker = true;
      this.stackedBarChartVisible = false;
    },

    getProjectStatData(projectId) {
      this.$http
        .post("/admin/index/getProjectStatData", {
          projectId: projectId,
          endDate: this.rage_time[1],
          startDate: this.rage_time[0],
        })
        .then((response) => {
          console.log("2", this.rage_time[1]);
          if (response.data && response.data.code === 0) {
            this.updateCharts(response.data.data);
            console.log("3", this.rage_time[1]);
            console.log(response);
          } else {
            console.error("获取项目统计数据失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求项目统计数据失败:", error);
        });
    },

    updateCharts(projectStats) {
      this.riskLevelDatas = projectStats.riskLevelDatas;
      this.dangerTypeDatas = projectStats.dangerTypeDatas;
      this.districtDangerCount = projectStats.totalDangerCount;
      this.totalInvestMoney = projectStats.totalInvestMoney;
      this.correctBatchDatas = projectStats.correctBatchDatas;

      this.hideDateRangePicker();
      this.calculateStackedBarData();
      this.chart();
      this.stackedBarChart();
      this.dangerType();
    },

    hideDateRangePicker() {
      this.showDateRangePicker = false;
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.updateDisplayedProjects();
    },

    updateDisplayedProjects() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.projectList = this.allProjects.slice(start, end);
    },
  },
  mounted() {
    // 获取深圳市数据统计
    this.getCityStatData();
    this.fetchProjectList();
  },
};
</script>

<style scoped lang="scss">
.chart-title-container {
  display: flex;         
  align-items: center;    
  justify-content: space-between; 
  margin-bottom: 10px;   
  margin-left: 10px;
  margin-right: 10px; 
}
.legend-item {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 2px;
  vertical-align: middle;
  color: #fff;
  font-size: 8px;
  font-weight: 300;
}
.chart-legend {
  color: white; 
  margin-right: 5px;
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
  z-index: 1;
}
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: cover;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-top: 290px;
  width: 100%;
}
.left-side {
  z-index: 2;
  width: 420px;
  background: url("../assets/left_bg.png") no-repeat;
  background-size: cover;
  max-height: 650px;
  margin-left: 20px;
  .title {
    font-weight: 800;
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
    margin-top: 20px;
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
  .chart-title {
    font-weight: 300;
    font-size: 8;
    align-content: flex-start;
    text-align: start;
    margin-top: 5px;
    margin-left: 10px;
    color: #fff;
  }
}
.right-side {
  margin-right: 19px;
  max-height: 600px;
  .search {
    display: flex;
    position: relative;
    align-items: center;
    padding: 0 21px;
    margin-top: 28px;
    justify-content: space-between;
    .el-icon-search {
      position: absolute;
      left: 29px;
      width: 14px;
      height: 14px;
      top: 50%;
      margin-top: -7px;
      color: #a8d6ff;
    }
    input {
      width: 242px;
      height: 40px;
      background: #0f2b3f;
      border-radius: 4px 4px 4px 4px;
      padding-left: 28px;
      font-weight: 400;
      font-size: 14px;
      color: #a8d6ff;
    }
    input::placeholder {
      font-weight: 400;
      font-size: 14px;
      color: #a8d6ff;
    }
    .btn {
      width: 93px;
      height: 30px;
      line-height: 30px;
      background: rgba(10, 26, 52, 0.6);
      box-shadow: inset 0px 0px 5px 1px rgba(3, 251, 255, 0.6513);
      border-radius: 4px 4px 4px 4px;
      border: 1px solid rgba(89, 175, 249, 0.7049);
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 400;
      font-size: 16px;
      color: #a8d6ff;
      cursor: pointer;
    }
  }
  .project {
    width: 378px;
    height: 350px;
    background: #0f2b3f;
    border-radius: 4px 4px 4px 4px;
    margin: 0 auto;
    margin-top: 19px;
    .entry {
      padding: 10px;
      padding-right: 42px;
      min-height: 35px;
      box-sizing: border-box;
      margin-top: 5px;
      .row {
        margin-bottom: 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: Source Han Sans, Source Han Sans;
        font-weight: 400;
        font-size: 14px;
        color: #a8d6ff;
      }
    }
  }

  .btn_group {
    display: flex;
    margin-top: 20px;
    justify-content: center;
    align-items: center;
    div {
      width: 100px;
      height: 40px;
      background: rgba(10, 26, 52, 0.6);
      box-shadow: inset 0px 0px 5px 1px rgba(3, 251, 255, 0.6513);
      border-radius: 60px 60px 60px 60px;
      border: 1px solid rgba(89, 175, 249, 0.7049);
      margin-right: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: Source Han Sans, Source Han Sans;
      font-weight: 400;
      font-size: 16px;
      color: #01c2ff;
    }
    div:nth-child(2) {
      margin-right: 0;
    }
  }
}
::v-deep .anchorBL {
  display: none !important;
}
::v-deep .btn-next {
  background: initial !important;
}
::v-deep .el-radio__label {
  display: none;
}
::v-deep .btn-prev {
  background: initial !important;
}
::v-deep button:disabled {
  background: initial !important;
}
::v-deep .number {
  background: initial !important;
}

::v-deep .el-pagination.is-background .el-pager li:not(.disabled).active {
  color: #01c2ff;
}

.district-danger-count-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  margin-top: 15px;
}

.count-title-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0px;
  width: 40%;
  box-sizing: border-box;
}

.count-title-container .count-value {
  font-weight: 500;
  font-size: 34px;
  color: #01c2ff;
  white-space: nowrap;
  margin-bottom: 3px;
}

.count-title-container .count-title {
  font-size: 15px;
  font-weight: 300;
  color: #fff;
  white-space: nowrap;
}
</style>