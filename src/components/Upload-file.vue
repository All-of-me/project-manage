<template>
  <div class="upfile"
       style="width:100%;max-width:360px;max-height:100%;overflow: auto;">
    <el-upload class="upload-demo"
               action="#"
               :drag="!disabled"
               :disabled="disabled"
               :http-request="handleSubmit"
               :before-upload="beforeUpload">
      <el-progress :width="100" v-if="flag == true" type="circle" style="margin-top:10px;" :percentage="uploadPercent"></el-progress>
      <i class="el-icon-upload" v-else></i>
      <div class="el-upload__text"
           v-if="!disabled"
           style="width:90%!important;">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
  </div>
</template>

<script>
import * as fileApi from '@/module/project-manage/api/fileApi'
import $ from 'jquery'
export default {
  inject: ['reload'],
  name: 'Uploadfile',
  data () {
    return {
      url: '',
      name: '',
      imgUrl: '',
      flag: false,
      uploadPercent: 0
    };
  },
  props: {
    // 是否可上传删除文件
    disabled: Boolean,
    // 文件类型
    fileGroup: String,
    bridgeId: String,
  },
  watch: {
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    //上传前查重方法
    beforeUpload (file) {
      // var list = this.msg
      // if (list && list.length != 0) {
      //   for (var i = 0; i < list.length; i++) {
      //     if (list[i].name == file.name) {
      //       this.$message({ type: 'error', message: '该文件名[' + file.name + ']已存在，上传失败' })
      //       return Promise.reject()
      //     }
      //   }
      // }
      return Promise.resolve()
    },

    //上传方法
    handleSubmit (file, fileList) {
      var that = this
      // on-progress钩子函数失效
      // 1、声明钩子函数
      file.onProgress = (event, file, fileList) => {
        that.flag = true
        that.uploadPercent = Math.floor(event.percentage)
      }
      // 2、设置axios配置，调用1中钩子函数，实时获取回调函数中的参数e
      const config = {
        onUploadProgress: e => {
          file.file.percentage = e.loaded/e.total*100
          file.onProgress(file.file)
        }
      }
      var that = this
      that.$message('正在上传中，请不要关闭页面!')
      //上传文件名
      var formdata = new FormData()
      formdata.append('file', file.file)
      // 新增文件ajax
      // 3、将config写入axios中
      fileApi.addFile(this.bridgeId, this.fileGroup, formdata,config).then(({data: res}) => {
        if (res.success) {
          that.$message.success(res.message)
          this.$router.go(-1)
        } else {
          that.$message.error(res.message)
        }
        that.flag = false
        that.uploadPercent = 0
      }).catch(res => {
        that.$message.error('超出时间！请确保上传文件不要太大！')
        that.flag = false
        that.uploadPercent = 0
      })
    },
  },
}
</script>

<style lang="less">
#upfile{
  .el-upload .el-upload--text {
    height: 100%;
  }
  .el-upload-list__item .el-progress {
      position: absolute;
      top: 20px;
      width: 100%;
  }
}
</style>