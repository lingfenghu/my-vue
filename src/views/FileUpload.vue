<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="文件信息" icon="el-icon-edit" style="margin-left: 15%"></el-step>
        <el-step title="文件上传" icon="el-icon-upload" style="margin-right: 15%" :status="step2Status"></el-step>
      </el-steps>
      <el-form ref="newsDetail" :model="news" label-width="150px" :rules="rules">
        <div id="news-form" v-show='step1'>
          <el-form-item label="新闻标题" prop="title">
            <el-input v-model="news.title" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="发表时间" prop="publish_date">
            <el-date-picker
              v-model="news.publish_date"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width:80%">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="新闻来源" prop="source">
            <el-autocomplete
              v-model="news.source"
              :fetch-suggestions="querySearch"
              @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="责任编辑" prop="editor">
            <el-input v-model="news.editor" style="width:80%"></el-input>
          </el-form-item>
          <el-form-item label="内容简述">
            <el-input type="textarea" v-model="news.desc" :autosize="{ minRows: 3, maxRows: 5}" resize="none" style="width:80%" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next('newsDetail')" style="margin-left: 30%;margin-bottom: 1%;">下一步</el-button>
          </el-form-item>
        </div>
        <div id="news-upload" v-show='step2'>
          <el-form-item>
            <el-upload
              drag
              ref="upload"
              :action="uploadUrl()"
              :file-list="fileList"
              :multiple="false"
              :auto-upload="false"
              :show-file-list="false"
              :disabled="selected"
              
              :before-upload="beforeUpload"
              :on-change="handleChange"
              :on-success="uploadedSuccess"
              :on-error="uploadError"
              :on-progress="handleProgress"
              accept=".txt">
              <div v-if="selected" class="upload-actions">
                <span @click="handleRemove()">
                  <i class="el-icon-delete hover-delete"></i>
                </span>
              </div>
              <i v-if="!selected" class="el-icon-upload show-icon"><div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div></i>
              <i v-else class="el-icon-document show-icon">
                <div class="el-upload__text" style="margin-top: 10px;">{{this.file.name}}</div>
              </i>
              <el-progress v-if="selected" :percentage="percent" :status="uploadStatus"></el-progress>
              <div class="el-upload__tip upload-tip" slot="tip" >只能上传文本格式的文档.txt文件，且不超过10Mb</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="pre" style="margin-left: 1%">上一步</el-button>
            <el-button type="primary" @click="submitForm" style="margin-left: 30%">提 交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'fileupload',
  data(){
    return{
      step1: true,
      step2: false,
      active: 0,
      step2Status: 'wait',
      medias: [],
      news: {
        title: '',
        publish_date: '',
        source: '',
        editor: '',
        desc: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
        ],
        publish_date: [
          { required: true, message: '请选择发表时间', trigger: 'change' }
        ],
        source: [
          { required: true, message: '请选择来源', trigger: 'change' }
        ],
        editor: [
          { required: true, required: true, message: '请输入责任编辑', trigger: 'change' }
        ]
      },

      file: {},
      fileList: [],
      percent: 0,
      uploadStatus: "",
      selected: false,
    }
  },
  methods:{
    handleChange(file, fileList) {
      console.log(file, fileList)
      this.selected = false
      //如果重复上传，选最后上传的文件
      this.fileList = fileList.slice(-1)
      this.file = file
      this.selected = true
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
      this.step2Status = 'process'
      this.$refs.upload.clearFiles()
      this.percent = 0
      this.uploadStatus = ""
      this.selected = false
      this.step2Status = 'process'
    },
    submitForm(){
      console.log(this.news)
      this.$refs.upload.submit()
    },
    uploadedSuccess(response, file, fileList){
      // this.active++
      this.step2Status = 'success'
      // this.$message.success('文件上传成功')
      this.uploadStatus = 'success'
      console.log(response, file, fileList)
      //文件上传成功之后调用
      this.axios.get('/file_details', {
        params: {
          title: this.news.title,
          publish_date: this.news.publish_date,
          source: this.news.source,
          editor: this.news.editor,
          desc: this.news.desc,
          file_name: response.file_name,
          word_count: response.word_count,
          feature_words: response.feature_words
        }
      }).then((response) => {
        console.log(response)
        this.$message.success('提交成功')
      }).catch((error) =>{
        console.log(error);
        this.$message({
          showClose: true,
          message: '信息错误',
          type: 'error',
        })
      })
    },
    uploadError(err, file, fileList){
      this.$message.error('提交失败')
      console.log(err, file, fileList)
    },
    handleProgress(event, file, fileList){
      console.log(event.percent)
      this.selected = true;
      //实时显示半分比
      this.percent = Math.floor(event.percent)
    },

    querySearch(queryString, cb) {
      var medias = this.medias;
      var results = queryString ? medias.filter(this.createFilter(queryString)) : medias;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    loadAll() {
      return [
        { "value": "新华网"},
        { "value": "新京报"},
        { "value": "澎湃新闻"},
        { "value": "看看新闻"},
        { "value": "央视新闻"},
        { "value": "人民日报"}
      ];
    },
    handleSelect(item) {
      console.log(item);
    },
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.uploadStatus != 'success'){
            this.step2Status = 'process'
          }
          if(this.active < 1){
            this.active++
            this.step1 = false
            this.step2 = true
          }
        } else {
          return false;
        }
      });
      console.log(this.news)
    },
    pre(){
      if(this.uploadStatus != 'success'){
        this.step2Status = 'wait'
      }
      console.log(this.news)
      if(this.active>0){
        this.active--
        this.step1 = true
        this.step2 = false
      }
    },
    uploadUrl(){
      return '/api/file_upload'
    }
  },
  mounted() {
    this.medias = this.loadAll();
  }
}
</script>

<style>
.box-card {
  display: block;
  margin: 20px;
  height: 600px;;
}
#news-form {
  width: 60%;
  margin: 3% 20% 6%;
}
.el-autocomplete{
  width:80%;
}
#news-upload {
  width: 60%;
  margin: 3% 23% 6%;
}
.el-progress{
  margin-top: 15px;
}
.show-icon{
  margin-top: 10px;
  font-size: 95px;
}
.upload-tip{
  text-align: center;
  width: 60%;
  margin: 0px;
  padding: 0px;
}
.upload-buttons{
  margin-top: 10px;
  width: 50%;
}
.el-upload{
  position: relative;
}
.el-upload :hover .upload-actions{
  transition: all 1s;
  opacity: 1;
}
.el-upload :hover .el-progress{
  visibility: hidden;
}
.upload-actions{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  height: 180px;
  opacity: 0;
  background: rgba(0, 0, 0, 0.6);
}
.hover-delete{
  margin-top: 20%;
  font-size: 30px;
}
</style>
