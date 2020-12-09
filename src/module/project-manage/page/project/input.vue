<template>
  <el-row id="input">
		<!-- excel导入 -->
		<el-col :offset="4" :span="16">
			<el-form>
				<el-form-item label="第一步：下载模板excel">
					<el-button type="success" @click="download">获取模板excel</el-button><i class="el-icon-check" style="padding:10px;font-size:18px;color:red;" v-if="step>0"></i>
				</el-form-item>
				<el-form-item label="第二步：修改下载的模板">
					<el-button type="info" @click="step=2" :disabled="step<1">我已下载并修改excel</el-button><i class="el-icon-check" style="padding:10px;font-size:18px;color:red;" v-if="step>1"></i>
				</el-form-item>
				<el-form-item label="第三步：上传excel">
					<el-upload
  					action="#"
						:http-request="submit">
						<el-button type="primary" :disabled="step!=2">提交</el-button>
					</el-upload>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- <el-col :offset="14" style="margin-top:20px;">
			<el-button type="success" @click="submit">确认</el-button>
			<el-button @click="$router.go(-1)">返回</el-button>
		</el-col> -->
  </el-row>
</template>

<script>
import * as fileApi from '@/module/project-manage/api/fileApi'
export default {
  data () {
    return {
			step:0,
			itemId: null,
			type: null
    }
	},
	created () {
	},
  mounted () {
		this.itemId = this.$route.query.id
		this.bridgeId = this.$route.query.bridgeId
		this.type = this.$route.query.type
	},
	methods: {
		download () {
			switch(this.type) {
				case 'section': this.downloadSection();break
				case 'bridge': this.downloadBridge();break
				case 'pier': this.downloadPier();break
				case 'beam': this.downloadBeam();break
			}
		},
		getFile (content,title) {
      const blob = new Blob([content])
      let fileName = new Date().format('yyyy-MM-dd') + title + '.xls'
      if ('download' in document.createElement('a')) { // 非IE下载
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
			this.step = 1
		},
		downloadSection () {
			var that = this
			fileApi.getSectionExcelTemplate().then(res=> {
				const content = res
				const title = '标段批量导入模板'
				that.getFile(content,title)
			})
		},
		downloadBridge () {
			var that = this
			fileApi.getBridgeExcelTemplate().then(res=> {
				const content = res
				const title = '桥梁批量导入模板'
				that.getFile(content,title)
			})
		},
		downloadPier () {
			var that = this
			fileApi.getPierExcelTemplate().then(res=> {
				const content = res
				const title = '桥墩批量导入模板'
				that.getFile(content,title)
			})
		},
		downloadBeam () {
			var that = this
			fileApi.getBeamExcelTemplate().then(res=> {
				const content = res
				const title = '梁批量导入模板'
				that.getFile(content,title)
			})
		},
		submit (file) {
			var that = this
      that.$message('正在上传中，请不要关闭页面!')
      //上传文件名
      var formdata = new FormData()
      formdata.append('file', file.file)
      // 新增文件ajax
      switch(this.type) {
				case 'section': this.addSection(formdata);break
				case 'bridge': this.addBridge(formdata);break
				case 'pier': this.addPier(formdata);break
				case 'beam': this.addBeam(formdata);break
			}
		},
		addSection (formdata) {
			var that = this
			fileApi.addSectionFile(this.itemId,formdata).then(({data: res}) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$router.go(-1)
        } else {
          that.$message.error(res.message)
        }
      }).catch(res => {
        that.$message.error('超出时间！请确保上传文件不要太大！')
      })
		},
		addBridge (formdata) {
			var that = this
			fileApi.addBridgeFile(this.itemId,formdata).then(({data: res}) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$router.go(-1)
        } else {
          that.$message.error(res.message)
        }
      }).catch(res => {
        that.$message.error('超出时间！请确保上传文件不要太大！')
      })
		},
		addPier (formdata) {
			var that = this
			fileApi.addPierFile(this.bridgeId,formdata).then(({data: res}) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$router.go(-1)
        } else {
          that.$message.error(res.message)
        }
      }).catch(res => {
        that.$message.error('超出时间！请确保上传文件不要太大！')
      })
		},
		addBeam (formdata) {
			var that = this
			fileApi.addBeamFile(this.bridgeId,formdata).then(({data: res}) => {
        if (res.success) {
          that.$message.success(res.message)
          that.$router.go(-1)
        } else {
          that.$message.error(res.message)
        }
      }).catch(res => {
        that.$message.error('超出时间！请确保上传文件不要太大！')
      })
		},
	}
}
</script>

<style>
#input {
	width:100%;
	height:100%;
	background: #fff;
	/* text-align: center; */
	padding-top: 30px;
}
</style>