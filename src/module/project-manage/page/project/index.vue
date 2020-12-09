<template>
<div id="project">
  <h1 style="width:100%;text-align:center;">{{name}}</h1>
  <el-row>
    <el-col :span="2">
      项目详情：
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm :disabled="true" :list="list" :labelWidth="80"></projectForm>
    </el-col>
    <el-col :span="7" style="padding-top:10px;">
      项目资料：
      <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/project/file',query:{itemId:id,itemTitle:name}})">上传资料</el-button>
      <el-button @click="output('#fileTable','项目文件汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="15" style="padding-top:10px;">
      <el-form inline  size="mini" :model="fileForm" label-suffix="：">
        <el-form-item label="文件名">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="fileForm.oldName"
                    placeholder="文件名"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectTable id="fileTable" :tableData="files" :tableHead="fileHead">
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         width="200px">
          <template slot-scope="{row}">
            <el-button size="mini"
                       type="text"
                       @click="handlePreview(row)">查看</el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDownload(row)"
                       class="link-left">下载</el-button>
            <el-button size="mini"
                       type="text"
                       @click="delFile([row.id])"
                       class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </projectTable>
      <pagination v-show="filesTotal>0"
                  :total="filesTotal"
                  :page.sync="fileForm.pageNumber"
                  :limit.sync="fileForm.pageSize"
                  @pagination="initFiles()" />
    </el-col>
    <el-col :span="7" style="padding-top:10px;">
      标段列表：
      <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/section/edit',query:{itemId:id}})">添加标段</el-button>
      <el-button @click="output('#sectionTable',name+'-标段汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="15" style="padding-top:10px;">
      <el-form inline  size="mini" :model="sectionForm" label-suffix="：">
        <el-form-item label="标段名">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="sectionForm.sectionTitle"
                    placeholder="标段名"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectTable id="sectionTable" :tableData="sections" :tableHead="sectionHead">
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         width="230px">
          <template slot-scope="{row}">
            <el-button size="mini"
                       @click="$router.push({path:'/section',query:{id:row.id,name:row.sectionTitle}})">详情</el-button>
            <el-button size="mini"
                       type="warning"
                       v-if="row.delFlag!==1"
                       @click="$router.push({path:'/section/edit',query:{id:row.id}})">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       v-if="row.delFlag!==1"
                       @click="delSection([row.id])"
                       class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </projectTable>
      <pagination v-show="sectionsTotal>0"
                  :total="sectionsTotal"
                  :page.sync="sectionForm.pageNumber"
                  :limit.sync="sectionForm.pageSize"
                  @pagination="initSectionsByParam(sectionForm)" />
    </el-col>
    <el-col :span="4" style="padding-top:10px;">
      桥梁列表：
      <!-- <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/bridge/edit',query:{itemId:id}})">添加桥梁</el-button> -->
      <el-button @click="output('#bridgeTable',name+'-桥梁汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="18" style="padding-top:10px;">
      <el-form inline  size="mini" :model="bridgeForm" label-suffix="：">
        <el-form-item label="桥梁名">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="bridgeForm.bridgeTitle"
                    placeholder="桥梁名"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectTable id="bridgeTable" :tableData="bridges" :tableHead="bridgeHead">
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         width="230px">
          <template slot-scope="{row}">
            <el-button size="mini"
                       @click="$router.push({path:'/bridge',query:{id:row.id,name:row.bridgeTitle}})">详情</el-button>
            <el-button size="mini"
                       type="warning"
                       @click="$router.push({path:'/bridge/edit',query:{id:row.id}})">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="delBridge([row.id])"
                       class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </projectTable>
      <pagination v-show="bridgesTotal>0"
                  :total="bridgesTotal"
                  :page.sync="bridgeForm.pageNumber"
                  :limit.sync="bridgeForm.pageSize"
                  @pagination="initBridges(bridgeForm)" />
    </el-col>
  </el-row>
    <el-image-viewer 
      v-if="isshow"
      :on-close="handleClose" 
      :url-list="[imgUrl]" />
</div>
</template>

