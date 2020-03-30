<template>
  <div>
    <el-card class="box-card">
      <el-button :loading="loading" type="primary" @click="getNewsUrl()">获取热点新闻</el-button>
      <el-input class="news-url" v-model="url" disabled></el-input>
      <div>
        <el-table 
        class='url-table'
        :data="tableData"
        stripe
        border
        lazy
        height="520">
          <el-table-column
            label="序号"
            type="index"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="url"
            label="链接"
            align="center">
            <template slot-scope="scope">
              <a :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="title"
            label="标题">
          </el-table-column> -->
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'fetchnews',
  data() {
    return {
      loading: false,
      url: 'https://news.163.com/',
      tableData: []
    }
  },
  methods: {
    getNewsUrl(){
      this.tableData = []
      this.loading = true
      this.axios.get('/get_top_news_url')
      .then((response) => {
        console.log(response)
        response.data.forEach(item => {
          var tmp = {};
          tmp.url = item;
          this.tableData.push(tmp);
        });
        this.loading = false
        console.log(this.tableData)
        //解析新闻到es
        this.axios.get('/fetch_news')
        .then((response) => {
          console.log(response)
          var sum = response.data.length
          var succeeded = 0
          response.data.forEach(item =>{
            if(item.statusCodeValue === 200){
              succeeded++
            }
          })
          var failed = sum - succeeded
          this.$notify.info({
            title: '提示',
            message: '共抓取 '+sum+' 条热点新闻, '+succeeded+' 条成功, '+failed+' 条失败.',
            duration: 0,
            // offset: 50
          });
        }).catch(error => {
          this.$message.error('连接elasticsearch出错')
        })
      })
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      
    })
  }
}
</script>

<style>
.box-card {
  display: block;
  margin: 20px;
  height: 600px;
  padding: 15px;
}
.news-url{
  width: 35%;
  margin-left: 10px;
}
.url-table{
  margin-top: 15px;
  text-align: center;
}
</style>
