<template>
  <div style="width: 100%">
    <!--编写页面静态部分，即view部分-->
    <div class="top">
      <el-form :inline="true"
               :model="user"
               class="demo-form-inline"
               label-suffix=":">
        <el-form-item label="用户名">
          <el-input v-model="user.username"
                    placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     v-on:click="query2"
                     icon="el-icon-search"
                     style="margin-left: 10px">查询</el-button>
          <el-button size="small"
                     v-on:click="resetQuery"
                     icon="el-icon-refresh">重置</el-button>
          <el-button size="small"
                     type="success"
                     @click="add"
                     icon="el-icon-edit">新增用户</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topRow">
      <el-table :data="list"
                fix="right"
                stripe
                border
                :cell-style="cellStyle"
                :header-cell-style="rowClass"
                width="100%">
        <el-table-column type="index"
                         label="序号"
                         width="60"
                         fixed>
        </el-table-column>
        <el-table-column prop="username"
                         width="80"
                         label="用户名"> </el-table-column>
        <el-table-column prop="nickName"
                         width="80"
                         label="姓名"> </el-table-column>
        <el-table-column prop="mobile"
                         width="140"
                         label="电话"> </el-table-column>
        <el-table-column prop="sex"
                         width="60"
                         label="性别">
          <!-- :formatter="formatSex" -->
        </el-table-column>
        <el-table-column prop="departmentTitle"
                         width="180"
                         label="部门">
          <template slot-scope="scope">
            <el-cascader style="width: 100%;"
                           v-model="scope.row.department1s"
                           placeholder="未添加部门"
                           :options="departments"
                           :show-all-levels="false"
                           :props="{ checkStrictly: true, emitPath: false}"
                           disabled></el-cascader>
          </template>
        </el-table-column>
        <el-table-column prop="role"
                         width="180"
                         label="角色">
          <template slot-scope="scope">
            {{getRolesByIds(scope.row.roles)}}
            <!-- <el-select v-model="scope.row.roles"
                       placeholder="未登记角色"
                       multiple
                       value-key="id"
                       disabled
                       style="width: 100% ">
              <el-option v-for="item in roles"
                         :key="item.id"
                         :label="item.description"
                         :value="item">
              </el-option>
            </el-select> -->
          </template>
        </el-table-column>

        <el-table-column prop="type"
                         label="职位"
                         width="80"
                         :formatter="formattype">
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="80"
                         :formatter="formatStatus">
        </el-table-column>
        <el-table-column prop="jobNumber"
                         width="100"
                         label="工号">
        </el-table-column>
        <el-table-column prop="updateTime"
                         width="180"
                         label="上次修改时间">
        </el-table-column>
        <el-table-column prop="createTime"
                         width="180"
                         label="创建时间"> </el-table-column>
        <el-table-column prop="email"
                         width="160"
                         label="Email"> </el-table-column>
        <el-table-column label="操作"
                         width="180px"
                         fixed="right">
          <template slot-scope="scope">
            <!-- <span :style="((scope.row.role.id==1||scope.row.role.id==2)&&activeUser.utype=='1')||(scope.row.role.id!=1&&scope.row.role.id!=2 )?'display:inline':'display:none'"> -->
            <el-button size="mini"
                       @click="() => handleLook(scope.$index, scope.row)">
              查看
            </el-button>
            <el-button size="mini"
                       @click="() => handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <!-- <el-button v-if="scope.row.status==='1'"
                              size="mini"
                              :type="scope.row.status==='1'?'danger':'primary'"
                              @click="handleDelete(scope.$index, scope.row)">停用
                    </el-button>
                   <el-button v-else-if="scope.row.status==='0'"
                              size="mini"
                              :type="scope.row.status==='1'?'danger':'primary'"
                              @click="handleDelete(scope.$index, scope.row)">启用
                    </el-button> -->
            <!-- </span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination layout="total, sizes, prev, pager, next, jumper"
                       :total="total"
                       background
                       :page-size="params.size"
                       :page-sizes="[10, 20, 30, 40]"
                       :current-page="params.page"
                       v-on:current-change="changePage"
                       @size-change="handleSizeChange"
                       style="float:right">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
/*编写页面静态部分，即model及vm部分。*/
/*导入js*/
import * as sysApi from '../../api/sys'
//首先引入Vue 否则无法使用
// import Vue from 'vue'

