<template>
  <div class="right" id="rh1">
    <div class="refEl">
      <el-form
        :model="editForm"
        label-suffix=":"
        label-width="100px"
        ref="editForm"
      >
        <el-form-item
          label="名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入角色名称',trigger:'blur' }
          ]"
        >
          <el-input
            v-model="editForm.name"
            placeholder="请输入角色名称"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            type="textarea"
            v-model="editForm.description"
            auto-complete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="权限" prop="permissions">
          <el-tree
            :data="data"
            show-checkbox
            ref="tree"
            v-model="permissions"
            node-key="value"
            default-expand-all
            check-strictly
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <span>{{ node.label }}</span>
            </span>
          </el-tree>
        </el-form-item>
      </el-form>

      <div class="quxiao">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button type="info" @click="cancle">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as sysApi from '../../api/sys'
import utils from '@/common/utils'
export default {
  name: 'addRole',
  data () {
    return {
      data: [],
      permissions: [],
      editForm: {
        name: '',
        description: '',
        permissionsId: []
      }
    }
  },
  mounted () {
    this.fingPermissions()
    this.findActiveUser()
  },
  methods: {
    //获取当前登陆的用户
    findActiveUser () {
      this.user = this.getActiveUser()
      // for (var i in this.utypes) {
      //   if (this.utypes[i].required.indexOf(this.user.utype) === -1) {
      //     this.utypes[i].disabled = true
      //   }
      // }
    },
    //取消
    cancle () {
      this.$router.go(-1)
    },
    confirm () {
      /*this.$refs['form'].validate((valid) => {
          //表单验证通过
          if (valid) {   }
      })*/
      // debugger
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      var p = []
      if (checkedKeys.length !== 0) {
        for (var i in checkedKeys) {
          p.push(checkedKeys[i])
        }
      }
      this.editForm.permissionsId = p
      sysApi.insertRole(this.editForm).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$router.go(-1)
        } else {
          this.$message.error(res.message)
        }
      })
    },
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
            c.push({
             value: children[i].id,
             label: children[i].title,
             children: cc,
             level: children[i].level
            })
          }
        } else {
          for (var j in children) {
            c.push({
              value: children[j].id,
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
      // sysApi.findPermissions().then(res => {
      //   if (res.success) {
      //     let list = res.result
      //     var node = []
      //     var nodeChild = []
      //     var c = []
      //     var cc = []
      //     for (var key in list) {
      //       nodeChild = []
      //       if (list[key].children !== null && list[key].children.length !== 0) {
      //         let children1 = list[key].children
      //         for (var k in children1) {
      //           c = []
      //           if (
      //             children1[k].children !== null &&
      //             children1[k].children.length !== 0
      //           ) {
      //             let children2 = children1[k].children
      //             for (var i in children2) {
      //               cc = []
      //               if (
      //                 children2[i].children !== null &&
      //                 children2[i].children.length !== 0
      //               ) {
      //                 let children3 = children2[i].children
      //                 for (var j in children3) {
      //                   cc.push({
      //                     value: children3[j].id,
      //                     label: children3[j].title
      //                   })
      //                 }
      //               }
      //               c.push({
      //                 value: children2[i].id,
      //                 label: children2[i].title,
      //                 children: cc
      //               })
      //             }
      //           }
      //           nodeChild.push({
      //             value: children1[k].id,
      //             label: children1[k].title,
      //             children: c
      //           })
      //         }
      //       }
      //       node.push({
      //         value: list[key].id,
      //         label: list[key].title,
      //         children: nodeChild
      //       })
      //     }
      //     this.data = node
      //   }
      // })
    }
  }
}
</script>

<style scoped lang="less">
@import "../../../../statics/css/refEl.css";
.right {
  margin-bottom: 100px;
}
</style>
