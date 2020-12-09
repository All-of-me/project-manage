<template>
  <div class="bgColor1">
    <div class="Land">
      <el-row class="container1">
        <div id="body">
          <div class="g-center login-page"
               @keyup.enter="login">
            <el-tabs v-model="activeName">
              <el-tab-pane label="修改密码"
                           name="login">
                <el-form :model="loginForm"
                         label-width="80px"
                         :rules="loginRules"
                         ref="loginForm"
                         class="login-form">
                  <el-form-item label="旧密码"
                                prop="password"
                                class="redLabel">
                    <el-input type="password"
                              v-model="loginForm.oldPassword"
                              auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码"
                                prop="password"
                                class="redLabel">
                    <el-input type="password"
                              v-model="loginForm.newPassword"
                              auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="确认密码"
                                prop="password"
                                class="redLabel">
                    <el-input type="password"
                              v-model="loginForm.checkPassword"
                              auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                               @click.native="confirm"
                               :loading="editLoading">确认修改</el-button>
                    <!-- <el-button type="primary"
                               @click="resetForm('loginForm')">重置</el-button> -->
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-undef */
import utilApi from '@/common/utils'
import * as loginApi from '@/base/api/login'
import axios from 'axios'
// import routes from '@/base/router'
// import Vue from 'vue'

export default {
  components: {},
  data () {
    return {
      LoginFormVisible: false,
      activeName: 'login',
      editLoading: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' }
        ]
      },
      user: {
        userid: '',
        username: '',
        userimg: ''
      },
      logined: false
    }
  },
  methods: {
    confirm: function () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          if (this.loginForm.newPassword === this.loginForm.checkPassword) {
            let para = Object.assign({}, this.loginForm)
            loginApi.modifyPassword(para).then((res) => {
              if (res.success) {
                this.$message.success('修改成功')
                loginApi.logout({}).then((res) => {
                  if (res.success) {
                    // 从sessionstage删除掉user的信息
                    utilApi.delSession('permissions')
                    utilApi.delSession('activeUser')
                      // 跳转到登陆页面
                      this.$router.push({path: '/login'})
                  }
                })
              } else {
                this.$message.error(res.message)
              }
            },
              (res) => {
              })
          }
        } else {
          this.$message.error('两次密码输入不一致！')
        }
      })
    },

    resetForm: function (formName) {
      this.$refs[formName].resetFields()
    },
    refresh_user: function () {
      let activeUser = utilApi.getActiveUser()

      if (activeUser) {
        this.logined = true
        this.user = activeUser
      } else {
        this.showlogin()
      }
    },
    showlogin: function () {
      this.LoginFormVisible = true
    }
  },
  created () {
    // var this_ = this;
    // bus.$on('childa-message', this.showlogin(this_));

  },
  mounted () {
    this.refresh_user()
  }
}
</script>
<style lang="less">
.bgColor1 {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background: url("../../../public/images/bg1.jpg") no-repeat center;
  .Land {
    width: 40%;
    position: relative;
    top: 20%;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 40px;
    background-color: rgba(0, 0, 0, 0.6);
    .topic {
      font-size: 40px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    .container1 {
      .login-form {
        width: 400px;
        margin: 5% auto 0;
        .el-form-item__label {
          text-align: right;
          vertical-align: middle;
          float: left;
          font-size: 14px;
          color: #ffffff !important;
          line-height: 40px;
          padding: 0 12px 0 0;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
        }
      }
    }
  }
}
@media screen and (max-width: 415px) {
  .bgColor {
    .Land {
      width: 50%;
      .topic {
        font-size: 20px;
      }
      .container {
        width: 250px;
        padding: 8px;
        margin-left: -28px;
      }
    }
  }
}
@media screen and (max-width: 1200px) and(min-width: 900px) {
  .bgColor {
    .Land {
      width: 50%;
    }
  }
}
@media screen and (max-width: 900px) and(min-width: 415px) {
  .bgColor {
    .Land {
      width: 50%;
      .container {
        width: 370px;
      }
    }
  }
}
</style>
