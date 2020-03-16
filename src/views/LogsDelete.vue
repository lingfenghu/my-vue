<template>
  <div>
    <iframe v-show="true" id="myframe" src="http://localhost:9100/" width="100%" height="660" frameborder="0" ><span>您的浏览器不支持iframe标签。</span></iframe>
  </div>
</template>

<script>
export default {
  name: 'logsdelete',
  data(){
    return{
    }
  },
  methods: {
    iframeHeight(){
      console.log("ok")
      var ifm= document.getElementById("myframe");
      var subWeb = document.frames ? document.frames["myframe"].document :
      ifm.contentDocument;
      if(ifm != null && subWeb != null) {
        ifm.height = subWeb.body.scrollHeight;
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {

    })
  }
}

</script>
<style>
.div{
  width: 100%;
  height: 600;
}
</style>
