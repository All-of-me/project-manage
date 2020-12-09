<template>
  <div style="height: 100%;">
    <div class="contents">
      <el-form :inline="false"
               :model="addForm"
               label-width="100px"
               ref="addForm">
        <el-form-item label="父权限">
          <el-cascader style="width: 100%;"
                       placeholder="不选为顶级权限"
                       clearable
                       v-model="pId"
                       :options="data"
                       :show-all-levels="false"
                       :props="{checkStrictly: true, disabled: 'isleaf'}"
                       @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="权限名称"
                      prop="title"
                      :rules="[{required:true ,message:'请输入权限名称',trigger:'blur'}]">
          <el-input v-model="addForm.title"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="path"
                      prop="path"
                      :rules="[{ required: true, message: '请输入path',trigger:'blur' }]">
          <el-input v-model="addForm.path"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="component"
                      prop="component"
                      :rules="[{ required: true, message: '请输入component',trigger:'blur' }]">
          <el-input v-model="addForm.component"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="name"
                      prop="name"
                      :rules="[{ required: true, message: '请输入name',trigger:'blur' }]">
          <el-input v-model="addForm.name"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述"
                      prop="description">
          <el-input type="textarea"
                    v-model="addForm.description"
                    auto-complete="off"></el-input>
        </el-form-item>
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
        code: '',
        title: '',
        parentId: '',
        isMenu: '0',
        url: '',
        description: ''

      },
      pId: [],
      data: [],
      level: 0
    }
  },
  mounted () {
    this.fingPermissions()
  },
  methods: {
    //查找所有的权限
    fingPermissions () {
      // 递归方法
      var recursion = (children) => {
        let c = []
        if (children[0].level <= 2) {
          for (var i in children) {
            let cc = []
            if (children[i].children !== null && children[i].children.length !== 0) {
              let children2 = children[i].children
              cc.push(...recursion(children2))
            }
            c.push(
              { value: { title: children[i].title, id: children[i].id, level: children[i].level }, label: children[i].title, children: cc, level: children[i].level }
            )
          }
        } else {
          for (var j in children) {
            c.push({
              value: { title: children[j].title, id: children[j].id, level: children[j].level },
              label: children[j].title,
              isleaf: true,
              level: children[j].level
            })
          }
        }
        return c
      }
      sysApi.findPermissions().then((res) => {
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
          var p
          if (this.pId && this.pId.length === 0) {
            p = ''
          } else {
            let pIds = this.pId
            //取数组最后一个的值
            for (var key in pIds) {
              p = pIds[key].id
            }
          }
          this.addForm.parentId = p
          this.addForm.type = this.type
          this.addForm.level = this.level
          sysApi.insertPermission(this.addForm).then((res) => {
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.fingPermissions()
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
      this.pId = value
      if (value && value.length > 0) {
        this.level = value[value.length - 1].level + 1
      }
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
