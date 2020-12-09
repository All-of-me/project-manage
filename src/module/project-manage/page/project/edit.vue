<template>
<div class="edit">
  <h1 style="width:100%;text-align:center;">{{list.itemTitle.value?list.itemTitle.value:'请填写名称'}}</h1>
  <el-row>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm ref="formTemplate" :list="list" :inline="false" :size="'medium'" :labelWidth="80" :rules="rules">
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
import { mapGetters, mapState, mapActions } from 'vuex'
import projectForm from '@/module/project-manage/page/components/form'
import * as projectApi from '../../api/project'

export default {
  inject: ['reload'],
  components: {projectForm},
  data () {
    var check = (rule,value,callback) => {
      value.value?callback():callback(new Error(value.label+'不能为空'))
    }
    return {
      form: {
				itemTitle:'',
				origin:'',
				terminus:'',
				specialId:[],
				engineerId:[],
				disDirectors:[],
				userList:[],
				buildUnit:'',
				startTime:'',
				endTime:'',
				comment:'',
      },
      rules:{
        itemTitle:[{
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
      formLoading: false,
      isadd: true,
      users: [],
      engineers: []
    }
  },
  created () {
    let id = this.$route.query.id
    this.initUserList(id)
    this.form.id = this.$route.query.id
    if (id && parseInt(id) !== 0) {
      this.formLoading = true
      this.isadd = false
      this.initList({id:id,action:()=>{
        this.formLoading = false
      }})
    } else {
      for (let i in this.list) {
        this.list[i].value = null
      }
    }
  },
  methods: {
    submitForm () {
      let _this = this
      this.$refs['formTemplate'].$children[0].validate((valid) => {
        if (valid) {
          for (let i in this.list) {
            if (i !== 'id') {
              if (i=='specialId'||i=='engineerId'||i=='disDirectors'||i=='userList') {
                if (this.list[i].value !== null && this.list[i].value.length !== 0) {
                  this.form[i] = this.list[i].value.join(',')
                }
                else this.form[i] = null
              }
              else this.form[i] = this.list[i].value
            }
          }
          this.formLoading = true
          projectApi.add(this.form).then(data => {
            if (data.success) {
              _this.$message.success(data.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.push('/project/list')
              })
            } else {
              _this.$message.error(data.message)
              _this.formLoading = false
            }
          }).catch(e => {
            _this.formLoading = false
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
            if (i=='specialId'||i=='engineerId'||i=='disDirectors'||i=='userList') {
              if (this.list[i].value !== null && this.list[i].value.length !== 0) {
                this.form[i] = this.list[i].value.join(',')
              }
              else this.form[i] = null
            }
            else this.form[i] = this.list[i].value
          }
          this.formLoading = true
          projectApi.edit(this.form).then(data => {
            if (data.success) {
              _this.$message.success(data.message)
              _this.delCurrentView(_this).then(() => {
                _this.$router.push('/project/list')
                _this.reload()
              })
            } else {
              _this.$message.error(data.message)
              _this.formLoading = false
            }
          }).catch(e => {
            _this.formLoading = false
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
    ...mapActions('tagsView', { delCurrentView: 'delCurrentView' }),
    ...mapActions('project', { initUserList: 'initUsers' }),
    ...mapActions('project', { initList: 'initList' }),
  },
  computed: {
    ...mapState('project', { list: state => state.list }),
  },
  watch: {
    'list.userList.value':function (val){
      if (!this.list.userList.list) this.list.userList.list = []
      var users
      if (val)
        users = val.map(id=> this.list.userList.list.filter(user => user.id === id)[0])
      function test (form) {
        var k
        for (let i in users) {
          k = false
          for (let j in form) {
            if (form[j].id === users[i].id) {
              k = true
              break
            }
          }
          if (!k) {
            form.push(users[i])
          }
        }
      }
      if(users) {
        for (let i=users.length-1;i>=0;i--) {
          if (!users[i]) users.pop()
        }
        test(this.list.specialId.list)
        test(this.list.disDirectors.list)
      }
    },
    'list.engineerId.value':function (val){
      this.$forceUpdate()
      if (!this.list.userList.value) this.list.userList.value = []
      if (val) {
        // 先合并，再去重
        this.list.userList.value = val.concat(this.list.userList.value)
        this.list.userList.value = Array.from(new Set(this.list.userList.value))
      }
    },

  }
}
</script>
