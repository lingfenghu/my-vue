import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',//去除路径/#！/
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../components/Index.vue')
    },
    {
      path: '/file',
      name: 'file',
      component: () => import('../views/File.vue')
    },
  ]
})
