<template>
  <h2 :style="{background:mainColor}">
    <div style="float:left;height:100%;width:280px;text-align:center;line-height:62px;" :style="{background:mainColor}" @click="collapseControl">
      <!-- <img src="../../../public/images/logo.png" style="width:100%;height:auto;"> -->
      <el-image :src="require('@/../public/images/logo.png')" style="width:90%;height:75%;margin:5px 0 0 0px;"></el-image>
    </div>
    <div style="float:left;margin-left:-10px;">
      <ul class="head-ul">
        <li @click="reload">
          <i class="el-icon-refresh"></i>
          刷新菜单
        </li>
        <li @click="goHome">
          <i class="el-icon-house"></i>
          返回首页
        </li>
        <li @click="goBack">
          <i class="el-icon-back"></i>
          返回上页
        </li>
        <li>
          <a style="color:white" :href="'http://'+host+':8888/'">
            去审批系统
          </a>
        </li>
      </ul>
    </div>
    <div style="position:absolute;right:3%;top:-5px;">
      <el-popover
        placement="bottom"
        trigger="hover">
        <el-button style="z-index:300;padding:10px 0;" type="text" @click="toUrl">修改密码</el-button>
        <el-link slot="reference" icon="el-icon-user" @click="handleCli" :style="{color:studio?vipcolor:'#fff'}" style="font-size:18px;">{{nickName}}</el-link>
      </el-popover>
      <input type="color" style="display:none" id="color" v-model="vipcolor">
      <el-link icon="el-icon-switch-button" @click="goTo()" style="font-size:18px;margin-left:20px;color:#fff;">退出</el-link>
    </div>
  </h2>
</template>

<script>
import * as loginApi from '../api/login'
import * as userApi from '../api/user'
import utilApi from '@/common/utils'
import breadcrumb from './breadcrumb'
export default {
  // 接收注入，从app组件中拿到方法
  inject: ['reload'],
  name: 'Mheader',
  components: {breadcrumb},
  mounted () {
    this.findActiveUser()
    this.getNickNameById()
    this.getBreadcrumb()
  },
  computed: {
    mainColor: function () {
      return this.$store.state.mainColor
    }
  },
  data () {
    return {
      user: {},
      nickName: '',
      roles: [],
      studio: false,
      vipcolor: 'rgb(14, 224, 251)',
      // 面包屑
      leveList: [],
      host: require('@/config/hostConfig').host
    }
  },
  // 面包屑,监听事件
  watch: {
    $route () {
      this.getBreadcrumb()
    }
  },
  methods: {
    // 面包屑
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => item.name)
      this.leveList = matched
    },
    handleCli () {
      if (this.studio) {
        document.getElementById('color').click()
      }
    },
    // 获取当前登陆的用户
    findActiveUser () {
      this.user = this.getActiveUser()
    },
    // 获取当前登陆的用户名
    getNickNameById () {
      let that = this
      userApi.findUserById(that.user.id).then(res => {
        if (res.success) {
          that.nickName = res.result.nickName
          // that.roles = res.result.roles
          // for (let i in that.roles) {
          //   if (that.roles[i].name === 'ROLE_STUDIO') {
          //     this.$store.commit('changeStudio', true)
          //     that.studio = true
          //   }
          //   if (that.roles[i].name === 'ROLE_CHIEF') {
          //     this.$store.commit('changeChief', true)
          //   }
          // }
        }
      })
    },
    // 返回上一步按键
    goBack: function () {
      this.$router.go(-1)
    },
    // 关闭键退出登录
    goTo: function () {
      let that = this
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          // 跳转到统一登陆
          const loading = that.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          loginApi.logout({}).then((res) => {
            loading.close()
            if (res.success) {
              that.$message.success('退出成功')
                // 从sessionstage删除掉user的信息
              utilApi.delSession('permissions')
              utilApi.delSession('activeUser')
              window.location = '#/login?returnUrl=' + Base64.encode(window.location)
              location.reload()
            } else {
              that.$message.error('退出失败')
            }
          }).catch(() => {
              loading.close()
            })
        }).catch(() => {

        })
    },
    goHome () {
      this.$router.replace('/')
    },
    toUrl () {
      this.$router.replace('/editpassword')
    },
    // 侧边栏状态存入vuex
    collapseControl: function () {
      if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) return
      this.$store.commit('collapseControl')
    }
  }
}
</script>

<style lang="less">
h2{
  margin: auto;
  line-height: 50px;
  height: 50px;
}
.el-popover {
  margin-top: 0!important;
  min-width: 0!important;
}
.head-ul{
  li {
    display: inline-block;
    font-size: 18px;
    padding-right:10px;
    padding-left:10px;
    border-right: 1px solid #ccc;
    cursor:pointer;
    list-style:none;
    &:hover {
      background: rgb(54, 127, 169);
    }
    &:first-child {
      margin-left:10px;
      border-left: 1px solid #ccc;
    }
  }
}
</style>
