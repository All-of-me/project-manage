<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
      <!--<span>LOGIN</span>-->
    </div>
    <div class="logo">{{sysName}}</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- <marquee onMouseOver="this.start()" style="font-size:18px;padding-bottom:4px;width:100px;" scrollamount="1">{{getlev}}</marquee> -->
        <!--<div style="font-size:18px;padding-bottom:4px;width:60px;">{{getlev}}</div>-->
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">

          <el-popover
            ref="showMessageList"
            placement="bottom"
            width="600"
            v-model="popoverVisible"
            trigger="click">
            <el-table
              :data="messageList"
              border
              :height="300"
              :row-class-name="tableRowClassName"
              @row-click="jumpToMessage"

            >
              <el-table-column property="CREATEDATE" label="日期"></el-table-column>
              <el-table-column property="creatorName" label="创建人"></el-table-column>
              <el-table-column property="data" label="内容"></el-table-column>
              <el-table-column property="waringLevel" label="消息等级" :formatter="waringLevelFormatter"></el-table-column>
            </el-table>
            <div class="showMoreMessage">
              <el-button v-on:click="jumpToMessage(null)">查看更多</el-button>
            </div>
          </el-popover>
          <i class="el-icon-bell" v-popover:showMessageList></i>

          <span class="btn-bell-badge" v-if="message!=0"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img :src="this.user.userpic!=null&&this.user.userpic!=''?this.user.userpic:'./static/images/admin.jpg'"/>
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="hover" @command="handleCommand">
                    <span class="el-dropdown-link">
                        欢迎您：{{user.username}} <i class="el-icon-caret-bottom"></i>
                    </span>
          <el-dropdown-menu slot="dropdown" class="color">
            <el-dropdown-item command="home">
              <p><i class="el-icon-star-on"></i>首页</p>
            </el-dropdown-item>
            <!--<el-dropdown-item command="personal">
              <p><i class="el-icon-user"></i>个人资料</p>
            </el-dropdown-item>-->
            <el-dropdown-item command="logout">
              <p>
                <i class="el-icon-circle-close"></i>退出</p>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>

