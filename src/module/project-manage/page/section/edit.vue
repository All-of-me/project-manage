<template>
<div class="edit">
  <h1 style="width:100%;text-align:center;">{{list.sectionTitle.value?list.sectionTitle.value:'请填写名称'}}</h1>
  <el-row>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm :list="list"
                   :inline="false" :rules="rules" ref="formTemplate" :size="'medium'">
        <p style="color:red;">新建或者编辑标段，可能会导致桥梁重新根据起点、终点划分桥梁！</p>
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
import * as sectionApi from '@/module/project-manage/api/section'
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
        sectionTitle:[{
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
    if (id && parseInt(id) !== 0) {
      this.isadd = false
      this.initList({id:id,action:()=>{
        // this.initUserList(this.list.itemId.value)
        for (let i in this.list) {
          if(i=='disDirectors') {
            // 标段中的配施人员不需手动添加
            this.list[i].hidden = true
          }
        }
      }})
    } else {
      for (let i in this.list) {
        this.list[i].value = null
      }
    }
  },
  computed: {
    // 桥梁的详情数据
    ...mapState('section', { list: state => state.list }),
  },
  methods: {
    submitForm () {
      let _this = this
      this.$refs['formTemplate'].$children[0].validate((valid) => {
        if (valid) {
          for (let i in this.list) {
            if (i !== 'id') {
              if (i=='disDirectors') {
                if (this.list[i].value !== null && this.list[i].value.length !== 0)
                  this.form[i] = this.list[i].value.join(',')
                else this.form[i] = null
              }
              else this.form[i] = this.list[i].value
            }
          }
          this.form.itemId = this.$route.query.itemId
          sectionApi.add(this.form).then(data => {
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
            if (i=='disDirectors') {
              if (this.list[i].value !== null && this.list[i].value.length !== 0)
                this.form[i] = this.list[i].value.join(',')
              else this.form[i] = null
            }
            else this.form[i] = this.list[i].value
          }
          sectionApi.edit(this.form).then(data => {
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
    ...mapActions('section', { initList: 'initList' }),
    ...mapActions('section', { initUserList: 'initUsers' }),
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' })
  },
  watch: {
  }
}
</script>

<style>

</style>