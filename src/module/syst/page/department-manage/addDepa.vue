<template>
  <div style="height: 100%;">
    <div class="contents">
      <el-form :inline="false"
               :model="addForm"
               label-width="100px"
               ref="addForm">
        <el-form-item label="父部门">
          <el-cascader style="width: 100%;"
                       placeholder="不选为最高部门"
                       clearable
                       v-model="pId"
                       :options="data"
                       :show-all-levels="false"
                       :props="{ checkStrictly: true, emitPath: false }"
                       @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="部门名称"
                      prop="title"
                      :rules="[{ required: true, message: '请输入部门名称' }]">
          <el-input v-model="addForm.title"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序"
                      prop="sortOrder"
                      :rules="[{ required: false, message: '请输入排序' }]">
          <el-input v-model="addForm.sortOrder"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门成员"
                      prop="userDepartmentChildren"
                      :rules="[{ required: false, message: '请输入部门成员' }]">
          <el-select v-model="addForm.userDepartmentChildren"
                     value-key="id"
                     style="width:100%;"
                     filterable
                     default-first-option
                     multiple
                     placeholder="请选择">
            <el-option v-for="item in user"
                       :key="item.id"
                       :label="item.nickName+'('+item.jobNumber+')'"
                       :value="item">
                       <span style="float: left;width:200px;">{{ item.nickName }}</span><span style="float: left; color: #8492a6; font-size: 13px">{{ item.jobNumber }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="描述"
                      prop="description">
          <el-input type="textarea"
                    v-model="addForm.description"
                    auto-complete="off"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="addSubmit"
                   style="height: 40px;
    width: 70px;">提交
        </el-button>
        <el-button @click="cancle"
                   style="height: 40px;
    width: 70px;">取消
        </el-button>

      </div>
    </div>
  </div>
</template>

<script>
import * as sysApi from '../../api/sys'
export default {
  data () {
    return {
      addForm: {
        title: '',
        parentId: '',
        description: '',
        sortOrder: '',
        departmentChildren: []
      },
      pId: '',
      data: [],
      user: []
    }
  },
  mounted () {
    this.findDepartments()
    this.findAllUser()
  },
  methods: {
    //查找所有的用户
    findAllUser () {
      sysApi
        .findAllUser()
        .then(res => {
          if (res.success) {
            if (res.result) {
              this.user = res.result
            }
          }
        })
    },
    //查找所有的权限
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
      sysApi.findDepartments().then((res) => {
        if (res.success) {
          let list = res.result
          this.data = recursion(list)
        }
      })
    },
    //新增提交
    addSubmit () {
      this.$refs['addForm'].validate((valid) => {
        //表单验证通过
        if (valid) {
          //    提交
          if (!this.pId) {
            this.pId = '0'
          }
          this.addForm.parentId = this.pId
          let userChildren = this.addForm.userDepartmentChildren
          for (let i in userChildren) {
            userChildren[i].userId = userChildren[i].id
            delete userChildren[i].id
            userChildren[i].jobTitle = '0'
          }
          this.addForm.userDepartmentChildren = userChildren
          sysApi.insertDepartment(this.addForm).then((res) => {
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.findDepartments()
              //关闭窗口
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
    },
    cancle: function () {
      this.$router.go(-1)
    }
  },
  computed: {
    type: function () {
      switch (this.level) {
        case 0:
          return -1
        case 1:
        case 2:
          return 0
        case 3:
          return 1
      }
    }
  }
}
</script>

<style scoped>
.contents {
  width: 50%;
  margin: 0 auto;
}
</style>
