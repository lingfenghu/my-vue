<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-button :loading="loading" type="primary" @click="getNewsUrl()">获取热点新闻</el-button>
      <el-input class="news-url" v-model="url" disabled></el-input>
      <div>
        <el-table 
        class='url-table'
        :data="tableData"
        stripe
        border
        lazy
        height="500">
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
          this.loading = false
        }).catch(error => {
          this.loading = false
          this.$message.error('解析出错')
        })
        this.loading = false
      }).catch(error =>{
        this.loading = false
        this.$message.error('操作失败')
      })
      
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      
    })
  }
}
</script>

<style scoped>
.box-card {
  display: block;
  margin: 20px;
  height: 600px;
}
.news-url{
  width: 35%;
  margin-left: 10px;
}
.url-table{
  margin: 10px 0px 10px;
  text-align: center;
}
</style>
