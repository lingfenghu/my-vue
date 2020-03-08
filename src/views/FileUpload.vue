<template>
  <div class="page">
    <el-upload
      drag
      ref="upload"
      action="/api/file_upload"
      :before-upload="beforeUpload"
      :on-change="handleChange"
      :on-success="uploadedSuccess"
      :on-error="uploadError"
      :on-progress="handleProgress"
      :file-list="fileList"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
      :disabled="isSelected"
      accept=".txt">
        <i v-if="!isSelected" class="el-icon-upload show-icon"><div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div></i>
        <i v-else class="el-icon-document show-icon">
          <div class="el-upload__text">{{this.file.name}}</div>
        </i>
        <el-progress v-if="isSelected" :percentage="percent" :status="uploadStatus"></el-progress>
      <div class="el-upload__tip" slot="tip">只能上传文本格式的文档.txt文件，且不超过10Mb</div>
    </el-upload>
    <div class="buttons">
      <el-col :span="12">
        <el-button size="small" type="warning" @click="handleRemove()" :disabled="!isSelected">删除该文件</el-button>
      </el-col>
      <el-col :span="12">
        <el-button size="small" type="primary" @click="submitUpload()" :disabled="!isSelected">上传到服务器</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
export default {
  name: 'fileupload',
  data(){
    return{
      file: {},
      fileList: [],
      percent: 0,
      uploadStatus: "",
      isSelected: false,
    }
  },
  methods:{
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.isSelected = false
      //如果重复上传，选最后上传的文件
      this.fileList = fileList.slice(-1)
      this.file = file
      this.isSelected = true
    },
    beforeUpload(file){
      console.log(file)
      //上传到服务器前验证文件格式和大小
      const isTXT = file.type === 'text/plain'
      const isLt10M = file.size/1024/1024 < 10
      // console.log(isTXT,isLt10M)
      if (!isTXT) {
        this.$message.error('上传文件只能是TXT格式!');
      }
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      return isTXT && isLt10M
    },
    handleRemove(){
      this.$refs.upload.clearFiles()
      this.isSelected = false
      this.percent = 0
      this.uploadStatus = ""
    },
    //手动文件上传
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadedSuccess(response, file, fileList){
      this.$message.success('文件上传成功')
      this.uploadStatus = 'success'
      console.log(response, file, fileList)
    },
    uploadError(err, file, fileList){
      this.$message.error('文件上传失败')
      console.log(err, file, fileList)
    },
    handleProgress(event, file, fileList){
      console.log(event.percent)
      this.isSelected = true;
      // this.percent = file.percentage.toFixed(0);
      //实时显示半分比
      this.percent = Math.floor(event.percent)
    }
  }
}
</script>

<style>
.el-upload{
  margin-top: 5%;
}
.el-progress{
  margin-top: 18px;
}
.show-icon{
  margin-top: 10px;
  font-size: 100px;
}
.el-upload__text{
  margin-top: 15px;
}
.el-button{
  size: small;
}
.buttons{
  margin-top: 10px; 
  margin-left: 33.5%;
  width: 33%;
}
</style>
