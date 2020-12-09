<template>
<div id="file">
  <h1 style="width:100%;text-align:center;">文件上传</h1>
  <el-row style="border:1px solid #ccc;padding:10px;margin-top:10px;">
    <el-col :span="22" :offset="1">
      <el-form :inline="false" label-width="80px">
        <el-form-item label="所属桥梁:">
          <el-input v-model="bridgeTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件类型:">
          <el-select v-model="fileGroup">
            <el-option v-for="item in fileGroupList"
                       :key="item.key"
                       :value="item.key"
                       :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件:" v-if="show">
          <upload :fileGroup="fileGroup"
                  :bridgeId="$route.query.bridgeId"
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
import * as bridgeApi from '@/module/project-manage/api/bridge'
import { mapGetters, mapState, mapActions } from 'vuex'
const upload = () => import('@/components/Upload-file')
export default {
  inject: ['reload'],
  components:{upload},
  data () {
    return {
      show: false,
      fileGroup: null,
      form: {},
      bridgeTitle: this.$route.query.bridgeTitle
    }
  },
  mounted() {
    this.initBridge()
  },
  computed: {
    // 桥梁的文件类型
    ...mapState('file', { fileGroupList: state => state.fileGroup }),
  },
  methods: {
    ...mapActions('file', { initBridge: 'initBridge' }),
  },
  watch: {
    fileGroup (val) {
      this.show = true
    }
  }
}
</script>

<style>
#file .is-disabled .el-input__inner {
  color:black!important;
}
</style>