<script>
import * as fileApi from '@/module/project-manage/api/fileApi'
import * as sectionApi from '@/module/project-manage/api/section'
import * as bridgeApi from '@/module/project-manage/api/bridge'
import projectForm from '@/module/project-manage/page/components/form'
import projectTable from '@/module/project-manage/page/components/table'
import { mapGetters, mapState, mapActions } from 'vuex'
import Pagination from '@/components/Pagination'
import { formatSeconds,parseTime } from '@/utils'
const ElImageViewer  = () => import('element-ui/packages/image/src/image-viewer')
export default {
  inject: ['reload'],
  components: {projectForm,projectTable,Pagination,ElImageViewer},
  data () {
    return {
      name: null,
      id: null,
      files: [],
      // 文件的表头
      fileHead: {
        // newName: {
        //   label: '存储文件名',
        //   sortable: true,
        //   width: '115px',
        //   minWidth: null,
        //   fixed: false,
        //   formatter: null,
        //   overflow: true
        // },
        oldName: {
          label: '文件名',
          sortable: true,
          width: null,
          minWidth: null,
          fixed: false,
          formatter: null,
          overflow: true
        },
        bridgeId: {
          label: '桥梁名称',
          sortable: true,
          width: null,
          minWidth: null,
          fixed: false,
          formatter: ()=>{return this.name},
          overflow: true
        },
        size: {
          label: '文件大小',
          sortable: true,
          width: null,
          minWidth: null,
          fixed: false,
          formatter: this.sizeFormat,
          overflow: false
        },
        type: {
          label: '文件类型',
          sortable: true,
          width: null,
          minWidth: null,
          fixed: false,
          overflow: false
        },
        createBy: {
          label: '上传用户',
          sortable: true,
          width: null,
          minWidth: null,
          fixed: false,
          formatter: this.userFormat,
          overflow: false
        },
        createTime: {
          label: '上传时间',
          sortable: true,
          width: '105px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
      },
      imgUrl: '',
      isshow:false,
      filesTotal:0,
      fileForm:{
        oldName:null,
        pageNumber: 1,
				pageSize: 5
      },
      // 标段的表头
      sectionHead: {
        sectionTitle: {
          label: '标段名称',
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
        constructionUnit: {
          label: '施工单位',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        supervisorUnit: {
          label: '监理单位',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        disDirectors: {
          label: '配施人员',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userFormat,
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
			sectionForm: {
        sectionTitle: null,
        pageNumber: 1,
				pageSize: 5
      },
      // 桥梁的表头
      bridgeHead: {
        bridgeNumber: {
          label: '桥号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        bridgeGroup: {
          label: '分类',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.groupFormat,
          overflow: false
        },
        sectionId: {
          label: '标段',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.sectionFormat,
          overflow: true
        },
        bridgeTitle: {
          label: '桥梁名称',
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
        designId: {
          label: '设计者',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userFormat,
          overflow: true
        },
        reviewId: {
          label: '复核者',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userFormat,
          overflow: true
        },
        disDirector: {
          label: '配施负责人',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.userFormat,
          overflow: true
        },
        planStartTime: {
          label: '计划开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
        planEndTime: {
          label: '计划完工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
        actualStartTime: {
          label: '实际开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: false
        },
        actualEndTime: {
          label: '实际完工日期',
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
			bridgeForm: {
        bridgeTitle: null,
        pageNumber: 1,
				pageSize: 5
      },
    }
  },
  mounted() {
    this.initUsers()
  },
  computed: {
    // 格式化
    ...mapGetters('user', ['usersEnumFormat']),
    ...mapGetters('section', { sectionEnumFormat: 'sectionEnumFormat' }),
    // 获取
    ...mapState('user', { users: state => state.users }),
    // 项目详情数据---二
    ...mapState('project', { list: state => state.list }),
    // 标段的表格数据
    ...mapState('section', { allSections: state => state.allSections }),
    ...mapState('section', { sections: state => state.sections }),
    ...mapState('section', { sectionsTotal: state => state.total }),
    // 桥梁的表格数据
    ...mapState('bridge', { bridges: state => state.bridges }),
    ...mapState('bridge', { bridgesTotal: state => state.total }),
  },
  methods: {
		delSection (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				sectionApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
			})
		},
		delBridge (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				bridgeApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
			})
		},
    delFile (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				fileApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
			})
		},
    handlePreview (row) {
      var list = ['pdf', 'doc', 'docx','jpg','jpeg','png','gif']
      if (list.indexOf(row.type.toLowerCase())!==-1)
      fileApi.preview(row.id).then(res => {
        const content = res
        const blob = new Blob([content])
        let fileName = row.oldName + '.' + row.type
        // 图片文件，用弹窗预览
        if (row.type.toLowerCase() === 'jpg' || row.type.toLowerCase() === 'png' || row.type.toLowerCase() === 'gif') {
          this.isshow = true
          this.imgUrl = URL.createObjectURL(blob)
        }
        // word文档
        // pdf文件用iframe预览
        else if (row.type === 'pdf' || row.type === 'doc' || row.type === 'docx') {
          const blob1 = new Blob([content], {
            type: 'application/pdf;chartset=UTF-8'
          })
          let imgUrl = URL.createObjectURL(blob1)
          window.open(imgUrl)
          this.isPdf = true
        }
        // // 其他文件，不预览直接下载
        // else {
        //   this.$message.error('该文件类型不支持查看')
        //   if ('download' in document.createElement('a')) { // 非IE下载
        //     const elink = document.createElement('a')
        //     elink.download = fileName
        //     elink.style.display = 'none'
        //     elink.href = URL.createObjectURL(blob)
        //     document.body.appendChild(elink)
        //     elink.click()
        //     URL.revokeObjectURL(elink.href) // 释放URL 对象
        //     document.body.removeChild(elink)
        //   } else { // IE10+下载
        //     navigator.msSaveBlob(blob, fileName)
        //   }
        // }
      })
      else this.$message.error('该文件类型不支持查看')
    },
    handleDownload (row) {
      fileApi.fileDownload(row.id).then(res => {
        const content = res
        const blob = new Blob([content])
        let fileName = row.oldName + '.' + row.type
        if ('download' in document.createElement('a')) { // 非IE下载
          this.isPDF = false
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    },
    handleClose () {
      this.isshow = false
    },
    initFiles () {
      var that = this
      fileApi.getByCondition(this.fileForm).then(res=>{
        if(res.success) {
          that.files = res.result.content
          that.filesTotal = res.result.totalElements
        }
      })
    },
    sizeFormat (row, column, cellValue, index) {
      function renderSize(value){
        if(null==value||value==''){
          return "0 Bytes";
        }
        var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
        var index=0;
        var srcsize = parseFloat(value);
        index=Math.floor(Math.log(srcsize)/Math.log(1024));
        var size =srcsize/Math.pow(1024,index);
        size=size.toFixed(2);//保留的小数位数
        return size+unitArr[index];
      }
      return renderSize(cellValue)
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
    userFormat (row, column, cellValue, index) {
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
    groupFormat (row, column, cellValue, index) {
      switch(cellValue) {
        case '1':return '正线单线桥'
        case '2':return '正线双线桥'
      }
    },
    sectionFormat (row, column, cellValue, index) {
      return this.sectionEnumFormat(cellValue)
    },
    // 初始化
    ...mapActions('user', { initUsers: 'initUsers' }),
    // ---一
    ...mapActions('project', { initUserList: 'initUsers' }),
    ...mapActions('project', { initList: 'initList' }),
    ...mapActions('section', { initSections: 'initSections' }),
    ...mapActions('section', { initSectionUser: 'initUsers' }),
    ...mapActions('section', { initSectionsByParam: 'initSectionsByParam' }),
    ...mapActions('bridge', { initBridges: 'initBridgesByParam' }),
  },
  watch: {
    $route: {
      deep:true,
      immediate:true,
      handler (val) {
        this.name = val.query.name
        this.id = val.query.id
        this.initUserList(this.id)
        this.initSectionUser()
        this.initList({id:this.id})
        this.sectionForm.itemId = this.id
        var _this = this
        this.initSections(this.id)
        this.initSectionsByParam(this.sectionForm)
        this.bridgeForm.itemId = this.id
        this.initBridges(this.bridgeForm)
        this.fileForm.parentId = this.id
        this.initFiles()
      }
    },
    fileForm: {
      deep:true,
      handler (val) {
        this.initFiles()
      }
    },
    sectionForm: {
      deep:true,
      handler (val) {
        this.initSectionsByParam(val)
      }
    },
    bridgeForm: {
      deep:true,
      handler (val) {
        this.initBridges(val)
      }
    }
  }
}
</script>

<style>
#project .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0;
}
</style>