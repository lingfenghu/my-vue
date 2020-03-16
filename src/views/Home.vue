<template>
  <div>
    <h3>Welcome to my ElasticSearch File-Manage-System</h3>
  </div>
</template>

<script>
export default {
  name: 'home',
 data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
}
</script>

<style>
h3{
  margin-top: 10%;
  text-align: center;
}
</style>
