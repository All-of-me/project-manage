<template>
<div class="edit">
  <h1 style="width:100%;text-align:center;">{{list.bridgeTitle.value?list.bridgeTitle.value:'请填写名称'}}</h1>
  <el-row>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm :list="list"
                   :inline="false"
                   :size="'medium'" :rules="rules" ref="formTemplate">
        <p style="color:red;">桥梁所在标段会根据 起点、终点 自动判断！</p>
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
import * as bridgeApi from '@/module/project-manage/api/bridge'
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
        sectionId:[{
          required: true,
          trigger: 'change'
        },{
          validator:check,
          trigger: 'change'
        }],
        bridgeNumber:[{
          required: true,
          trigger: 'blur'
        },{
          validator:check,
          trigger: 'blur'
        }],
        bridgeTitle:[{
          required: true,
          trigger: 'blur'
        },{
          validator:check,
          trigger: 'blur'
        }],
        origin:[{
          required: true,
          trigger: 'blur'
        },{
          validator:check,
          trigger: 'blur'
        }],
        terminus:[{
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
    this.initSections(this.$route.query.itemId)
    var _this = this
    if (id && parseInt(id) !== 0) {
      this.isadd = false
      this.initList({id:id})
    } else {
      for (let i in this.list) {
        this.list[i].value = null
      }
      this.list.sectionId.value = this.$route.query.sectionId
    }
    this.initUsers()
    this.initUsersList(this.$route.query.itemId)
  },
  computed: {
    // 桥梁的详情数据
    ...mapState('bridge', { list: state => state.list }),
  },
  methods: {
    submitForm () {
      let _this = this
      this.$refs['formTemplate'].$children[0].validate((valid) => {
        if (valid) {
          for (let i in this.list) {
            if (i !== 'id')
              if (i=='designId'||i=='reviewId'||i=='disDirector') {
                if (this.list[i].value !== null && this.list[i].value.length !== 0) {
                  this.form[i] = this.list[i].value.join(',')
                }
                else this.form[i] = null
              }
              else this.form[i] = this.list[i].value
          }
          this.form.itemId = this.$route.query.itemId
          bridgeApi.add(this.form).then(data => {
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
            if (i=='designId'||i=='reviewId'||i=='disDirector') {
              if (this.list[i].value !== null && this.list[i].value.length !== 0) {
                this.form[i] = this.list[i].value.join(',')
              }
              else this.form[i] = null
            }
            else this.form[i] = this.list[i].value
          }
          bridgeApi.edit(this.form).then(data => {
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
    ...mapActions('user', { initUsers: 'initUsers' }),
    ...mapActions('bridge', { initList: 'initList' }),
    ...mapActions('bridge', { initUsersList: 'initUsers' }),
    ...mapActions('bridge', { initSections: 'initSections' }),
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
  watch: {
  }
}
</script>

<style>

</style>