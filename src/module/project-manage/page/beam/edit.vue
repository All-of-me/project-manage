<template>
<div class="edit">
  <h1 style="width:100%;text-align:center;">{{list.serialNumber.value?list.serialNumber.value:'请填写编号'}}</h1>
  <el-row>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm :list="list"
                   :inline="false" :rules="rules" ref="formTemplate" :size="'medium'">
        <el-button type="primary"
                   v-if="isadd"
                   @click="submitForm">提交</el-button>
        <el-button type="primary"
                   v-if="!isadd"
                   @click="submitEditForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button type="info"
                   @click="$router.go(-1)">返回</el-button>
      </projectForm>
    </el-col>
  </el-row>
</div>
</template>

<script>
import projectForm from '@/module/project-manage/page/components/form'
import * as beamApi from '@/module/project-manage/api/beam'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  inject: ['reload'],
  components: {projectForm},
  data () {
    var check = (rule,value,callback) => {
      value.value?callback():callback(new Error(value.label+'不能为空'))
    }
    return {
      isadd: true,
      form: {},
      rules:{
        serialNumber:[{
          required: true,
          trigger: 'blur'
        },{
          validator:check,
          trigger: 'blur'
        }],
      },
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      this.isadd = false
      this.initList({id:id})
    } else {
      for (let i in this.list) {
        this.list[i].value = null
      }
    }
  },
  computed: {
    // 桥梁的详情数据
    ...mapState('beam', { list: state => state.list }),
  },
  methods: {
    submitForm () {
      let _this = this
      this.$refs['formTemplate'].$children[0].validate((valid) => {
        if (valid) {
          for (let i in this.list) {
            if (i !== 'id')
            this.form[i] = this.list[i].value
          }
          this.form.bridgeId = this.$route.query.bridgeId
          this.form.sectionId = this.$route.query.sectionId
          this.form.itemId = this.$route.query.itemId
          beamApi.add(this.form).then(data => {
            if (data.success) {
              _this.$message.success(data.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.go(-1)
              })
            } else {
              _this.$message.error(data.message)
            }
          })
        } 
        else {
          this.$message.error('表单未完成！')
          return false
        }
      })
    },
    submitEditForm () {
      let _this = this
      this.$refs['formTemplate'].$children[0].validate((valid) => {
        if (valid) {
          for (let i in this.list) {
            this.form[i] = this.list[i].value
          }
          beamApi.edit(this.form).then(data => {
            if (data.success) {
              _this.$message.success(data.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.go(-1)
              })
            } else {
              _this.$message.error(data.message)
            }
          })
        } 
        else {
          this.$message.error('表单未完成！')
          return false
        }
      })
    },
    resetForm () {
      let model = this.$refs['formTemplate'].$children[0].$options.propsData.model
      for (let i in model) {
        model[i].value = null
      }
    },
    // 初始化
    ...mapActions('beam', { initList: 'initList' }),
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
  watch: {
  }
}
</script>

<style>

</style>