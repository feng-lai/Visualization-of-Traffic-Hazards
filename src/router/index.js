import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/pages/Login.vue';
import HomePage from '@/pages/HomePage.vue';
import Project from '@/pages/Project.vue';
import Region from '@/pages/Region.vue';
import test from '@/pages/test.vue'
import amap from '@/pages/amap.vue'


import MapTest from '@/pages/map_test.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Region',
    component: Region
  },
  {
    path: '/Project',
    name: 'Project',
    component: Project
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/Homepage',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/test',
    name: 'test',
    component: test
  },

  {
    path: '/map_test',
    name: 'MapTest',
    component: MapTest
  },
  {
    path: '/amap',
    name: 'amap',
    component: amap
  },

  {
    path: '/map',
    name: 'Map',
    component: () => import('@/pages/map.vue') // 确保异步导入组件
  },
]

const router = new VueRouter({
  routes
})

export default router