export default {
  data () {
    return {
      list: [],
      total: 0,
      params: {
        page: 1,
        size: 10
      },
      tubulation: {
        objectXyList: [
          { x: 1, y: 2 },
          { x: 2, y: 3 }
        ]
      },
      activeUser: {},
      user: {
        username: ''
      },
      departments: [{ id: '', name: '' }],
      roles: [{ id: '', roleName: '' }],

      options: [
        {
          value: '0',
          label: '停用'
        },
        {
          value: '1',
          label: '在用'
        }
      ],
      sexoptions: [
        {
          value: '0',
          label: '女'
        },
        {
          value: '1',
          label: '男'
        }
      ],

      value4: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  mounted () {
    this.findRoles()
    // this.findCompanies()
    this.findDepartments()
  },
  methods: {
    //查找所有角色
    findRoles: function () {
      sysApi.findRoles().then(res => {
        if (res.success) {
          this.roles = res.result.content
        }
      })
    },
    getRolesByIds (roles) {
      if (roles && roles.length > 0) {
        let names = ''
        let ids = []
        for (let i in roles) {
          ids.push(roles[i].id)
        }
        for (let i in this.roles) {
          if (ids.indexOf(this.roles[i].id) !== -1) {
            names += this.roles[i].description + ','
          }
        }
        return names.slice(0,-1)
      } else {
        return ''
      }
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
          let list = res.result
          this.departments = recursion(list)
        }
      })
    },
    findActiveUser () {
      this.activeUser = this.getActiveUser()
    },
    //table居中
    cellStyle: function () {
      return 'text-align:center'
    },
    //每一行居中
    rowClass: function () {
      return 'text-align:center'
    },
    //格式化性别
    // formatSex: function (row, column) {
    //   return row.sex === '1' ? '男' : row.sex === '0' ? '女' : '未知'
    // },
    //格式化状态
    formatStatus: function (row, column) {
      return row.status === 0 ? '在用' : row.status === 1 ? '停用' : '未知'
    },
    //格式化用户类型
    formattype: function (row, column) {
      return row.type === '1'
        ? '管理员'
        : row.type === '0'
          ? '普通用户'
          : '员工'
    },
    //改变页数
    handleSizeChange (val) {
      this.params.size = val
      this.query()
    },
    query2: function () {
      this.params.page = 1
      this.query()
    },
    //列表查询
    query: function () {
      //调用服务端的接口
      sysApi
        .getUserList(this.params.page, this.params.size, this.user)
        .then(res => {
          if (res.success) {
            this.list = res.result.content
            this.total = res.result.totalElements
            for (let i in this.list) {
              if (this.list[i].department1s && this.list[i].department1s.length !== 0) {
                this.list[i].department1s = this.list[i].department1s[0].id
              }
            }
          }
        })
    },
    changePage: function (page) {
      //形参就是当前页码
      //调用query方法
      this.params.page = page
      this.query()
    },

    //跳转至用户
    add: function () {
      this.$router.push({
        path: '/add-user'
      })
    },
    //跳转至查看
    handleLook: function (index, row) {
      this.$router.push({
        path: '/user-details',
        //get请求查询
        query: {
          id: row.id
        }
      })
    },
    //跳转至编辑
    handleEdit: function (index, row) {
      this.$router.push({
        path: '/edit-user',
        //get请求查询
        query: {
          id: row.id
        }
      })
    },
    //   handleDelete: function (index, row) {
    //     // alert(row.id);
    //     var msg;
    //     if (row.status === '1') {
    //       msg = '确认停用？'
    //     } else if (row.status === '0') {
    //       msg = '确认启用？'
    //     }
    //     this.$confirm(msg)
    //       .then(_ => {
    //         sysApi.deleteById(row.id).then((res) => {
    //           if (res.success) {
    //             this.$message({
    //               message: '操作成功',
    //               type: 'success'
    //             });
    //             this.query()
    //           } else {
    //             this.$message.error({
    //               message: '操作失败'
    //             });
    //           }
    //         })
    //       })
    //   },
    resetQuery: function (uid) {
      this.user = { name: '', status: '' }
      this.query()
    }
  },
  created () {
    //当DOM元素渲染完成后调用query
    this.query()
    this.findActiveUser()
    var _this = this;
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 13) {
        _this.query()
      }
    }
  }
}
</script>
<style>
/*编写页面样式，不是必须*/
.block {
  float: right;
  margin-top: 20px;
}

.top {
  margin-top: 20px;
}
.topRow {
  margin-right: 10px;
  margin-top: 10px;
  margin-bottom: 150px;
}
</style>
