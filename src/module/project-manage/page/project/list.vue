<template>
  <div>
		<el-form :model="queryParam"
             ref="queryForm"
             :inline="true">
      <el-form-item label="项目名称：">
        <el-input v-model="queryParam.itemTitle" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <router-link :to="{path:'/project/edit'}"
                     class="link-left">
          <el-button type="success" size="mini">新增项目</el-button>
        </router-link>&nbsp;
        <el-button @click="output('#projectTable','项目汇总表格')"
                   size="mini"
                   type="success">导出成excel</el-button>&nbsp;
				<!-- <el-button size="mini"
  	               type="danger"
  	               @click="delByIds"
  	               class="link-left">删除</el-button> -->
        <router-link :to="{path:'/engineer'}">
          <el-button type="primary" size="mini">设置总工</el-button>
        </router-link>
      </el-form-item>
    </el-form>
		<projectTable id="projectTable" :tableData="projects" :tableHead="itemHead">
      <el-table-column label="操作"
                       fixed="right"
                       align="center"
                       width="260px">
        <template slot-scope="{row}">
          <el-popover placement="bottom"
                      trigger="click">
            <el-button type="warning"
                       size="mini"
                       @click="$router.push({path:'/project/input',query:{id:row.id,type:'section'}})">导入标段
            </el-button>
            <el-button type="warning"
                       size="mini"
                       @click="$router.push({path:'/project/input',query:{id:row.id,type:'bridge'}})">导入桥梁
            </el-button>
            <el-button slot="reference"
                       type="success"
                       style="margin-right:10px;"
                       size="mini">excel导入</el-button>
          </el-popover>
  	      <el-button size="mini"
  	                 type="warning"
  	                 @click="$router.push({path:'/project/edit',query:{id:row.id}})">编辑</el-button>
  	      <el-button size="mini"
  	                 type="danger"
  	                 @click="delByIds([row.id])"
  	                 class="link-left">删除</el-button>
        </template>
      </el-table-column>
    </projectTable>
    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParam.pageNumber"
                :limit.sync="queryParam.pageSize" />
  </div>
</template>

<script>
import * as projectApi from '@/module/project-manage/api/project'
import { mapGetters, mapState, mapActions } from 'vuex'
import { formatSeconds,parseTime } from '@/utils'
import projectTable from '@/module/project-manage/page/components/table'
import Pagination from '@/components/Pagination'

export default {
	inject: ['reload'],
  components: { Pagination,projectTable,},
  data () {
    return {
			listLoading: false,
			// 项目的表头
      itemHead: {
        itemTitle: {
          label: '项目名称',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        origin: {
          label: '起点',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        terminus: {
          label: '终点',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        specialId: {
          label: '专册',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userformatter,
          overflow: true
        },
        engineerId: {
          label: '总工',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userformatter,
          overflow: true
        },
        disDirectors: {
          label: '配施人员',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userformatter,
          overflow: true
        },
        buildUnit: {
          label: '建设单位',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        startTime: {
          label: '开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
        endTime: {
          label: '竣工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
        comment: {
          label: '备注',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
      },
			queryParam: {
        id: null,
        itemTitle: '',
        pageNumber: 1,
				pageSize: 10
			},
    }
  },
  created () {
		this.initUsers()
		this.initUserList()
		this.initProjectsByParam(this.queryParam)
  },
  methods: {
		delByIds (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				projectApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
			})
		},
		userformatter: function (row, column, cellValue, index) {
      let arr = []
      let ret = ''
      if (cellValue instanceof Array) {
        arr = cellValue
      } else if (typeof cellValue == 'string') {
        arr = cellValue.split(',')
      } else arr = []
      for (let i in arr) {
        ret += this.usersEnumFormat(arr[i])+','
      }
      return ret.substr(0,ret.length-1)
    },
    timeFormat (row, column, cellValue, index) {
      var r = new RegExp(/^\d{4}\-\d{2}\-\d{2}$/)
      if (r.test((cellValue+'').slice(0,10))) {
        return (cellValue+'').slice(0,10)
      }
      else if(cellValue) return parseTime(cellValue).slice(0,10)
      else return cellValue
      // var time = new Date(cellValue)
      // function add0(m){
      //   return m<10?'0'+m:m
      // }
      // return time.getFullYear()+'-'+add0(time.getMonth()+1)+'-'+add0(time.getDate())+' '+add0(time.getHours())+':'+add0(time.getMinutes())+':'+add0(time.getSeconds())
    },
    ...mapActions('user', { initUsers: 'initUsers' }),
    ...mapActions('project', { initUserList: 'initUsers' }),
    ...mapActions('project', { initProjectsByParam: 'initProjectsByParam' }),
  },
  computed: {
    // 桥梁的表格数据
		...mapState('project', { projects: state => state.projects }),
    ...mapState('project', { total: state => state.total }),
		// 格式化
    ...mapGetters('user', ['usersEnumFormat']),
	},
	watch: {
    queryParam: {
      deep:true,
      handler (val) {
        this.initProjectsByParam(val)
      }
    },
	}
}
</script>
