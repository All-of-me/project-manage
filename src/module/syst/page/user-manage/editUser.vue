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
      <!-- ,
          {
            pattern: /^[0-9a-zA-Z_]{1,}$/,
            message: '用户名只能是英文字母数字和下划线',
            trigger: 'blur'
          } -->
        <el-input
          v-model="form.username"
          auto-complete="off"
          placeholder="请填写用户名"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="密码"
        prop="password"
        :rules="[{ required: true, message: '密码不能为空', trigger: 'blur' }]"
      >
        <el-input
          type="password"
          v-model="form.password"
          auto-complete="off"
        ></el-input>
      </el-form-item> -->

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
        <el-select
         v-model="form.sex"
         placeholder="性别"
         style="width: 200px ">
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

      <el-form-item
        label="部门"
        prop="department"
      >
        <el-cascader
          style="width: 100%;"
          clearable
          v-model="departmentId"
          :options="departments"
          placeholder="未添加部门"
          :show-all-levels="false"
          :props="{ checkStrictly: true, emitPath: false }"
          @change="handleChange"></el-cascader>
      </el-form-item>

      <el-form-item
        label="角色"
        prop="roles"
        :rules="[{ required: true, message: '角色不能为空', trigger: 'change' }]"
      >
        <el-select
          v-model="form.roles"
          multiple
          value-key="id"
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
      <el-button
        type="primary"
        @click="submit(form)"
        >确 定</el-button
      >
      <el-button @click="cancle">取 消</el-button>
    </div>
  </div>
</template>

<script>
import * as sysApi from '../../api/sys'
export default {
  name: 'editUser',
  data () {
    return {
      departmentId: '',
      user: {},
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

      totalUsers: [{ value: 10 }, { value: 20 }, { value: 50 }, { value: 100 }],
      form: {
        username: '',
        name: '',
        sex: '',
        email: '',
        status: '',
        totalUser: '',
        description: '',
        mobile: '',
        companyId: '',
        createTime: '',
        role: {
          id: ''
        }
      },
      roles: [],
      companies: [],
      departments: [{ id: '', name: '' }],
      department: []
    }
  },
  beforeCreate () {},
  created () {
    this.findRoles()
    // this.findCompanies()
    this.findUserById()
    this.findActiveUser()
    this.findDepartments()
  },
  methods: {
    findDepartments () {
      // 递归方法
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
        }
      })
    },
    // 根据id查询用户信息
    findUserById: function () {
      let id = this.$route.query.id
      sysApi.findUserById(id).then(res => {
        if (res.success) {
          let list = res.result
          if (list) {
            if (list.department1s && list.department1s.length !== 0) {
              this.departmentId = list.department1s[0].id
            }
            this.form = list
          } else {
            //查询失败
            this.$message.error({
              message: '查询失败'
            })
            this.$router.go(-1)
          }
        } else {
          //查询失败
          this.$message.error({
            message: '查询失败'
          })
          this.$router.go(-1)
        }
      })
    },
    cancle: function () {
      this.$router.go(-1)
    },
    submit: function (form) {
      this.$refs['form'].validate(valid => {
        //表单校验
        if (valid) {
          this.form.department1s = [{ id: this.departmentId }]
          let param = { rolesID: [] }
          for (let i in this.form.roles) {
            param.rolesID.push(this.form.roles[i].id)
          }
          param.user = this.form
          let params = Object.assign({}, param)
          sysApi.updateUser(params).then(res => {
            if (res.success) {
              this.$message({
                message: '修改成功',
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

<style scoped lang="less">
@import "../../../../statics/css/refEl.css";
</style>
