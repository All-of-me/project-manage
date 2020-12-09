<template>
  <div class="refEl">
    <el-form ref="form" :model="form" label-suffix=":" label-width="100px">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]"
      >
      <!-- <el-form-item
        label="用户名"
        prop="username"
        :rules="[
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: '用户名只能是英文字母数字和下划线',
            trigger: 'blur'
          }
        ]"
      > -->
        <el-input
          v-model="form.username"
          auto-complete="off"
          placeholder="请填写用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
      >
        <el-input
          type="password"
          v-model="form.password"
          auto-complete="off"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="姓名"
        prop="nickName"
        :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="form.nickName" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="工号"
        prop="jobNumber"
        :rules="[{ required: true, message: '工号不能为空', trigger: 'blur' }]"
      >
        <el-input v-model="form.jobNumber" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="性别"
        prop="sex"
        :rules="[{ required: true, message: '性别不能为空', trigger: 'change' }]"
      >
        <el-select v-model="form.sex" placeholder="性别" style="width: 200px ">
          <el-option
            v-for="item in sexoptions"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Email">
        <el-input v-model="form.email" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item
        label="手机"
        prop="mobile"
        :rules="[
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }
        ]"
      >
        <el-input v-model="form.mobile" auto-complete="off"></el-input>
      </el-form-item>

      <!-- <el-form-item
        label="公司"
        prop="companyId"
        :rules="[{ required: true, message: '公司不能为空', trigger: 'blur' }]"
      >
        <el-select
          v-model="form.companyId"
          clearable
          placeholder="请选择"
          style="width: 100% "
          @change="findDepartments"
        >
          <el-option
            v-for="item in companies"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item
        label="部门"
        prop="department1s"
        :rules="[{ required: true, message: '部门不能为空', trigger: 'change' }]"
      >
        <el-cascader style="width: 100%;"
                     v-model="form.department1s"
                     placeholder="请添加部门"
                     :options="departments"
                     :show-all-levels="false"
                     :props="{ checkStrictly: true, emitPath: false}"
                     @change="handleChange"
                     clearable></el-cascader>
      </el-form-item>

      <el-form-item
        label="角色"
        prop="role"
        :rules="[{ required: true, message: '角色不能为空', trigger: 'change' }]"
      >
        <el-select
          v-model="form.role"
          value-key="id"
          clearable
          placeholder="请选择"
          style="width: 200px "
        >
          <el-option
            v-for="item in roles"
            :key="item.id"
            :label="item.description"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="可创建用户数"
        prop="totalUser"
        :rules="[
          { required: true, message: '可创建用户数不能为空', trigger: 'blur' }
        ]"
        v-if="form.role.id == 2"
      >
        <el-select
          v-model="form.totalUser"
          clearable
          filterable
          allow-create
          placeholder="请选择"
          style="width: 200px "
        >
          <el-option
            v-for="item in totalUsers"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item
        label="状态"
        prop="status"
        :rules="[{ required: true, message: '状态不能为空', trigger: 'change' }]"
      >
        <el-select
          v-model="form.status"
          placeholder="状态"
          style="width: 200px "
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="form.description"
          auto-complete="off"
          style="width: 100%"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submit(form)">确 定</el-button>
      <el-button @click="cancle">取 消</el-button>
    </div>
  </div>
</template>

<script>
import * as sysApi from '@/module/syst/api/sys'

export default {
  name: 'addUser',
  data () {
    return {
      totalUsers: [{ value: 10 }, { value: 20 }, { value: 50 }, { value: 100 }],
      options: [
        {
          value: '1',
          label: '在用'
        },
        {
          value: '0',
          label: '停用'
        }
      ],
      user: {},
      sexoptions: [
        {
          value: '1',
          label: '男'
        },
        {
          value: '0',
          label: '女'
        }
      ],
      form: {
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        delFlag: '',
        description: ''
      },
      roles: [],
      companies: [],
      departments: []
    }
  },

  mounted () {
    this.findRoles()
    // this.findCompanies()
    this.findActiveUser()
    this.findDepartments()
  },
  methods: {
    findDepartments () {
      var recursion = (children) => {
        let c = []
        // if (children[0].level <= 2) {
        for (var i in children) {
          let cc = []
          if (children[i].departmentChildren && children[i].departmentChildren !== null && children[i].departmentChildren.length !== 0) {
            let children2 = children[i].departmentChildren
            cc.push(...recursion(children2))
          }
          c.push(
            { value: children[i].id, label: children[i].title, children: cc }
          )
        }
        return c
      }
      sysApi.findDepartments().then(res => {
        if (res.success) {
          this.departments = recursion(res.result)
        }
      })
    },
    findActiveUser () {
      this.user = this.getActiveUser()
    },

    //查找所有角色
    findRoles: function () {
      sysApi.findRoles().then(res => {
        if (res.success) {
          this.roles = res.result.content
          //只要当前登陆的用户不是超级管理员，则将超级管理员角色置为不可选
          // for (var i in this.roles) {
          //   if (
          //     (this.roles[i].id === 1 || this.roles[i].id === 2) &&
          //     this.user.utype !== '1'
          //   ) {
          //     this.roles[i].disabled = true
          //   }
          // }
        }
      })
    },
    //查找所有公司
    // findCompanies: function () {
    //   sysApi.findCompanies().then(res => {
    //     if (res.success) {
    //       this.companies = res.queryResult.list
    //     }
    //   })
    // },
    cancle: function () {
      this.$router.go(-1)
    },
    submit: function (form) {
      this.$refs['form'].validate(valid => {
        //表单校验
        if (valid) {
          let submitForm = JSON.parse(JSON.stringify(this.form))
          let roles = []
          roles.push(submitForm.role)
          submitForm.roles = roles
          submitForm.department1s = [{ id: submitForm.department1s }]
          let param = { rolesID: [] }
          for (let i in submitForm.roles) {
            param.rolesID.push(submitForm.roles[i].id)
          }
          param.user = submitForm
          let params = Object.assign({}, param)
          sysApi.insertUser(params).then(res => {
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              //返回
              this.$router.go(-1)
            } else {
              this.$message.error({
                message: res.message
              })
            }
          })
        }
      })
    },
    handleChange (value) {
    }
  }
}
</script>

<style lang="less" scoped>
.dialog-footer {
  text-align: center;
}

.refEl {
  width: 60%;
  margin: 0 auto;
  margin-bottom: 100px;
}

@media screen and (max-width: 415px) {
  .refEl {
    width: 95%;
    margin: 0px auto;
    margin-bottom: 80px;
  }
}

@media screen and (min-width: 415px) and(max-width: 1200px) {
  .refEl {
    margin-bottom: 90px;
  }
}
</style>
