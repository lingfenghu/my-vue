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
      <div class="item1">
        <el-button type="success" plain icon="el-icon-download" @click="dialogVisible = true">导出Excel</el-button>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
          center>
          <span style="text-align:center;display:block;">是否确定导出本页日志到Excel文档 ?</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="exportExcel()">确 定</el-button>
          </span>
        </el-dialog>
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
        :filters="[{ text: '404', value: '404' }, { text: '504', value: '504' }, { text: '304', value: '304' }, { text: '200', value: '200' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
      <template slot-scope="scope">
        <el-tag
          :type="changeColor(scope.row.status)"
          disable-transitions>{{scope.row.status}}</el-tag>
      </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align:center;"
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
      dateValue:'',
      currentRow: null,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      dialogVisible: false
    }
  },
  methods:{
    selectDate(){
      this.currentPage = 1
      this.initTable()
    },
    initTable(){
      this.tableData = []
      this.total = 0
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
    changeColor(val){
      console.log(val)
      if(val === '200'){
        return 'success'
      }
      else if(val === '304'){
        return 'primary'
      }
      else if(val === '504'){
        return 'danger'
      }
      else if(val === '404'){
        return 'warning'
      }
      else{
        return 'info'
      }
    },
    exportExcel(){
      console.log("确认操作")
      this.dialogVisible = false
      this.axios.get('/nginx_logs_excel', {
        params: {
          date: this.dateValue,
          page_num: this.currentPage, 
          page_size: this.pageSize
        }      
      }).then((response) => {
        console.log(response)
        window.open(response.request.responseURL)
      }).catch((error) =>{
        console.log(error);
        this.$message({
          showClose: true,
          message: '下载文件出错',
          type: 'error',
        })
      })
    },
    handleClose() {
      this.dialogVisible = false
      console.log("取消操作")
    }
  },
  mounted: function () {
    //默认选中今天，打印改天日志
    console.log(new Date().toLocaleDateString())
    var now = new Date()
    this.dateValue = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()
    console.log(this.dateValue)
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
