<template>
<div id="file">
  <h1 style="width:100%;text-align:center;">文件上传</h1>
  <el-row style="border:1px solid #ccc;padding:10px;margin-top:10px;">
    <el-col :span="22" :offset="1">
      <el-form :inline="false" label-width="80px">
        <el-form-item label="所属标段:">
          <el-input v-model="sectionTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="上传文件:">
          <upload :fileGroup="fileGroup"
                  :bridgeId="$route.query.sectionId"
                  :disabled="false"></upload>
        </el-form-item>
        <el-form-item>
          <el-button type="info"
                   @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
const upload = () => import('@/components/Upload-file')
export default {
  inject: ['reload'],
  components:{upload},
  data () {
    return {
      fileGroup: '20',
      form: {},
      sectionTitle: this.$route.query.sectionTitle
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  }
}
</script>

<style>
#file .is-disabled .el-input__inner {
  color:black!important;
}
</style>