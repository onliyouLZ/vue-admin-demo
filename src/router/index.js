import Vue from 'vue'
import Router from 'vue-router'

/**
 * 页面
 */

import SystemHome from '../page/SystemHome'
import Login from '../page/login'
import oneMap from '../page/oneMap'
import waterMonitoring from '../page/waterMonitoring'
import earlyWarning from  '../page/fourMenu/earlyWarning'
import drought from '../page/fiveMenu/Drought'
import waterWorks from '../page/sixMenu/waterWorks'
import management from '../page/sevenMenu/management'


import business from '../page/business'
import essential from '../page/essential'
import system from '../page/system'
import error404 from '../page/404'

import realTimeRain from '../page/threeMenu/RealTimeRain'
import rainwater from '../page/threeMenu/Rainwater'
import rainwaterReport from '../page/threeMenu/RainwaterReport'

import gates from '../components/waterWorks/gates'
import river from '../components/waterWorks/river'


import store from '../components/management/store'
import godds from '../components/management/goods'


/**
 * 组件
 */
import Home from '../components/home'




Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: Home,
      redirect:'/SystemHome',
      children:[
        {
          path: '/SystemHome',
          component: SystemHome,
          name:"首页"
        },
        {
          path: '/oneMap',
          component: oneMap,
          name:"一张图"
        },
        {
          path: '/waterMonitoring',
          component: waterMonitoring,
          name:"水情监视预警",
          redirect:'/realTimeRain',
          children:[
            {
              path: '/realTimeRain',
              component: realTimeRain,
              name:"水雨情实时监控",
            },
            {
              path: '/rainwater',
              component: rainwater,
              name:"雨水情分析",
            },
            {
              path: '/RainwaterReport',
              component: rainwaterReport,
              name:"雨水情综合报表",
            }
          ]
        },
        {
          path: '/earlyWarning',
          component: earlyWarning,
          name:"水文预警预报"
        },
        {
          path: '/drought',
          component: drought,
          name:"旱情监视"
        },
        {
          path: '/waterWorks',
          component: waterWorks,
          name:"水务工程信息",
          redirect:'/gates',
          children:[
            {
              path: '/gates',
              component: gates,
              name:"涵闸",
            },
            {
              path: '/river',
              component: river,
              name:"河流",
            },
          ]
        },
        {
          path: '/management',
          component: management,
          name:"防汛物资管理",
          redirect:'/store',
          children:[
            {
              path: '/store',
              component: store,
              name:"仓库管理",
            },
            {
              path: '/goods',
              component: godds,
              name:"物资管理",
            },
          ]
        },
        // {
        //   path: '/business',
        //   component: business,
        //   name:"业务管理"
        // },
        // {
        //   path: '/essential',
        //   component: essential,
        //   name:"基础数据管理"
        // },
        // {
        //   path: '/system',
        //   component: system,
        //   name:"系统管理"
        // },
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '*',
      component: error404
    }
  ],
})
