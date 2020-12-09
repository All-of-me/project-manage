<template>
  <div style="height: 100%;">
    <div class="contents">
      <el-form :inline="false"
               :model="addForm"
               label-width="100px"
               ref="addForm">
        <el-form-item label="父权限">
          <el-cascader style="width: 100%;"
                       placeholder="不选为顶级"
                       clearable
                       v-model="dictId"
                       :options="data1"
                       :show-all-levels="false"
                       :props="{checkStrictly: true}"
                       @change="handleChange"></el-cascader>
        </el-form-item>
        <el-form-item label="数据名称"
                      prop="title"
                      :rules="[{required:true ,message:'请输入数据名称',trigger:'blur'}]">
          <el-input v-model="addForm.title"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="type"
                      :style="{display:pId.length===0?'':'none'}"
                      prop="type"
                      :rules="pId.length===0?[{required:true ,message:'请输入专业名称',trigger:'blur'}]:[]">
          <el-input v-model="addForm.type"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="value"
                      :style="{display:pId.length!==0?'':'none'}"
                      prop="value"
                      :rules="pId.length!==0?[{required:true ,message:'请输入value值',trigger:'blur'}]:[]">
          <el-input v-model="addForm.value"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="排序"
                      prop="sortOrder">
          <el-input v-model="addForm.sortOrder"
                    auto-complete="off"
                    type="number"></el-input>
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
                   width: 70px;">
          提交
        </el-button>
        <el-button @click="cancle"
                   style="height: 40px;
                   width: 70px;">
          取消
        </el-button>

      </div>
    </div>
  </div>
</template>

<script>
import * as sysApi from '../../api/sys'
export default {
  watch: {
    data (newValue) {
      for (let i in newValue) {
        this.data1.push(
          { value: newValue[i].value, label: newValue[i].label }
        )
      }
    }
  },
  data () {
    return {
      dictId: '',
      node: [],
      nodeChild: [],
      addForm: {
        title: '',
        type: '',
        value: '',
        status: '',
        dictId: '',
        description: '',
        sortOrder: ''
      },
      pId: [],
      data: [],
      data1: []
    }
  },
  mounted () {
    this.findDicts()
  },
  methods: {
    //查找所有
    findDicts () {
      sysApi.getAllDictList().then((res) => {
        if (res.success) {
          let list = res.result
          // var node = []
          var nodeChild = []
          var c = []
          for (var key in list) {
            nodeChild = []
            if (list[key].dictData1s != null && list[key].dictData1s.length !== 0) {
              let children = list[key].dictData1s
              for (var k in children) {
                c = []
                if (children[k].dictData1s != null && children[k].dictData1s.length !== 0) {
                  let dictData1s = children[k].dictData1s
                  for (var i in dictData1s) {
                    c.push({
                      value: dictData1s[i].id,
                      label: dictData1s[i].title
                    })
                  }
                }
                nodeChild.push(
                  { value: children[k].id, label: children[k].title, children: c }
                )
              }
            }
            this.node.push(
              { value: list[key].id, label: list[key].title, children: nodeChild }
            )
            this.nodeChild.push(...nodeChild)
          }
          this.data = this.node
        }
      })
    },
    //新增提交
    addSubmit () {
      this.$refs['addForm'].validate((valid) => {
        //表单验证通过
        if (valid) {
          var p
          var api
          //    提交
          if (this.pId.length === 0) {
            api = sysApi.insertDict(this.addForm)
          } else {
            let pIds = this.pId
            //取数组最后一个的值
            for (var key in pIds) {
              p = pIds[key]
            }
            this.addForm.dictId = p
            api = sysApi.insertChildrenDict(this.addForm)
          }
          api.then((res) => {
            if (res.success) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.findDicts()
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
    },
    cancle: function () {
      this.$router.go(-1)
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
