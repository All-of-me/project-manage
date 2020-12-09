<template>
<div id="bridge">
  <h1 style="width:100%;text-align:center;">{{name}}</h1>
  <el-row>
    <el-col :span="2">
      桥梁详情：
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectForm :list="list" :disabled="true"></projectForm>
    </el-col>
    <el-col :span="9" style="padding-top:10px;">
      桥梁资料：
      <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/bridge/file',query:{bridgeId:id,bridgeTitle:name}})">上传资料</el-button>
      <el-button @click="output('#fileTable',name+'-桥梁文件汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="15" style="padding-top:10px;" class="search">
      <el-form inline  size="mini" :model="fileForm" label-suffix="：">
        <el-form-item label="文件名">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="fileForm.oldName"
                    placeholder="文件名"/>
        </el-form-item>
        <el-form-item label="文件类型:">
          <el-select v-model="fileForm.fileGroupList" multiple clearable>
            <el-option v-for="item in fileGroupList"
                       :key="item.key"
                       :value="item.key"
                       :label="item.label"></el-option>
          </el-select>
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
    <el-col :span="9" style="padding-top:10px;">
      桥墩列表：
      <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/pier/edit',query:{bridgeId:id,itemId:list.itemId.value,sectionId:list.sectionId.value}})">添加桥墩</el-button>
      <el-button type="warning"
                 size="mini"
                 @click="$router.push({path:'/project/input',query:{id:list.itemId.value,bridgeId:id,type:'pier'}})">导入桥墩</el-button>
      <el-button @click="output('#pierTable',name+'桥墩汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="15" style="padding-top:10px;" class="search">
      <el-form inline  size="mini" :model="pierForm" label-suffix="：">
        <el-form-item label="图号">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="pierForm.figureNumber"
                    placeholder="图号"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectTable id="pierTable" :tableData="piers" :tableHead="pierHead">
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         width="200px">
          <template slot-scope="{row}">
            <el-button size="mini"
                       type="warning"
                       @click="$router.push({path:'/pier/edit',query:{id:row.id}})">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="delPier([row.id])"
                       class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </projectTable>
      <pagination v-show="piersTotal>0"
                  :total="piersTotal"
                  :page.sync="pierForm.pageNumber"
                  :limit.sync="pierForm.pageSize"
                  @pagination="initPiers(pierForm)" />
    </el-col>
    <el-col :span="9" style="padding-top:10px;">
      梁列表：
      <el-button size="mini"
                 type="success"
                 @click="$router.push({path:'/beam/edit',query:{bridgeId:id,itemId:list.itemId.value,sectionId:list.sectionId.value}})">添加梁</el-button>
      <el-button type="warning"
                 size="mini"
                 @click="$router.push({path:'/project/input',query:{id:list.itemId.value,bridgeId:id,type:'beam'}})">导入梁</el-button>
      <el-button @click="output('#beamTable',name+'-梁汇总表格')"
                 size="mini"
                 type="success">导出成excel</el-button>
    </el-col>
    <el-col :span="15" style="padding-top:10px;" class="search">
      <el-form inline  size="mini" :model="beamForm" label-suffix="：">
        <el-form-item label="图号">
          <el-input style="width:auto;margin-right: 15px;"
                    v-model="beamForm.figureNumber"
                    placeholder="图号"/>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="22" :offset="1" style="border:1px solid #ccc;padding:10px;margin-top:10px;">
      <projectTable id="beamTable" :tableData="beams" :tableHead="beamHead">
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         width="200px">
          <template slot-scope="{row}">
            <el-button size="mini"
                       type="warning"
                       @click="$router.push({path:'/beam/edit',query:{id:row.id}})">编辑</el-button>
            <el-button size="mini"
                       type="danger"
                       @click="delBeam([row.id])"
                       class="link-left">删除</el-button>
          </template>
        </el-table-column>
      </projectTable>
      <pagination v-show="beamsTotal>0"
                  :total="beamsTotal"
                  :page.sync="beamForm.pageNumber"
                  :limit.sync="beamForm.pageSize"
                  @pagination="initBeams(beamForm)" />
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
import * as pierApi from '@/module/project-manage/api/pier'
import * as beamApi from '@/module/project-manage/api/beam'
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
        fileGroup: {
          label: '文件种类',
          sortable: true,
          width: null,
          minWidth: null,
          formatter: this.groupFormat,
          fixed: false,
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
      // 墩的表头
      pierHead: {
        pierNumber: {
          label: '墩号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        mileage: {
          label: '里程',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        coordinates: {
          label: '坐标',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        pierHigh: {
          label: '墩高',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        figureNumber: {
          label: '图号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        pierShape: {
          label: '墩形',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.shapeFormat,
          overflow: true
        },
        planStartTime: {
          label: '计划开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        planEndTime: {
          label: '计划完工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        actualStartTime: {
          label: '实际开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        actualEndTime: {
          label: '实际完工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        basicGroup: {
          label: '基础类型',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.basicGroupFormat,
          overflow: true
        },
        projectState: {
          label: '工程数据',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        threeD: {
          label: '3d',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        comment: {
          label: '备注',
          sortable: false,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: false
        },
      },
      pierForm:{
        figureNumber:null,
        pageNumber: 1,
				pageSize: 5
      },
      // 梁的表头
      beamHead: {
        serialNumber: {
          label: '编号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        figureNumber: {
          label: '图号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        firstPierNumber: {
          label: '起点墩号',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        judgeParclose: {
          label: '有无声屏障',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: this.judgeFormat,
          overflow: true
        },
        planStartTime: {
          label: '计划开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        planEndTime: {
          label: '计划完工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        actualStartTime: {
          label: '实际开工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        actualEndTime: {
          label: '实际完工日期',
          sortable: true,
          width: '100px',
          minWidth: null,
          fixed: false,
          formatter: this.timeFormat,
          overflow: true
        },
        threeD: {
          label: '3d',
          sortable: true,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: true
        },
        comment: {
          label: '备注',
          sortable: false,
          width: null,
          minWidth: '100px',
          fixed: false,
          formatter: null,
          overflow: false
        },
      },
      beamForm:{
        figureNumber:null,
        pageNumber: 1,
				pageSize: 5
      },
    }
  },
  mounted() {
    this.initUsers()
    this.initBridgeFile()
  },
  computed: {
    // 格式化
    ...mapGetters('user', ['usersEnumFormat']),
    ...mapGetters('file', ['fileGroupEnumFormat']),
    // 获取
    ...mapState('user', { users: state => state.users }),
    // 桥梁的文件类型
    ...mapState('file', { fileGroupList: state => state.fileGroup }),
    // 桥梁的详情数据
    ...mapState('bridge', { list: state => state.list }),
    // 墩的表格数据
    ...mapState('pier', { piers: state => state.piers }),
    ...mapState('pier', { piersTotal: state => state.total }),
    // 梁的表格数据
    ...mapState('beam', { beams: state => state.beams }),
    ...mapState('beam', { beamsTotal: state => state.total }),
  },
  methods: {
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
    delBeam (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				beamApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
			})
		},
    delPier (ids) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				pierApi.delByIds(ids).then(res=> {
					if(res.success) {
						this.$message.success('删除成功')
						this.reload()
					} else this.$message.error(res.message)
				})
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
    },
    judgeFormat (row, column, cellValue, index) {
      switch(cellValue) {
        case '1':return '有声屏障'
        case '2':return '无声屏障'
        default:return cellValue
      }
    },
    basicGroupFormat (row, column, cellValue, index) {
      switch(cellValue) {
        case '1':return '桩基础'
        case '2':return '眀控基础'
        case '3':return '挖井基础'
        case '4':return '沉井基础'
        default:return cellValue
      }
    },
    shapeFormat (row, column, cellValue, index) {
      switch(cellValue) {
        case '1':return '实体'
        case '2':return '空心'
        default:return cellValue
      }
    },
    groupFormat (row, column, cellValue, index) {
      return this.fileGroupEnumFormat(cellValue)
      // switch(cellValue) {
      //   case '1':return '勘察资料'
      //   case '2':return '地质资料'
      //   case '3':return '设计资料'
      //   case '4':return '程序文件'
      //   case '5':return '施工资料'
      //   default:return cellValue
      // }
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
    // 初始化
    ...mapActions('user', { initUsers: 'initUsers' }),
    ...mapActions('bridge', { initUserList: 'initUsers' }),
    ...mapActions('bridge', { initSections: 'initSections' }),
    ...mapActions('bridge', { initList: 'initList' }),
    ...mapActions('file', { initBridgeFile: 'initBridge' }),
    ...mapActions('pier', { initPiers: 'initPiersByParam' }),
    ...mapActions('beam', { initBeams: 'initBeamsByParam' }),
  },
  watch: {
    $route: {
      deep:true,
      immediate:true,
      handler (val) {
        this.name = val.query.name
        this.id = val.query.id
        var _this = this
        this.initList({id:this.id, action:()=> {
          _this.initUserList(_this.list.itemId.value)
          _this.initSections(_this.list.itemId.value)
          _this.pierForm.bridgeId = val.query.id
          _this.initPiers(_this.pierForm)
          _this.beamForm.bridgeId = val.query.id
          _this.initBeams(_this.beamForm)
          _this.fileForm.parentId = val.query.id
          _this.initFiles()
        }})
      }
    },
    fileForm: {
      deep:true,
      handler (val) {
        if (val.fileGroupList==''||val.fileGroupList==null)
        delete val.fileGroupList
        this.initFiles()
      }
    },
    pierForm: {
      deep:true,
      handler (val) {
        this.initPiers(val)
      }
    },
    beamForm: {
      deep:true,
      handler (val) {
        this.initBeams(val)
      }
    }
  }
}
</script>

<style>
#bridge .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0;
}
.search {
  /* text-align: right; */
}
</style>