<template>
  <div class="navbar">
    <div class="nav-title" @click="to('/')">
      <img src="../assets/logo.png" />
      道路交通隐患管理系统
    </div>
    <div class="center">
      <div class="row" @click="to('/')">
        <img src="../assets/sy.png" />
        <div>首页</div>
      </div>
      <div class="row">
        <img src="../assets/tzgl.png" />
        <div>台账管理</div>
      </div>
      <div class="row">
        <img src="../assets/tjfx.png" />
        <div>统计分析</div>
      </div>
      <div class="row">
        <img src="../assets/xtgl.png" />
        <div>系统管理</div>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-project">
        <button @click="showPro()">项目</button>
      </div>
      <div class="nav-search">
        <input type="text" placeholder="请输入要查找的街道" v-model="keyword" />
        <img src="../assets/search.png" @click="getSubDistrictList()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      keyword: "",
      street_data: [],
    };
  },
  methods: {
    showPro(){
      this.$emit('setShowProject',1)
    },
    fuzzySearch(items, searchTerm) {
      for(let i in items){
        if(items[i].subDistrictName.includes(searchTerm)){
          return items[i];
        }
      }
    },

    to(link) {
      if (this.$router.currentRoute.path !== "/") {
        this.$router.push({ path: link });
      } else {
        this.$emit("setLevel", 1);
        this.$emit('setShowProject',0)
        this.$emit('setProchart',0)
      }
    },

    //查询街道列表
    async getSubDistrictList() {
      if(!this.keyword){
        this.$message({
            message: "请输入关键字",
            type: "error",
          });
          return
      }
      const requestData = {};
      try {
        const response = await this.$http.post(
          "/admin/index/getSubDistrictList",
          requestData
        );
        let res = this.fuzzySearch(response.data.data,this.keyword)
        this.$emit('setDistrict',res.districtId,res.districtName)
        this.$emit('subDistrict',res.id,res.subDistrictName)
        this.$emit('setLevel',3)
      } catch (error) {
        console.error("请求失败:", error);
      }
      return [];
    },
  },
  mounted() {},
};
</script>



<style scoped lang="scss">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #003472;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  z-index: 3;
}

.nav-title {
  font-weight: 700;
  font-size: 40px;
  color: #ffffff;
  display: flex;
  align-items: center;
  img {
    width: 71px;
    height: 70px;
    margin: 0 24px;
  }
}

.center {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 400;
  font-size: 16px;
  color: #ffffff;
  .row {
    margin-right: 29px;
    cursor: pointer;
  }
  .row:last-child {
    margin-right: 0;
  }
  img {
    width: 50px;
    height: 50px;
  }
}

.nav-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 109px;
}

.nav-search {
  position: relative;
  width: 260px;
  height: 40px;
  margin-left: 22px;
  img {
    position: absolute;
    right: 14px;
    top: 50%;
    margin-top: -10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.nav-search input {
  width: 246px;
  height: 40px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  border: 1px solid #0e9cff;

  padding-left: 14px;
  font-weight: 400;
  font-size: 14px;
}

.nav-search input::placeholder {
  color: #1f4f84;
}

.nav-project button {
  width: 69px;
  height: 40px;
  background: #01c2ff;
  border-radius: 4px 4px 4px 4px;
}
</style>