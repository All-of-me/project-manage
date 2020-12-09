<template>
  <div>
    <!-- 编写页面静态部分，即view部分 -->
    <el-row class="top">
      <el-button type="primary"
                 icon="el-icon-edit"
                 @click="addInfo">添加</el-button>
      <el-button type="danger"
                 icon="el-icon-delete"
                 @click="del">删除</el-button>
    </el-row>
    <el-row>
      <!-- style="overflow: hidden;"> -->
      <div class="aside">
        <template>
          <el-table :data="roles"
                    border
                    ref="multipleTable"
                    :cell-style="cellStyle"
                    :header-cell-style="rowClass"
                    style="width: 100%">
            <el-table-column type="selection"
                             width="30"> </el-table-column>
            <el-table-column prop="name"
                             width="120"
                             label="角色名称"
                             sortable>
            </el-table-column>
            <el-table-column prop="description"
                             label="描述"
                             show-overflow-tooltip
                             sortable>
            </el-table-column>
            <el-table-column fixed="right"
                             width="160"
                             label="操作">
              <template slot-scope="scope">
                <span>
                  <!-- :style="
                    user.roles[0].name === 'ROLE_ADMIN'
                      ? 'display:inline'
                      : 'display:none'
                  "> -->
                  <el-button type="text"
                             size="mini"
                             @click="() => handleClick(scope.row)">
                    查看
                  </el-button>
                  <el-button type="text"
                             size="mini"
                             @click="() => handleEditClick(scope.row)">
                    编辑
                  </el-button>
                  <el-button type="text"
                             size="mini"
                             @click="$router.push({path:'/edit-role',query: {role:scope.row.description}})">
                    人员
                  </el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="box">
        <div class="right"
             id="rh1"
             v-show="chaVisible">
          <div>
            <el-form :inline="false"
                     label-suffix=":"
                     label-width="100px"
                     ref="editForm">
              <el-form-item label="编号"
                            prop="id">
                <el-input v-model="editForm.id"
                          readonly="readonly"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="名称"
                            prop="name">
                <el-input v-model="editForm.name"
                          :readonly="!eVisible ? 'readonly' : false"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="描述"
                            prop="description">
                <el-input type="textarea"
                          :readonly="!eVisible ? 'readonly' : false"
                          v-model="editForm.description"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="创建人"
                            v-if="!eVisible">
                <el-input v-model="createBy"
                          readonly="readonly"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="创建日期"
                            v-if="!eVisible">
                <el-input v-model="editForm.createTime"
                          readonly="readonly"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="修改人"
                            v-if="!eVisible">
                <el-input v-model="updateBy"
                          readonly="readonly"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="修改日期"
                            v-if="!eVisible">
                <el-input v-model="editForm.updateTime"
                          readonly="readonly"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="权限"
                            prop="permissions">
                <div class="aside per"
                     style="float:left;height: 400px;width:80%;overflow: auto">
                  <el-tree :data="data"
                           show-checkbox
                           ref="tree"
                           v-model="permissions"
                           node-key="value"
                           default-expand-all
                           check-strictly
                           :expand-on-click-node="false">
                    <!-- <span class="custom-tree-node" slot-scope="{ node, data }"> -->
                    <span class="custom-tree-node"
                          slot-scope="{ node }">
                      <span>{{ node.label }}</span>
                    </span>
                  </el-tree>
                </div>
              </el-form-item>
            </el-form>

            <div class="quxiao">
              <el-button type="primary"
                         @click="confirm"
                         v-if="eVisible">确定</el-button>
              <el-button type="info"
                         @click="cancle">关闭</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
/*编写页面静态部分，即model及vm部分。 */
import * as sysApi from '../../api/sys'

