<template>
  <div id="layout">
    <el-container style="border: 1px solid #eee">
      <el-aside width="300px" class="page-aside">
        <div class="slogan">
          <span>详细信息</span>
        </div>
        <el-divider></el-divider>
        <div class="arguments">
          <el-form ref="form" :model="form">
            <el-form-item>
              <p style="text-align:left;">类型:</p>
              <el-select v-model="form.type" 
                placeholder="请选择"
                style="width:450px"
                disabled>
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <p style="text-align:left;">日期:</p>
              <el-date-picker
                style="width:95%;"
                v-model="form.dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="截至"
                @change="detailQuery()">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <p style="text-align:left;">字数:</p>
              <el-slider
                v-model="form.wordValue"
                range
                show-stops
                :min="1"
                :max="5000"
                @change="detailQuery()">
              </el-slider>
            </el-form-item>
          </el-form>
        </div>
      </el-aside>
      <el-container>
        <el-header class="page-header">
          <el-input placeholder="请输入新闻标题、作者或内容" v-model="searchContent" @keyup.enter.native="globalSearch">
            <el-button slot="append" icon="el-icon-search" @click="globalSearch">搜索</el-button>
          </el-input>
        </el-header>
        <el-main class="page-main" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
          <el-row>
            <el-col :span="4" v-for="(item, index) in fileList" :offset="index%5 > 0 ? 1 : 0">
              <el-card>
                  <i class="el-icon-document document-icon" style="font-size:120px;"></i>
                  <div class="bottom">
                    <el-button type="text" @click="download(item.file_name)">{{item.file_name}} &nbsp; <i class="el-icon-download"></i></el-button>
                  </div>
                  <div class="tip">
                    <p>标题：{{item.title}}</p>
                    <el-divider></el-divider>
                    <p>作者：{{item.author}}</p>
                    <el-divider></el-divider>
                    <p>发表日期：{{item.publish_date}}</p>
                  </div>
              </el-card>
            </el-col>
          </el-row>
          <el-pagination
            style="margin-bottom: 30px;"
            v-if="total!=0" 
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
          <div class="foot"></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'filedownload',
  data(){
    return {
      total: 0,
      searchContent: '',
      currentPage: 1,
      fileList: [],
      options: [{
          value: 'news',
          label: '新闻'
      }],
      form: {
        type: 'news',
        dateRange: ['2000-01-01','2020-12-30'],
        wordValue: [1, 5000]
      },
      loading: true
    }
  },
  methods: {
    globalSearch(){
      this.loading = true
      console.log(this.fileList,this.dateRange)
      this.axios.get('/query/global/document', {
        params: {
          query_content: this.searchContent,
          page_num: this.currentPage
        }
        
      }).then((response) => {
        console.log(response)
        this.fileList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    detailQuery(){
      console.log(this.form)
      this.loading = true
      this.axios.get('/query/document', {
        params: {
          type: this.form.type,
          page_num: this.currentPage,
          gt_publish_date: this.form.dateRange[0],
          lt_publish_date: this.form.dateRange[1],
          gt_word_count: this.form.wordValue[0],
          lt_word_count: this.form.wordValue[1],
        }
      }).then((response) => {
        console.log(response)
        this.fileList = response.data.list
        this.total = response.data.total
        this.loading = false
      })
    },
    handleCurrentChange(val){
      console.log(val)
      this.detailQuery()
    },
    download(fileName){
      console.log(fileName)
      this.axios.get('/file_download', {
        params: {
          file_name: fileName
        }      
      }).then((response) => {
        console.log(response)
        //根据返回的链接下载文件
        window.open(response.request.responseURL)
      }).catch((error) =>{
        console.log(error);
        this.$message({
          showClose: true,
          message: '下载文件出错',
          type: 'error',
        });
      })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
        this.detailQuery()
    })
  }
}
</script>

<style>
.page-aside{
  background-color: white;
  overflow: hidden;
}
.page-header{
  background-color: white
}
.page-main{
  height: 600px;;
}
.el-input{
  width: 60%
}
.el-row{
  height: 500px;;
  padding: 2%;
}
.el-row .el-col .el-card{
  /* 层叠样式关键,父级relative */
  position: relative;
  margin: 5% 3%;
  height: 210px;
  padding: 0px;

}
.document-icon{
  width: 100%;
  display: block;
}
.bottom{
  position: absolute;
  width: 100%;
  display: inline;
  left: 5px;
  top: 175px;;

}
.el-col .el-card :hover .tip{
  /* 动画效果 */
  /* transform: scale(1.15);
  transform: translateY(-5px); */
  transition: all 1s;
  opacity: 1;
}
.tip p{
  text-align: left;
}
.slogan{
  line-height: 60px;
  /* background-color: rgb(222, 227, 231); */
  background-color: white
}
.arguments{
  line-height: 80px;
  margin: 10px;
  width: 90%;
}
.el-divider{
  margin: 0px;
}
.el-pagination{
  /* position: absolute; */
  /* bottom: 30px; */
  /* left: 35%; */
  
}
.tip{
  /* 层叠样式关键,子级absolute */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  height: 180px;
  opacity: 0;
  background: rgba(0, 0, 0, 0.6);   /*后面这个0.6是指的背景的透明度*/
}
.foot{
  height: 10px;
}
</style>