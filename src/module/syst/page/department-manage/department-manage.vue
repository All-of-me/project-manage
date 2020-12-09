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
      <el-col :span="7" class="aside"
           style="height: 700px;overflow: auto">
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
      </el-col>
      <!--查看-->
      <el-col :offset="1" :span="15" class="box">
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
            <el-form-item label="父部门">
              <el-cascader style="width: 100%;"
                           placeholder="不选为最高部门"
                           clearable
                           v-model="infoForm.parentId"
                           :options="data"
                           :show-all-levels="false"
                           :props="{ checkStrictly: true, emitPath: false }"
                           :disabled="!editVisiable ? 'disabled' : false"
                           @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="部门名称"
                          prop="title"
                          :rules="[{ required: true, message: '请输入部门名称' }]">
              <el-input v-model="infoForm.title"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序"
                          prop="sortOrder"
                          :rules="[{ required: false, message: '请输入排序' }]">
              <el-input v-model="infoForm.sortOrder"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门成员"
                          prop="userChildren">
              <!-- <el-input v-model="infoForm.userChildren"
                        :readonly="!editVisiable ? 'readonly' : false"
                        auto-complete="off"></el-input> -->
              <el-select v-model="infoForm.userChildren"
                         value-key="id"
                         :disabled="!editVisiable ? 'disabled' : false"
                         filterable
                         default-first-option
                         multiple
                         style="width:100%"
                         placeholder="请选择">
                <el-option v-for="item in user"
                           :key="item.id"
                           :label="item.nickName+'('+item.jobNumber+')'"
                           :value="item">
                           <span style="float: left;width:200px;">{{ item.nickName }}</span>
                           <span style="float: left; color: #8492a6; font-size: 13px">{{ item.jobNumber }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="描述"
                          prop="description">
              <el-input type="textarea"
                        :readonly="!editVisiable ? 'readonly' : false"
                        v-model="infoForm.description"
                        auto-complete="off"></el-input>
            </el-form-item> -->
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
                         @click="updateDepartment"
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
      </el-col>
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
      user: [],
      filterText: '',
      data: [],
      //查看信息
      infoForm: {
        id: '',
        title: '',
        parentId: '',
        description: '',
        sortOrder: '',
        departmentChildren: [],
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      },
      visible: false,
      addLoading: false,
      editVisiable: false,
      //新增界面数据
      pId: []
    }
  },
  mounted () {
    this.findDepartments()
    this.findAllUser()
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
      this.findDepartmentById(data.value)
    },
    findDepartmentById (id) {
      sysApi.findDepartmentById(id).then(res => {
        if (res.success) {
          this.infoForm = res.result
          //将pId提取出来，是一个数组，用于回显
          // let node = this.data
          // //遍历
          // //定义数组
          // var pId = []
          // ok: for (var i in node) {
          //   if (this.infoForm.parentId === node[i].value) {
          //     pId.push(node[i].value)
          //     break
          //   } else {
          //     let children = node[i].children
          //     if (children !== undefined && children.length !== 0) {
          //       for (var j in children) {
          //         if (this.infoForm.parentId === children[j].value) {
          //           pId.push(node[i].value)
          //           pId.push(children[j].value)
          //           break ok
          //         } else {
          //           let child = children[j].children
          //           if (child !== undefined && child.length !== 0) {
          //             for (var k in child) {
          //               if (this.infoForm.parentId === child[k].value) {
          //                 pId.push(node[i].value)
          //                 pId.push(children[j].value)
          //                 pId.push(child[k].value)
          //                 break ok
          //               }
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
          // this.pId = pId
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //更新权限
    updateDepartment () {
      //  提交
      let userChildren = this.infoForm.userChildren
      for (let i in userChildren) {
        userChildren[i].userId = userChildren[i].id
        userChildren[i].jobTitle = Math.random() + ''
      }
      if (!this.infoForm.parentId) {
        this.infoForm.parentId = '0'
      }
      this.infoForm.userDepartmentChildren = userChildren
      sysApi.updateDepartment(this.infoForm).then(res => {
        if (res.success) {
          this.$message('更新成功')
          this.visible = false
          // this.findDepartments()
          // this.$router.go(0)
          this.reload()
        } else {
          this.$message.error(res.message)
        }
      })
    },
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
    //取消
    quxiao () {
      this.visible = false
    },
    edit (data) {
      this.visible = true
      this.editVisiable = true
      this.findDepartmentById(data.value)
    },
    // 添加和生成code
    addInfo () {
      this.$router.push({
        path: '/add-depa'
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
            // console.group(children[i].title)
            cc.push(...recursion(children2))
            // console.groupEnd(children[i].title)
          }
          c.push(
            { value: children[i].id, label: children[i].title, children: cc }
            // { value: {title: children[i].title, id: children[i].id, level: children[i].level}.id, label: children[i].title, children: cc, level: children[i].level }
          )
        }
        // } else {
        //   for (var j in children) {
        //     c.push({
        //       value: {title: children[j].title, id: children[j].id, level: children[j].level},
        //       label: children[j].title,
        //       isleaf: true,
        //       level: children[j].level
        //     })
        //   }
        // }
        return c
      }
      sysApi.findDepartments().then((res) => {
        if (res.success) {
          let list = res.result
          this.data = recursion(list)
        }
      })
    },
    //级联菜单改变的方法

    handleChange (value) {
    },
    //  删除
    remove (data) {
      var ids = []
      if (data) {
        ids.push(data.value)
      } else {
        var nodes = this.$refs.tree.getCheckedNodes()
        for (let key in nodes) {
          ids.push(nodes[key].value)
        }
      }
      this.$confirm('确认删除吗?', '提示', {}).then(() => {
        sysApi.deleteDepartmentByIds(ids).then(res => {
          if (res.success) {
            this.$message(res.message)
            // this.findDepartments()
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
