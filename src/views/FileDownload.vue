<template>
  <div id="layout">
    <el-container style="border: 1px solid #eee">
      <el-aside width="300px" class="page-aside">
        <div class="slogan">
          <span>文档范围信息</span>
        </div>
        <el-divider></el-divider>
        <div class="arguments">
          <el-form ref="form" :model="form">
            <el-form-item>
              <p style="text-align:left;">日期:</p>
              <el-date-picker
                :clearable="false"
                style="width:95%;"
                v-model="form.dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="截至"
                @change="rangeSearch()">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <p style="text-align:left;">字数:</p>
              <el-slider
                v-model="form.wordValue"
                range
                show-stops
                :min='0'
                :max= parseInt(maxWords)
                @change="rangeSearch()">
              </el-slider>
              <div class="slider">
                <el-input size="mini" value="0" readonly></el-input>
                <el-input size="mini" min='1000' v-model="maxWords" type="number" step="1000" style="float:right;"></el-input>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-aside>
      <el-container>
        <el-header class="page-header">
          <el-input class="global-search" placeholder="请输入新闻标题、标签、来源或简介内容" v-model="searchContent" @keyup.enter.native="globalSearch">
            <el-button slot="append" icon="el-icon-search" @click="contentSearch">搜索</el-button>
          </el-input>
        </el-header>
        <el-main class="page-main" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.2)">
          <div class="file-detail" :hidden="visible" @click="closeDetails">
            <el-button type="text" class="close-details"><i class="el-icon-close" style="font-size:30px;" @click="closeDetails"></i></el-button>
            <div class="box-intro">
              <p class="title">Title: {{title}}</p>
              <p class="intro">Tags: <span v-for="featureWord in featureWords" class="tag">{{featureWord}}</span></p>
              <p class="intro">Source: {{source}}</p>
              <p class="intro">Desc: {{desc}} ...</p>
              <p class="intro">PublishDate: {{publishdate}}</p>
              <p class="intro">Editor: {{editor}}</p>
              <p class="intro">WordCount: {{wordCount}} 字</p>
            </div>

            <!-- <p style="margin-bottom:1%;">标题：{{item.title}}</p>
            <el-divider></el-divider>
            <p style="margin-bottom:1%;">来源：{{item.source}}</p>
            <el-divider></el-divider>
            <p style="margin-bottom:1%;">简介：{{item.desc}}</p>
            <el-divider></el-divider>
            <p>发表日期：{{item.publish_date}}</p> -->
          </div>
          <el-row>
            <el-col :span="4" v-for="(item, index) in fileList" :offset="index%5 > 0 ? 1 : 0">      
              <el-card shadow="hover">
                <el-button class="file-card" type="text" @click="viewDetails(item)">
                  <i class="el-icon-document document-icon" style="font-size:120px;"></i>
                </el-button>
                <div class="bottom">
                  <el-tooltip class="item" effect="light" :content='item.file_name' placement="left">
                    <el-button type="text" @click="download(item.file_name)">{{item.file_name}}&nbsp;<i class="el-icon-download"></i></el-button>
                  </el-tooltip>
                </div>
                  
                  <!-- <div class="tip">
                    <p style="margin-bottom:1%;">标题：{{item.title}}</p>
                    <el-divider></el-divider>
                    <p style="margin-bottom:1%;">来源：{{item.source}}</p>
                    <el-divider></el-divider>
                    <p style="margin-bottom:1%;">简介：{{item.desc}}</p>
                    <el-divider></el-divider>
                    <p>发表日期：{{item.publish_date}}</p>
                  </div> -->
              </el-card>
            </el-col>
          </el-row>
          <el-pagination
            style="margin-bottom: 10px;text-align:center;"
            v-if="total!=0" 
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
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
      maxWords: 5000,
      searchContent: '',
      currentPage: 1,
      fileList: [],
      options: [{
          value: 'news',
          label: '新闻'
      }],
      form: {
        type: 'news',
        dateRange: ['2020-01-01','2020-12-30'],
        wordValue: [1, 5000]
      },
      loading: true,
      visible: true,
      isGlobalSearch: false,

      title: '',
      featureWords: [],
      source: '',
      desc: '',
      publishdate: '',
      editor: '',
      wordCount: ''
    }
  },
  methods: {
    globalSearch(){
      this.isGlobalSearch = true
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
      this.isGlobalSearch = false
      console.log(this.form)
      this.loading = true
      this.axios.get('/query/document', {
        params: {
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
      if(this.isGlobalSearch){
        this.globalSearch()
      }else{
        this.detailQuery()
      }
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
          message: '下载出错',
          type: 'error',
        })
      })
    },
    viewDetails(val){
      this.visible = false
      console.log(val)
      this.title = val.title
      this.source = val.source
      // console.log(val.feature_words.split(" "));
      this.featureWords = val.feature_words.split(" ")
      this.desc = val.desc
      this.publishdate = val.publish_date
      this.editor = val.editor
      this.wordCount = val.word_count

    },
    closeDetails(){
      this.visible = true
      console.log("close")
    },
    rangeSearch(){
      this.currentPage = 1
      this.detailQuery()
    },
    contentSearch(){
      this.currentPage = 1
      this.globalSearch()
    }
  },
  mounted: function () {
    this.$nextTick(function () {
        this.detailQuery()
    })
  }
}
</script>

