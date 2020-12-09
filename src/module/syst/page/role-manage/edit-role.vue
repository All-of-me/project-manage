<template>
  <el-row id="exporter">
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
export default {
  data () {
    return {
			users: [],
			data: [],
			value: [],
			roles: [],
			changeRoleId: '',
			changeRole: '命题人'
    }
	},
	created () {
		if (this.$route.query.role) {
			this.changeRole = this.$route.query.role
		}
    this.findRoles()
    this.findAllUser()
	},
  mounted () {
	},
	methods: {
    findAllUser () {
			let that = this
      sysApi.findAllUser().then(res => {
        if (res.success) {
          if (res.result) {
						that.users = res.result
						for (let i in that.users) {
							that.data.push({
								label: that.users[i].nickName+'('+that.users[i].jobNumber+')',
								key: that.users[i].id
							})
						}
          }
        }
      })
		},
    // 查找所有的角色
    findRoles () {
			let that = this
      sysApi.findRoles().then(res => {
        if (res.success) {
					that.roles = res.result.content
					for (let i in that.roles) {
						if (that.roles[i].description === that.changeRole) {
							that.changeRoleId = that.roles[i].id
						}
					}
					that.getRoleUser()
        }
      })
		},
    // 查找所有的角色
    getRoleUser () {
			let that = this
      sysApi.getRoleUser(that.changeRoleId).then(res => {
        if (res.success) {
					let userList = res.result
					for (let i in userList) {
						that.value.push(userList[i].id)
					}
        } else {
					this.$message.error('【' + that.changeRole + '】不存在')
				}
      })
		},
		submit () {
			let that = this
			if (this.changeRoleId === '') {
				this.$message.error('【' + that.changeRole + '】不存在')
				return
			}
      sysApi.assignUserRole(that.changeRoleId, that.value).then(res => {
        if (res.success) {
					that.$message.success(res.message)
					that.$router.go(-1)
        }
      })
		},
	}
}
</script>

<style>
#exporter {
	width:100%;
	height:100%;
	/* background: #fff; */
	/* text-align: center; */
	padding-top: 30px;
}
</style>