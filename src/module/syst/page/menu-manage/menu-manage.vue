<template>
  <div id="main">
    <el-form :inline="true">
      <el-form-item>
        <el-button id="1"
                   type="primary"
                   icon="el-icon-edit"
                   @click="addInfo">添加
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger"
                   icon="el-icon-delete"
                   @click="() => remove(false)">删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-row style="overflow: hidden;margin-bottom: 80px;">
      <!--左侧-->
      <div class="aside"
           style="float:left;height: 700px;overflow: auto">
        <el-input v-model="filterText"
                  placeholder="输入关键字进行过滤">
        </el-input>
        <div>
          <el-tree class="filter-tree"
                   :data="data"
                   show-checkbox
                   node-key="id"
                   default-expand-all
                   :filter-node-method="filterNode"
                   :expand-on-click-node="false"
                   check-strictly
                   ref="tree">
            <span class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @mouseover="mouseover(data, $event)"
                  @mouseout="mouseleave(data, $event)">
              <span>{{ node.label }}</span>
              <span class="btns">
                <el-button type="text"
                           size="mini"
                           @click="() => cha(data)">
                  查看
                </el-button>
                <el-button type="text"
                           size="mini"
                           @click="() => edit(data)">
                  编辑
                </el-button>
                <el-button type="text"
                           style="color: red"
                           size="mini"
                           @click="() => remove(data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <!--查看-->
      <div class="box">
        <div class="right"
             id="rh1"
             v-show="visible">
          <el-form :inline="false"
                   :model="infoForm"
                   ref="addForm">
            <el-form-item label="编号">
              <el-input v-model="infoForm.id"
                        readonly="readonly"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="父权限">
              <el-cascader style="width: 100%;"
                           placeholder="不选为顶级权限"
                           clearable
                           v-model="pId"
                           :options="data"
                           :show-all-levels="false"
                           :props="{ checkStrictly: true, disabled: 'isleaf' }"
                           :disabled="true"
                           @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="权限名称"
                          prop="title"
                          :rules="[{ required: true, message: '请输入权限名称' }]">
              <el-input v-model="infoForm.title"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="path"
                          prop="path"
                          :rules="[{ required: true, message: '请输入path' }]">
              <el-input v-model="infoForm.path"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="component"
                          prop="component"
                          :rules="[{ required: true, message: '请输入component' }]">
              <el-input v-model="infoForm.component"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="name"
                          prop="name"
                          :rules="[{ required: true, message: '请输入name' }]">
              <el-input v-model="infoForm.name"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="jobTitle">
              <el-input type="textarea"
                        :readonly="!editVisiable ? 'readonly' : false"
                        v-model="infoForm.description"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建人"
                          v-if="!editVisiable">
              <el-input v-model="infoForm.createBy"
                        readonly="readonly"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建日期"
                          v-if="!editVisiable">
              <el-date-picker v-model="infoForm.createTime"
                              type="datetime"
                              readonly="readonly"
                              auto-complete="off"></el-date-picker>
            </el-form-item>
            <el-form-item label="最后一次修改人"
                          v-if="!editVisiable">
              <el-input v-model="infoForm.updateBy"
                        readonly="readonly"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="最后一次修改日期"
                          v-if="!editVisiable">
              <el-date-picker v-model="infoForm.updateTime"
                              readonly="readonly"
                              type="datetime"
                              auto-complete="off"></el-date-picker>
            </el-form-item>
            <el-form-item align="center">
              <el-button type="primary"
                         v-if="editVisiable"
                         @click="updatePermission"
                         :loading="addLoading"
                         style="height: 40px;width: 70px;">提交
              </el-button>
              <el-button style="height: 40px; width: 70px;"
                         type="info"
                         @click="quxiao">关闭
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-row>
  </div>
</template>
<script>
/* eslint-disable no-labels */
// import $ from 'jquery'
import * as sysApi from '../../api/sys'
// import utils from '@/common/utils'

