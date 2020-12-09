<template>
  <!--为echarts准备一个具备大小的容器dom-->
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
    <el-row style="overflow: hidden;">
      <!--左侧-->
      <div class="aside"
           style="float:left;height: 700px;overflow: auto">
        <el-input v-model="filterText"
                  placeholder="输入关键字进行过滤">
        </el-input>
        <div>
          <!-- show-checkbox
                   check-strictly -->
          <el-tree class="filter-tree"
                   :data="data"
                   node-key="id"
                   default-expand-all
                   :filter-node-method="filterNode"
                   :expand-on-click-node="false"
                   ref="tree"
                   show-checkbox>
                   <!-- check-strictly> -->
            <span class="custom-tree-node"
                  slot-scope="{ node, data }"
                  @mouseover=mouseover(data,$event)
                  @mouseout=mouseleave(data,$event)>
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
                           placeholder="不选为顶级"
                           clearable
                           v-model="dictId"
                           :options="data1"
                           :show-all-levels="false"
                           :props="{checkStrictly: true}"
                           disabled="disabled"
                           @change="handleChange"></el-cascader>
            </el-form-item>
            <el-form-item label="数据名称"
                          prop="title"
                          :rules="[{required:true ,message:'请输入数据名称'}]">
              <el-input v-model="infoForm.title"
                        :readonly="!editVisiable?'readonly':false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="type"
                          prop="type"
                          :style="{display:!isChild?'':'none'}"
                          :rules="!isChild?[{required:true ,message:'请输入专业名称'}]:[]">
              <el-input v-model="infoForm.type"
                        :readonly="!editVisiable?'readonly':false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="value"
                          prop="value"
                          :style="{display:isChild?'':'none'}"
                          :rules="isChild?[{required:true ,message:'请输入value值'}]:[]">
              <el-input v-model="infoForm.value"
                        :readonly="!editVisiable?'readonly':false"
                        auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="排序"
                          prop="sortOrder">
              <el-input v-model="infoForm.sortOrder"
                        :readonly="!editVisiable?'readonly':false"
                        auto-complete="off"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="描述"
                          prop="description">
              <el-input type="textarea"
                        :readonly="!editVisiable?'readonly':false"
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
                         @click="updateDict"
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
    data (newValue) {
      for (let i in newValue) {
        // 只区父节点提供选择，已经是子节点的不能被选为父节点
        this.data1.push(
          { value: newValue[i].value, label: newValue[i].label }
        )
      }
    },
    // 树形结构过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  data () {
    return {
      isChild: false,
      show: true,
      filterText: '',
      data: [],
      data1: [],
      //查看信息
      infoForm: {
        title: '',
        dictId: '',
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
      dictId: [],
      addForm: {
        id: '',
        title: '',
        dictId: '',
        isMenu: '0',
        url: '',
        description: ''
      },
      node: [],
      nodeChild: []
    }
  },
  mounted () {
    this.findDicts()
  },
  methods: {

    //鼠标移入移出
    mouseleave (data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.style.display = 'none'
      $event.currentTarget.style.background = 'none'
    },
    mouseover (data, $event) {
      $event.currentTarget.firstElementChild.nextElementSibling.style.display = 'block'
      $event.currentTarget.style.background = '#ddd'
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    cha (data) {
      this.visible = true
      this.editVisiable = false
      if (this.nodeChild.indexOf(data) !== -1) {
        this.findChildDictById(data.value)
        this.isChild = true
      } else if (this.node.indexOf(data) !== -1) {
        this.findDictById(data.value)
        this.isChild = false
      }
    },
    findChildDictById (id) {
      sysApi.findChildDictById(id).then((res) => {
        if (res.success) {
          this.infoForm = res.result
          //将pId提取出来，是一个数组，用于回显
          let node = this.data
          //遍历
          //定义数组
          var dictId = []
          ok: for (var i in node) {
            if (this.infoForm.dictId === node[i].value) {
              dictId.push(node[i].value)
              break
            } else {
              let children = node[i].children
              if (children !== undefined && children.length !== 0) {
                for (var j in children) {
                  if (this.infoForm.dictId === children[j].value) {
                    dictId.push(node[i].value)
                    dictId.push(children[j].value)
                    break ok
                  } else {
                    let child = children[j].children
                    if (child !== undefined && child.length !== 0) {
                      for (var k in child) {
                        if (this.infoForm.dictId === child[k].value) {
                          dictId.push(node[i].value)
                          dictId.push(children[j].value)
                          dictId.push(child[k].value)
                          break ok
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          this.dictId = dictId
        } else {
          this.$message.error(res.message)
        }
      })
    },
    findDictById (id) {
      sysApi.findDictById(id).then((res) => {
        if (res.success) {
          this.infoForm = res.result
          // var p = this.infoForm
          //将pId提取出来，是一个数组，用于回显
          let node = this.data
          //遍历
          //定义数组
          var dictId = []
          ok: for (var i in node) {
            if (this.infoForm.dictId === node[i].value) {
              dictId.push(node[i].value)
              break
            } else {
              let children = node[i].children
              if (children !== undefined && children.length !== 0) {
                for (var j in children) {
                  if (this.infoForm.dictId === children[j].value) {
                    dictId.push(node[i].value)
                    dictId.push(children[j].value)
                    break ok
                  } else {
                    let child = children[j].children
                    if (child !== undefined && child.length !== 0) {
                      for (var k in child) {
                        if (this.infoForm.dictId === child[k].value) {
                          dictId.push(node[i].value)
                          dictId.push(children[j].value)
                          dictId.push(child[k].value)
                          break ok
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          this.dictId = dictId
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //更新权限
    updateDict () {
      var p
      //  提交
      if (this.dictId.length === 0) {
        p = '0'
        this.infoForm.dictId = p
        //  更新父级表单
        sysApi.updateDict(this.infoForm).then((res) => {
          if (res.success) {
            this.$message('父级更新成功')
            this.visible = false
            // this.findDicts()
            // this.$router.go(0)
            this.reload()
          } else {
            this.$message.error(res.message)
          }
        })
      } else {
        let pIds = this.dictId
        //取数组最后一个的值
        for (var key in pIds) {
          p = pIds[key]
        }
        this.infoForm.dictId = p
        //  更新子级表单
        sysApi.updateChildrenDict(this.infoForm).then((res) => {
          if (res.success) {
            this.$message('子级更新成功')
            this.visible = false
            // this.findDicts()
            // this.$router.go(0)
            this.reload()
          } else {
            this.$message.error(res.message)
          }
        })
      }
    },
    //取消
    quxiao () {
      this.visible = false
    },
    edit (data) {
      this.visible = true
      this.editVisiable = true
      if (this.nodeChild.indexOf(data) !== -1) {
        this.findChildDictById(data.value)
        this.isChild = true
      } else if (this.node.indexOf(data) !== -1) {
        this.findDictById(data.value)
        this.isChild = false
      }
    },
    // 添加和生成code
    addInfo () {
      this.$router.push({
        path: '/add-dict'
      })
    },
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
    //级联菜单改变的方法
    handleChange (value) {
    },
    //  删除
    remove (data) {
      var api = []
      var ids = []
      var cids = []
      var exceptIds = []
      // data为false是批量删除
      if (data) {
        if (this.nodeChild.indexOf(data) !== -1) {
          // console.log(data.label + '是子节点')
          cids.push(data.value)
        } else if (this.node.indexOf(data) !== -1) {
          // console.log(data.label + '是父节点')
          ids.push(data.value)
        }
        // ids.push(data.value)
      } else {
        // 不管批量删除
        // return
        var nodes = this.$refs.tree.getCheckedNodes()
        // console.log(nodes)
        for (let key in nodes) {
          if (this.nodeChild.indexOf(nodes[key]) !== -1) {
            // console.log(nodes[key].label + '是子节点')
            cids.push(nodes[key].value)
          }
          if (this.node.indexOf(nodes[key]) !== -1) {
            // console.log(nodes[key].label + '是父节点')
            ids.push(nodes[key].value)
            let child = nodes[key].children
            for (let k in child) {
              exceptIds.push(child[k].value)
            }
          }
        }
        for (let key = cids.length - 1; key >= 0; key--) {
          // 删除父节点时，取消其下子节点的删除
          if (exceptIds.indexOf(cids[key]) !== -1) {
            cids.splice(key, 1)
          }
        }
      }
      this.$confirm('确认删除吗?', '提示', {}).then(() => {
        if (cids.length !== 0) {
          api.push(sysApi.deleteChildrenDictByIds(cids))
        }
        if (ids.length !== 0) {
          api.push(sysApi.deleteDictByIds(ids))
        }
        Promise.all(api).then((res) => {
          if (res[0].success) {
            this.$message(res[0].message)
            this.reload()
            // this.findDicts()
            // this.$router.go(0)
          } else {
            this.$message.error(res[0].message)
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
//     /*display: none;*/
// }

// #rh2 {
//     /*display: none;*/
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