</template>
<script type="text/javascript">
  /* eslint-disable no-debugger */
  /* eslint-disable no-undef */
  import utilApi from '@/common/utils'
  import * as loginApi from '../api/login'
  import bus from '../../base/api/bus'

  import * as segmentalApi from '../../module/segmental/api/segmental'

  export default {
    data () {
      return {
        popoverVisible: false,
        editLoading: false,
        fullscreen: false,
        sysName: '梁场智能管理云平台',
        user: {
          userid: '',
          username: '',
          userimg: ''
        },
        message: 0,
        logined: true,
        collapse: false,
        messageList: [],
        websocktUrl: 'ws://localhost:8805/websocket/',
        // websocktUrl: 'ws://39.107.141.202:8805/websocket/',
        // websocktUrl: 'ws://47.108.116.134:8805/websocket/',

        svgBackUpData: {}
      }
    },
    methods: {
      handleCommand (command) {
        switch (command) {
          case 'home': {
            this.$router.push({
              path: '/'
            })
            break
          }
          case 'logout': {
            this.logout()
            break
          }
          case 'personal': {
            this.showPersonalInfo()
            break
          }
        }
      },
      tableRowClassName: function ({row, rowIndex}) {
        let value = row.waringLevel
        if (value === 1) {
          return 'success-row'
        } else if (value === 2) {
          return 'primary-row'
        } else if (value === 3) {
          return 'warning-row'
        } else if (value === 4) {
          return 'error-row'
        } else {
          return ''
        }
      },

      waringLevelFormatter: function (row) {
        let value = row.waringLevel
        if (value === 1) {
          return '温度异常'
        } else if (value === 2) {
          return '固定端模扰动过大'
        } else if (value === 3) {
          return '坐标测量误差过大'
        } else if (value === 4) {
          return '提前拆模'
        } else {
          return '-'
        }
      },

      jumpToMessage: function (row) {
        debugger
        // 关闭消息框
        this.popoverVisible = false
        let messagePath = '/mission/missionPublish/messageRoot/messageWarningList'
        let $router = this.$router
        if ($router.currentRoute.path !== messagePath) {
          $router.push({path: messagePath, query: {row: row}})
        } else {
          bus.$emit('headToMessageWarningList', row)
        }
      },
      // 退出登录
      logout: function () {
        this.$confirm('确认退出吗?', '提示', {}).then(() => {
          // 跳转到统一登陆
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          loginApi.logout({}).then((res) => {
            loading.close()
            if (res.success) {
              this.$message.success('退出成功')
              // 从sessionstage删除掉user的信息
              utilApi.delSession('permissions')
              utilApi.delSession('activeUser')
              this.$router.go(0)
            } else {
              this.$message.error('退出失败')
            }
          },
            (res) => {
              loading.close()
            })
        }).catch(() => {
        })
      },
      refresh_user: function () {
        // 获取用户名和密码
        let activeUser = utilApi.getActiveUser()
        if (activeUser) {
          this.logined = true
          this.user = activeUser
        }
      },
      // 侧边栏折叠
      collapseChage () {
        this.collapsed = !this.collapsed
        bus.$emit('collapse', this.collapsed)
      },
      // 全屏事件
      handleFullScreen () {
        let element = document.documentElement
        if (this.fullscreen) {
          if (document.exitFullscreen) {
            document.exitFullscreen()
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
          }
        } else {
          if (element.requestFullscreen) {
            element.requestFullscreen()
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
          } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen()
          }
        }
        this.fullscreen = !this.fullscreen
      },
      // 个人资料
      showPersonalInfo () {
        this.$message.success('Helloword!')
      },

      /* 统计用户未读信息 1代表未读 */
      countUserUnReadMessage: function () {
        segmentalApi.getWarningMessageListCondition(1, 100, this.getActiveUser().id, 1, '', '', '', '').then((res) => {
          if (res.success) {
            // 将res结果数据赋值给数据模型对象
            this.messageList = res.queryResult.list
            this.message = res.queryResult.total
          } else {
            this.$message.error({
              message: '查询失败'
            })
          }
        })
      },
      initWebSocket: function () {
        let userId = this.getActiveUser().id
        let uid = utilApi.getCookie('uid')
        let parm = ''
        if (uid === undefined) {
          parm = '/unlogin'
        } else {
          parm = '/' + uid
        }
        let url = this.websocktUrl + userId + parm
        this.websock = new WebSocket(url)
        this.websock.onopen = this.websocketOnOpen
        this.websock.onerror = this.websocketOnError
        this.websock.onmessage = this.websocketOnMessage
        this.websock.onclose = this.websocketClose
      },
      websocketOnOpen: function () {
        // console.log('WebSocket连接成功')
      },
      websocketOnError: function (e) {
        // console.log('WebSocket连接发生错误')
      },
      websocketOnMessage: function (e) {
        // let da = JSON.parse(e.data)
        // console.log(da)
        // 当接收到后台推送消息,重新拉取未读消息
        this.countUserUnReadMessage()
      },
      websocketClose: function (e) {
        // console.log('connection closed (' + e.code + ')')
      }
    },
    mounted () {
      this.refresh_user()
      if (document.body.clientWidth < 1366) {
        this.collapseChage()
      }
      this.initWebSocket()
      this.countUserUnReadMessage()
      let _self = this
      // 监听bus,当点击消息已读后
      bus.$on('messageRefresh', function (val) {
        // 监听first组件的txt事件
        _self.countUserUnReadMessage()
      })
    }
  }
</script>
<style lang="less">
  @import "../../statics/css/color.css";

  .header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #000000;
    border-radius: 2px solid #777b59;
  }

  .collapse-btn {
    float: left;
    /*width: 229px;*/
    /*background-color: #000000;*/
    padding: 0 20px;
    cursor: pointer;
    color: #000000;
    line-height: 70px;
    box-sizing: border-box;
  }

  .collapse-btn span {
    margin: 0 20px;
  }

  .color a {
    color: black;
  }

  .header .logo {
    float: left;
    width: 250px;
    padding-left: 10px;
    line-height: 70px;
  }

  .header-right {
    float: right;
    padding-right: 50px;
  }

  .header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
  }

  .btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
  }

  .btn-bell, .btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
    color: #000000;
  }

  .btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #000000;
  }

  .btn-bell .el-icon-bell {
    color: #000000;
  }

  .user-name {
    margin-left: 10px;
  }

  .user-avator {
    margin-left: 20px;
  }

  .user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .el-dropdown-link {
    color: #000000;
    cursor: pointer;
  }

  .el-dropdown-menu__item {
    text-align: center;
  }

  .showMoreMessage {
    text-align: center;

  }

  @media screen and(max-width: 415px) {
    .header {
      .collapse-btn {
        font-size: 18px;
        padding: 0 5px;
      }

      .logo {
        font-size: 16px;
        width: 164px;
      }

      .header-right {
        padding-right: 5px;

        .header-user-con {
          .btn-fullscreen {
            width: 20px;
            height: 20px;
          }

          .btn-bell {
            width: 20px;
            height: 20px;
          }

          .user-avator {
            margin-left: 5px;

            img {
              width: 25px;
              height: 25px;
            }
          }

          .el-dropdown {
            font-size: 12px;
          }
        }
      }
    }

  }

  @media screen and(min-width: 415px) and(max-width: 1200px) {
  }

</style>
