<template>
  <el-row id="engineer">
		<el-col :offset="4" :span="16">
    	<el-transfer
    	  filterable
    	  filter-placeholder="查询用户"
				:titles="['用户列表', changeRole+'列表']"
    	  v-model="value"
    	  :data="data">
    	</el-transfer>
		</el-col>
		<el-col :offset="14" style="margin-top:20px;">
			<el-button type="success" @click="submit">确认</el-button>
			<el-button @click="$router.go(-1)">返回</el-button>
		</el-col>
  </el-row>
</template>

<script>
import * as sysApi from '@/module/syst/api/sys'
import * as projectApi from '@/module/project-manage/api/project'
export default {
  data () {
    return {
			data: [],
			value: [],
			changeRole: '总工'
    }
	},
	created () {
    this.findAllUser()
    this.getRoleUser()
	},
  mounted () {
	},
	methods: {
    findAllUser () {
			let that = this
      sysApi.findAllUser().then(res => {
        if (res.success) {
          if (res.result) {
						let users = res.result
						for (let i in users) {
							that.data.push({
								label: users[i].nickName+'('+users[i].jobNumber+')',
								key: users[i].id
							})
						}
          }
        }
      })
		},
    // 查找总工中所有用户
    getRoleUser () {
			let that = this
      projectApi.findAllByUserType(1).then(res => {
        if (res.success) {
					that.value = res.result.split(',')
        }
      })
		},
		submit () {
			let that = this
			projectApi.editAssignUser(this.value+'','1').then(res => {
    	  if (res.success) {
					that.$message.success('编辑总工成功')
					that.$router.go(-1)
				} else that.$message.error(res.message)
    	})
		},
	}
}
</script>

<style>
#engineer {
	width:100%;
	height:100%;
	background: #fff;
	/* text-align: center; */
	padding-top: 30px;
}
</style>