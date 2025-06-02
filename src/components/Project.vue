<template>
  <div class="left-side right-side1">
    <div class="title">选择项目</div>
    <div class="search">
      <i class="el-icon-search"></i>
      <input type="text" placeholder="搜索项目名称" v-model="searchKeyword" />
      <div class="btn" @click="onSearch">搜索</div>
    </div>
    <div class="project">
      <div class="entry" v-for="project in projectList" :key="project.id">
        <div class="row" @click="selectProject(project.id)">
          <div>{{ project.projectName }}</div>
          <div :class="selectedProjectId == project.id?'choses':'chose'"></div>
        </div>
      </div>
      <div class="page">
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
      
    </div>
    <div class="btn_group">
      <div @click="cancelSelection">取消</div>
      <div @click="confirmSelection">确定</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['rage_time','projectStatData'],
  name: "Project",
  data() {
    return {
      checked: false,
      checkedArray: [],
      projectList: [],
      searchKeyword: "",
      currentPage: 1,
      pageSize: 7,
      totalProjects: 0,
      selectedProjectId: null,
      showDateRangePicker: true,
      isProjectSelected: false,
    };
  },
  methods: {
    //获取项目列表
    fetchProjectList() {
      this.$http
        .post("/admin/index/getProjectPage", {
          projectName: this.searchKeyword,
          page: this.currentPage,
          pageSize: this.pageSize,
          //startTime:this.rage_time?this.rage_time[0]:'',
          //endTime:this.rage_time?this.rage_time[1]:'',
        })
        .then((response) => {
          if (response.data && response.data.code === 0) {
            this.projectList = response.data.data.dataList;
            this.totalProjects = response.data.data.totalRows;
          } else {
            console.error("获取项目列表失败:", response.data.message);
          }
        })
        .catch((error) => {
          console.error("请求项目列表时发生错误:", error);
        });
    },

    //点击搜索
    onSearch() {
      this.currentPage = 1;
      this.fetchProjectList();
    },

    //确定按钮
    confirmSelection() {
      if (!this.selectedProjectId) {
        this.$message({
          message: "请选择项目",
          type: "error",
        });
        return;
      }
      const project = this.projectList.find(
        (p) => p.id === this.selectedProjectId
      )
      if (project) {
        this.isProjectSelected = true;
        this.$emit('setCurrentDistrictName',project.projectName)
        this.$emit('setProchart',1)
        this.$emit('setProjectId',this.selectedProjectId)
        this.$emit('setShowProject',0)
      } else {
        alert("选择的项目不存在");
      }
    },

    //勾选项目
    selectProject(projectId) {
      this.selectedProjectId = projectId;
    },

    //取消按钮
    cancelSelection() {
      this.selectedProjectId = ''
      this.$emit('setShowProject',0)
      this.$emit('getCityStatData')
      this.$emit('setCurrentDistrictName','深圳市')
      this.$emit('setLevel',1)
      this.$emit('setProchart',0)
    },
    
    //分页点击
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchProjectList();
    },
  },
  mounted() {
    
  },
};
</script>

<style scoped lang="scss">
.left-side {
  z-index: 2;
  position: fixed;
  right: 20px;
  bottom: 18px;
  width: 430px;
  background: url("../assets/left_bg.png") no-repeat;
  background-size: cover;
  z-index: 1;
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
.right-side1 {
  height: 735px;
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
    height: 452px;
    background: #0f2b3f;
    border-radius: 4px 4px 4px 4px;
    margin: 0 auto;
    margin-top: 23px;
    position: relative;
    .page{
      position: absolute;
      bottom: 21px;
      display: flex;
      justify-content: center;
      width: 100%;
    }
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
        cursor: pointer;
        .chose{
          width: 28px;
          height: 28px;
          background: url('../assets/chose.png') no-repeat center center;
          background-size: cover;
        }
        .choses{
          width: 28px;
          height: 28px;
          background: url('../assets/choses.png') no-repeat center center;
          background-size: cover;
        }
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
      cursor: pointer;
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