export default {
  // watch: {
  //   eVisible (newValue) {
  //     console.log(this.data)
  //     this.data.forEach((d) => {
  //       d.disabled = true
  //       console.log(d)
  //     })
  //   }
  // },
  data () {
    return {
      data: [],
      // 所有的权限
      permissions: [],
      list: [],
      total: 0,
      params: {
        page: 1,
        size: 10
      },
      user: {},
      roles: [],
      eVisible: false,
      chaVisible: false,
      addLoading: false,
      createBy: '',
      updateBy: '',
      editForm: {
        name: '',
        description: '',
        permissionsId: []
      }
    }
  },
  created () {
    this.findRoles()
    this.fingPermissions()
    this.findActiveUser()
  },
  mounted () { },

  methods: {
    // table居中
    cellStyle: function () {
      return 'text-align:center'
    },
    // 每一行居中
    rowClass: function () {
      return 'text-align:center'
    },
    findActiveUser () {
      this.user = this.getActiveUser()
    },
    // 格式化用户类型
    formatType: function (row, column) {
      return row.id === 1 ? '超级管理员' : row.id === 2 ? '梁场管理员' : '员工'
    },
    // 查找所有的角色
    findRoles () {
      sysApi.findRoles().then(res => {
        if (res.success) {
          this.roles = res.result.content
        } else {
          this.$message(res.message)
        }
      })
    },
    // 查找所有的权限
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
              { value: children[i].id, label: children[i].title, children: cc, level: children[i].level }
            )
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
    },
    // 添加
    addInfo () {
      // 跳转至添加角色
      this.$router.push({
        path: '/add-role'
      })
    },
    // 查看
    handleClick (row) {
      this.$refs.tree.setCheckedKeys([])
      this.chaVisible = true
      this.eVisible = false
      sysApi.findRoleById(row.id).then(res => {
        if (res.success) {
          this.editForm = res.result
          this.createBy = res.result.createBy
          this.updateBy = res.result.updateBy
          let permissions = res.result.permissions
          var ids = []
          if (permissions !== null && permissions.length !== 0) {
            for (var i in permissions) {
              ids.push(permissions[i].permissionId)
            }
            this.editForm.permission = permissions
            this.$refs.tree.setCheckedKeys(ids)
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 取消
    cancle () {
      this.chaVisible = false
      this.eVisible = false
    },
    // 编辑
    handleEditClick (row) {
      this.$refs.tree.setCheckedKeys([])
      this.chaVisible = true
      this.eVisible = true
      sysApi.findRoleById(row.id).then(res => {
        if (res.success) {
          this.editForm = res.result
          this.createBy = res.result.createBy
          this.updateBy = res.result.updateBy
          let permissions = res.result.permissions
          var ids = []
          if (permissions !== null && permissions.length !== 0) {
            for (var i in permissions) {
              ids.push(permissions[i].permissionId)
            }
            this.editForm.permission = permissions
            this.$refs.tree.setCheckedKeys(ids)
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 点击确定
    confirm () {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      var p = []
      if (checkedKeys.length !== 0) {
        for (var i in checkedKeys) {
          p.push(checkedKeys[i])
        }
      }
      this.editForm.permissionsId = p
      sysApi.updateRole(this.editForm).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.chaVisible = false
          this.eVisible = false
          this.findRoles()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //  删除按钮
    del (id, row) {
      var ids = []
      const _selectData = this.$refs.multipleTable.selection
      if (row) {
        ids.push(row)
      } else if (_selectData.length !== 0) {
        for (var key in _selectData) {
          ids.push(_selectData[key].id)
        }
      }
      if (ids.length === 0) {
        this.$message('没有选中角色！')
        return
      }
      this.$confirm('确定删除吗', '提示', {}).then(() => {
        sysApi.deleteRoleByIds(ids).then(res => {
          if (res.success) {
            this.$message(res.message)
            //刷新
            this.findRoles()
          } else {
            this.$message(res.message)
          }
        })
      })
    }
  }
}
</script>
<style lang="less">
/*编写页面样式，不是必须*/
* {
  padding: 0;
  margin: 0;
}
.top {
  margin: 10px 0;
}
.aside {
  width: 30%;
  float: left;
  border: 1px solid #dcdfe6;
}
.per {
  width: 65%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.box {
  float: left;
  width: 65%;
  margin-left: 20px;

  /*height: 100%;*/
}

.right {
  float: left;
  width: 100%;
  margin-top: 20px;
}

.quxiao {
  padding-left: 20px;
  margin: 0 auto;
  text-align: center;
}
@media screen and(max-width: 415px) {
  .aside {
    width: 95% !important;
  }
  .box {
    width: 95%;
    margin-left: 0;
  }
}
@media screen and(max-width: 1200px) and (min-width: 415px) {
  .box {
    margin-bottom: 100px;
  }
}
</style>
