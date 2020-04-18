import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',//去除路径/#！/
  base: '/dist/',
  routes: [
    {
      path: '/', redirect: '/home'
    },
    { 
      path: '*', 
      component: () => import('../components/NotFound.vue'),
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/Index.vue'),
      children:[
        {
          path: '/home',
          name: 'home',
          component: () => import('../views/Home.vue'),
        }
      ]
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/Index.vue'),
      children:[
        {
          path: '/fileupload',
          name: 'fileupload',
          component: () => import('../views/FileUpload.vue')
        },
        {
          path: '/filedownload',
          name: 'filedownload',
          component: () => import('../views/FileDownload.vue')
        },
        {
          path: '/fetchnews',
          name: 'fetchnews',
          component: () => import('../views/FetchNews.vue')
        }
      ]
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../components/Index.vue'),
      children:[
        {
          path: '/logsanalyze',
          name: 'logsanalyze',
          component: () => import('../views/LogsAnalyze.vue'),
        },
        {
          path: '/indexmanage',
          name: 'indexmanage',
          component: () => import('../views/IndexManage.vue'),
        }
      ]
    }
  ]
})
