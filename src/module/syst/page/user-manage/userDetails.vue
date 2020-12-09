<template>
  <div class="refEl">
    <el-form ref="form" :model="form" label-suffix=":" label-width="100px">
      <el-form-item label="id" prop="id">
        <el-input
          v-model="form.id"
          auto-complete="off"
          disabled="disabled"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="nickName"
        :rules="[
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="form.nickName"
          auto-complete="off"
          readonly="readonly"
          placeholder="请填写用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="姓名"
        prop="username"
        :rules="[{ required: true, message: '姓名不能为空', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.username"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="工号"
        prop="jobNumber"
        :rules="[{ required: true, message: '工号不能为空', trigger: 'blur' }]"
      >
        <el-input
          v-model="form.jobNumber"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-input
          v-model="form.avatar"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>

      <el-form-item
        label="性别"
        prop="sex"
        clearable
        :rules="[{ required: true, message: '性别不能为空', trigger: 'blur' }]"
      >
        <el-select
          v-model="form.sex"
          placeholder="性别"
          disabled="disabled"
          style="width: 200px "
        >
          <el-option
            v-for="item in sexoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Email">
        <el-input
          v-model="form.email"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>

      <el-form-item label="手机">
        <el-input
          v-model="form.mobile"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>

      <el-form-item label="地址">
        <el-input
          v-model="form.address"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>

      <el-form-item label="街道">
        <el-input
          v-model="form.street"
          auto-complete="off"
          readonly="readonly"
        ></el-input>
      </el-form-item>

      <!-- <el-form-item label="公司">
        <el-select v-model="form.departmentId" clearable placeholder="请选择" disabled="disabled"
                   style="width: 100% ">
          <el-option
            v-for="item in companies"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="部门">
        <el-cascader style="width: 100%;"
                     v-model="form.department1s"
                     placeholder="未添加部门"
                     :options="departments"
                     :show-all-levels="false"
                     :props="{ checkStrictly: true, emitPath: false}"
                     disabled></el-cascader>
      </el-form-item>

      <el-form-item label="角色">
        <el-select
          v-model="form.roles[0]"
          value-key="id"
          clearable
          placeholder="请选择"
          disabled="disabled"
          style="width:100%"
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

      <el-form-item label="创建人">
        <el-select v-model="form.createBy"
                   value-key="id"
                   readonly
                   disabled
                   style="width:100%">
          <el-option v-for="item in users"
                     :key="item.id"
                     :label="item.nickName + '(' + item.jobNumber + ')'"
                     :value="item.id">
            <span style="float: left;width:200px;">{{ item.nickName }}</span>
            <span style="float: left; color: #8492a6; font-size: 13px">{{
              item.jobNumber
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="创建日期"
        prop="ceateTime"
        :rules="[
          { required: false, message: '创建日期不能为空', trigger: 'blur' }
        ]"
      >
        <el-date-picker
          v-model="form.createTime"
          type="date"
          disabled="disabled"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="修改人">
        <el-select v-model="form.updateBy"
                   value-key="id"
                   readonly
                   disabled
                   style="width:100%">
          <el-option v-for="item in users"
                     :key="item.id"
                     :label="item.nickName + '(' + item.jobNumber + ')'"
                     :value="item.id">
            <span style="float: left;width:200px;">{{ item.nickName }}</span>
            <span style="float: left; color: #8492a6; font-size: 13px">{{
              item.jobNumber
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="修改日期"
        prop="updateTime"
        :rules="[
          { required: false, message: '修改日期不能为空', trigger: 'blur' }
        ]"
      >
        <el-date-picker
          v-model="form.updateTime"
          type="date"
          disabled="disabled"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item
        label="状态"
        prop="status"
        :rules="[{ required: true, message: '状态不能为空', trigger: 'blur' }]"
      >
        <el-select
          v-model="form.status"
          placeholder="状态"
          disabled="disabled"
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
          readonly="readonly"
          style="width: 100%"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancle">取 消</el-button>
    </div>
  </div>
</template>

<script>
import * as sysApi from '../../api/sys'

export default {
  name: 'userDetails',
  data () {
    return {
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
      form: {
        id: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: '',
        delFlag: '',
        username: '',
        password: '',
        nickName: '',
        mobile: '',
        email: '',
        address: '',
        street: '',
        sex: '',
        passStrength: '',
        avatar: '',
        type: '',
        status: '',
        description: '',
        departmentId: '',
        departmentTitle: '',
        roles: '',
        permissions: '',
        defaultRole: ''
      },
      roles: [],
      companies: [],
      departments: [{ id: '', name: '' }],
      users: []
    }
  },
  mounted () {
    this.findRoles()
    this.findAllUser()
    // this.findCompanies()
    this.findUserById()
    //查找所有部门
    this.findDepartments()
  },
  methods: {
    findAllUser () {
			let that = this
      sysApi.findAllUser().then(res => {
        if (res.success) {
          this.users = res.result
        }
      })
		},
    //查找所有角色
    findRoles: function () {
      sysApi.findRoles().then(res => {
        if (res.success) {
          this.roles = res.result.content
        }
      })
    },
    findDepartments: function () {
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
    //查找所有公司
    // findCompanies: function () {
    //   sysApi.findCompanies().then(res => {
    //     if (res.success) {
    //       this.companies = res.result.content
    //     }
    //   })
    // },
    // 根据id查询用户信息
    findUserById: function () {
      let id = this.$route.query.id
      sysApi.findUserById(id).then(res => {
        if (res.success) {
          let list = res.result
          if (list) {
            if (list.department1s && list.department1s.length !== 0) {
              list.department1s = list.department1s[0].id
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
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../../statics/css/refEl.css";
</style>
