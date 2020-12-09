<template>
  <h2 :style="{background:mainColor}">
    <div style="float:left;height:100%;width:280px;text-align:center;line-height:62px;" :style="{background:mainColor}" @click="collapseControl">
      <img src="../../../public/images/logo.png" style="width:100%;height:auto;">
      <!-- <el-image :src="require('@/../public/images/logo.png')" style="width:90%;height:75%;margin:5px 0 0 0px;"></el-image> -->
    </div>
    <div style="position:absolute;right:3%;top:20px;height:30px;">
      <ul class="head-ul">
        <li>
          <el-popover
            placement="bottom"
            trigger="hover"
            transition="fade-in-linear">
            <el-row>
              <el-col style="text-align:center;">
                {{nickName}}
              </el-col>
              <el-col>
                <el-button style="z-index:300;width:100%;" type="text" @click="toUrl">修改密码</el-button>
              </el-col>
            </el-row>
            <el-link slot="reference" icon="el-icon-user" @click="handleCli" :style="{color:studio?vipcolor:'#fff'}" style="padding-bottom:16px;margin-bottom:-16px;"></el-link>
          </el-popover>
          <input type="color" style="display:none" id="color" v-model="vipcolor">
        </li>
        <li>
          <el-link style="color:#fff;" @click="logout()">
            <i class="el-icon-switch-button"></i>
          </el-link>
        </li>
        <li>
          <el-link @click="goTo('http://'+host+':8888/')">
            <a style="color:#fff;" :href="'http://'+host+':8888/'">
              审
            </a>
          </el-link>
        </li>
        <li>
          <el-link @click="goTo('http://192.10.17.84/')">
            <a style="color:#fff;" :href="'http://192.10.17.84/'">
              考
            </a>
          </el-link>
        </li>
      </ul>
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
    // 关闭键退出登录
    logout: function () {
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
    goTo (url) {
      window.location.href = url
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
  height: 30px;
  li {
    padding:0;
    margin: 0;
    display: inline-block;
    width: 70px;
    height:30px;
    line-height: 30px;
    font-size: 16px!important;
    text-align: center;
    text-decoration: none;
    cursor:pointer;
    list-style:none;
    position: relative;
    top: -14px;
    // overflow: hidden;
    &:hover {
      background: rgb(54, 127, 169);
    }
    &:before {
      content: "";
      position: absolute;
      opacity:0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgb(34, 45, 50);
      transition: all 1.5s;
    }
    &:nth-child(1):before {
      top: 0;
      left: 0;
    }
    &:nth-child(1):before {
      content: "用户信息";
    }
    &:nth-child(2):before {
      content: "退出登录";
    }
    &:nth-child(3):before {
      content: "审批系统";
    }
    &:nth-child(4):before {
      content: "考核系统";
    }
    &:hover:before {
      opacity:1;
      top: 100%;
    }
    &:nth-child(1):hover:before {
      top: 0;
      left: -100%;
    }
    .el-divider__text, .el-link {
      font-size:18px;
      display: inline-block;
      width:100%;
      height:100%;
    }
  }
}

</style>