<style scoped>
.page-aside{
  background-color: white;
  overflow: hidden;
}
.page-header{
  text-align: center;
  background-color: white
}
.page-main{
  position: relative;
  height: 600px;
}
.global-search{
  margin-top: 10px;
  width: 60%;
}
.el-row{
  height: 500px;
  padding: 2%;
}
.el-row .el-col .el-card{
  /* 层叠样式关键,父级relative */
  position: relative;
  margin: 5% 1%;
  height: 210px;
  padding: 0px;

}
.document-icon{
  width: 100%;
  display: block;
}
.bottom{
  position: absolute;
  display: inline;
  left: 5px;
  top: 175px;
}
.el-col .el-card :hover .tip{
  /* 动画效果 */
  /* transform: scale(1.15);
  transform: translateY(-15px); */
  /* 遮罩层 */
  transition: all 1s;
  opacity: 1;
}
.tip p{
  text-align: left;
  /* 设置文字超出两行省略表示 */
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
.slogan{
  text-align: center;
  line-height: 60px;
  /* background-color: rgb(222, 227, 231); */
  background-color: white
}
.arguments{
  line-height: 100px;
  margin: 10px;
  width: 90%;
}
.el-divider{
  margin: 0px;
}
.file-card{
  margin: 0px;
  padding: 0px;
  border: none;
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
   /*后面这个0.6是指的背景的透明度*/
  background: rgba(0, 0, 0, 0.6);  
}
.file-detail{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 600px;
  z-index: 99;
  background: rgba(130, 197, 236, 0.7);
  /* 动画效果 */
  animation: my-switch 1s;
}
@keyframes my-switch
{
  from {background:none}
  to {background:rgba(130, 197, 236, 0.7);}
}
.close-details{
  color: rgb(8, 133, 235);
  padding: 1%;
}
.box-intro{
  margin-left: 10%;
  margin-right: 5%;
}
.box-intro .title{
  font-size: 20px;
}
.box-intro .intro{  
  margin-top: 1%;
}
.tag{
  /* p站预览图标签样式 */
  display: inline-block;
  margin: 2px 5px;
  padding: 6px 6px;
  color: #FFF;
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 10px;
}
.slider{
  display: inline;
  margin: 0px;
  padding: 0px;
}
.slider .el-input{
  text-align: center;
  margin: 0px;
  padding: 0px;
  width: 70px;
}
</style>