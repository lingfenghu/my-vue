<template>
  <div>
    <div class="log-time">
      <div class="item1">
        <el-date-picker
          v-model="dateValue"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="selectDate">
        </el-date-picker>
      </div>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      highlight-current-row
      @current-change="handleCurrentRowChange"
      header-cell-style="text-align:center"
      height="520">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="request"
        label="Request">
      </el-table-column>
      <el-table-column
        prop="remote_addr"
        label="RemoteAddr">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="time_local"
        label="TimeLocal">
      </el-table-column>
      <el-table-column
        prop="bytes_sent"
        label="BytesSent">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="http_user_agent"
        label="HttpUserAgent">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="remote_user"
        label="RemoteUser">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="path"
        label="Path">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="http_referer"
        label="HttpReferer">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="host"
        label="Host">
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        :filters="[{ text: '404', value: '404' }, { text: '504', value: '504' }, { text: '200', value: '200' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
          :type="scope.row.status === '200' ? 'success' : 'warning'"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total!=0"
      background
      :current-page.sync="currentPage"
      :page-sizes="[10, 50, 100, 500]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'logsanalyze',
  data(){
    return{
      total: 0,
      dateValue:'2020-03-06',
      currentRow: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10
    }
  },
  methods:{
    selectDate(){
      this.initTable()
    },
    initTable(){
      console.log(this.dateValue,this.currentPage,this.pageSize)
      this.axios.get('/query/nginx_log', {
        params: {
          date: this.dateValue,
          page_num: this.currentPage, 
          page_size: this.pageSize
        }      
      }).then((response) => {
        console.log(response)
        this.tableData = response.data.list
        this.total = response.data.total
      })
    },
    handleCurrentRowChange(val){
      this.currentRow = val;
      console.log(val)
      this.$alert('<div><dl><dt>'+val.request+'</dt><dt>'+val.remote_addr+'</dt><dt>'+val.time_local+'</dt><dt>'+val.bytes_sent+'</dt><dt>'+val.http_user_agent+'</dt><dt>'+val.remote_user+'</dt><dt>'+val.path+'</dt><dt>'+val.http_referer+'</dt><dt>'+val.host+'</dt><dt>'+val.status+'</dt></dl></div>', {
        dangerouslyUseHTMLString: true
      });
    },
    //分页事件
    handleSizeChange(val){
      console.log(val)
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange(val){
      console.log(val)
      this.currentPage = val
      this.initTable()
    },
    filterTag(value, row) {
      console.log(value, row)
      return row.status === value;
    },
  },
  mounted: function () {
    this.$nextTick(function () {
        this.initTable()
    })
  }
}
</script>

<style>
.log-time{
  padding: 1%;
  margin: 1% 1% 0%;
  background-color: white;
  height: 40px;
}
.item1{
  float: left;
  width: 20%;
}
.search-button{
  float: left;
  margin-left: 20px;;
  display:inline-block;
}
.el-table{
  /* padding: 1%; */
  margin: 1% 1%;
  background-color: white;
  width: 98%;
}
</style>
