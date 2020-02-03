<template>
  <div>
    <el-container>
        <el-aside width="200px">
          <el-menu @open="handleOpen" @close="handleClose">
          <el-menu-item height="50px">
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
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/' }">当前页</el-breadcrumb-item>
              </el-breadcrumb>
            </el-header>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'index',
  data(){
      return{
          
      }
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