export default {
  // 接收注入，从app组件中拿到方法
  inject: [ 'reload' ],
  //监听
  watch: {
    // 树形结构过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      level: '',
      show: true,
      filterText: '',
      data: [],
      //查看信息
      infoForm: {
        code: '',
        title: '',
        parentId: '',
        isMenu: '0',
        url: '',
        description: '',
        creator: { name: '' },
        createTime: '',
        modifier: { name: '' },
        updateTime: ''
      },
      visible: false,
      addLoading: false,
      editVisiable: false,
      //新增界面数据
      pId: [],
      addForm: {
        code: '',
        title: '',
        parentId: '',
        isMenu: '0',
        url: '',
        description: ''
      }
    }
  },
  mounted () {
    this.fingPermissions()
  },
  methods: {
    //鼠标移入移出
    mouseleave (data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.style.display =
        'none'
      $event.currentTarget.style.background = 'none'
    },
    mouseover (data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.style.display =
        'block'
      $event.currentTarget.style.background = '#ddd'
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    cha (data) {
      this.visible = true
      this.editVisiable = false
      this.findPermissionById(data.value.id || data.value)
    },
    findPermissionById (id) {
      sysApi.findPermissionById(id).then(res => {
        if (res.success) {
          this.infoForm = res.result
          //将pId提取出来，是一个数组，用于回显
          let node = this.data
          //遍历
          //定义数组
          var pId = []
          ok: for (var i in node) {
            if (this.infoForm.parentId === node[i].value) {
              pId.push(node[i].value)
              break
            } else {
              let children = node[i].children
              if (children !== undefined && children.length !== 0) {
                for (var j in children) {
                  if (this.infoForm.parentId === children[j].value) {
                    pId.push(node[i].value)
                    pId.push(children[j].value)
                    break ok
                  } else {
                    let child = children[j].children
                    if (child !== undefined && child.length !== 0) {
                      for (var k in child) {
                        if (this.infoForm.parentId === child[k].value) {
                          pId.push(node[i].value)
                          pId.push(children[j].value)
                          pId.push(child[k].value)
                          break ok
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          this.pId = pId
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //更新权限
    updatePermission () {
      var p
      //  提交
      if (this.pId.length === 0) {
        p = ''
      } else {
        let pIds = this.pId
        //取数组最后一个的值
        for (var key in pIds) {
          p = pIds[key]
        }
      }
      this.infoForm.parentId = p
      this.infoForm.type = this.type
      this.infoForm.level = this.level
      sysApi.updatePermission(this.infoForm).then(res => {
        if (res.success) {
          this.$message('更新成功')
          this.visible = false
          // this.fingPermissions()
          // this.$router.go(0)
          this.reload()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //取消
    quxiao () {
      this.visible = false
    },
    edit (data) {
      this.visible = true
      this.editVisiable = true
      this.level = data.level
      this.findPermissionById(data.value.id || data.value)
    },
    // 添加和生成code
    addInfo () {
      this.$router.push({
        path: '/add-menu'
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
              // console.group(children[i].title)
              cc.push(...recursion(children2))
              // console.groupEnd(children[i].title)
            }
            c.push(
              { value: {title: children[i].title, id: children[i].id, level: children[i].level}.id, label: children[i].title, children: cc, level: children[i].level }
            )
          }
        } else {
          for (var j in children) {
            c.push({
              value: {title: children[j].title, id: children[j].id, level: children[j].level},
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
    //级联菜单改变的方法

    handleChange (value) {
      if (value && value.length > 1) {
        this.level = value[value.length - 1].level + 1
      }
      if (value.length === 0) {
        this.level = 0
      }
    },
    //  删除
    remove (data) {
      var ids = []
      if (data) {
        if (data.level < 3) {
            ids.push(data.value)
          } else if (data.level === 3) {
            ids.push(data.value.id)
          }
      } else {
        var nodes = this.$refs.tree.getCheckedNodes()
        for (let key in nodes) {
          if (nodes[key].level === 3) {
            ids.push(nodes[key].value.id)
          }
          if (nodes[key].level < 3) {
            ids.push(nodes[key].value)
          }
        }
        // for (let key in nodes) {
        //   if (nodes[key].level < 3) {
        //     ids.push(nodes[key].value)
        //   }
        // }
      }
      this.$confirm('确认删除吗?', '提示', {}).then(() => {
        sysApi.deletePermissionByIds(ids).then(res => {
          if (res.success) {
            this.$message(res.message)
            // this.fingPermissions()
            // this.$router.go(0)
            this.reload()
          } else {
            this.$message.error(res.message)
          }
        })
      })
      /*const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);*/
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
<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
.aside {
  width: 30%;
  margin-top: 20px;
  border: 1px solid #dcdfe6;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.btns {
  display: none;
}

.box {
  float: left;
  width: 65%;
  margin-left: 20px;
  height: 100%;
}

.right {
  float: left;
  width: 100%;
}

// #rh1 {
//     display: none;
// }

// #rh2 {
//     display: none;
// }

.el-form-item {
  margin-bottom: 20px;
}
.dialog-footer {
  text-align: center;
}
@media screen and(max-width: 415px) {
  .box {
    width: 95%;
    margin-left: 0;
  }
}
</style>
