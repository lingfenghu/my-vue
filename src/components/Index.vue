<template>
  <div>
    <el-container>
        <el-aside width="200px">
          <el-menu :default-active="activeIndex" @select="handleSelect">
            <el-menu-item index="0">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-document"></i>
                <span>文档操作</span>
              </template>
                <el-menu-item index="1-1"><i class="el-icon-upload2"></i>文档上传</el-menu-item>
                <el-menu-item index="1-2"><i class="el-icon-download"></i>文档获取</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-container>
            <el-header>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in crumbs" :to="item.name">{{item.text}}</el-breadcrumb-item>
                <!-- <el-breadcrumb-item :to="{ path: 'fileupload' }">{{currentPage}}</el-breadcrumb-item> -->
              </el-breadcrumb>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
      return{
        //选中菜单项
        activeIndex:'',
        crumbs:[],
        //当前菜单项
        currentItem: {},
        menuItems:[
          {
            name: 'index',//要跳转的路由名称
            text: '首页',
            index: '0'
          },
          {
            text: '文档操作',
            index: '1',
            children:[
              {
                name: 'fileupload',
                text: '文档上传',
                index: '1-1'
              },
              {
                name: 'filedownload',
                text: '文档下载',
                index: '1-2'
              }
            ]
          }
        ],
      }
  },
  methods:{
    init(){
      console.log(this.$route.name)
      this.getMenuItemByName(this.$route.name)
      this.activeIndex = this.currentItem.index
    },
    //index: 选中菜单项的 index, indexPath: 选中菜单项的 index path
    handleSelect(index,indexPath) {
      this.crumbs = []
      // console.log(index,indexPath)
      //根据菜单项路径生成面包屑路径
      for(var path of indexPath){
        this.getMenuItemByIndex(path)
        // console.log(this.currentItem)
        //依次将菜单项装入面包屑数组
        this.crumbs.push(this.currentItem)
      }
      //操作router-view替换页面
      this.$router.replace(this.crumbs[this.crumbs.length-1].name)
      this.activeIndex = index
    },
    //根据菜单的index找到对应的菜单信息
    getMenuItemByIndex(index){
      let that = this
      this.menuItems.forEach(item=>{
        // console.log(item)
        if(index===item.index){
          that.currentItem = item
        }
        if(item.children){
          item.children.forEach(element=>{
            // console.log(element)
            if(index===element.index){
              that.currentItem = element
            }
          })
        }
      })
    },
    getMenuItemByName(name){
      let that = this
      this.menuItems.forEach(item=>{
        // console.log(item)
        if(name===item.name){
          that.currentItem = item
        }
        if(item.children){
          item.children.forEach(element=>{
            // console.log(element)
            if(name===element.name){
              that.currentItem = element
            }
          })
        }
      })
    }
  },
  //页面加载完成后调用
  mounted: function () {
    this.init()
  },
  watch: {
    //监听下一个跳转的路径名称
    $route(to) {
      console.log(to.name)
      if(to.name === this.currentItem.name){
        return this.$route.name === name
      }
    },
  }
}
</script>

<style>
.el-header{
    background-color: white;
    color: black;
    line-height: 50px;
  }
  .el-aside {
    background-color: #E9EEF3;
    color: rgb(117, 114, 114);
    text-align: center;
    line-height:700px;
  }
  .el-main {
    background-color: rgb(190, 194, 199);
    color: #333;
    text-align: center;
    line-height: 650px;
  }
  .el-breadcrumb{
    margin-top: 20px;
  }
</style>