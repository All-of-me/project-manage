<template>
  <div class="bgColor">
    <div class="Land">
      <div class="topic">项目管理系统</div>
      <el-row class="container">
        <div id="body">
          <div class="g-center login-page" @keyup.enter="login">
            <el-tabs v-model="activeName">
              <el-tab-pane label="用户登陆" name="login">
                <el-form :model="loginForm" label-width="80px" :rules="loginRules" ref="loginForm" id="loginForm" class="login-form">
                  <el-form-item label="账号" prop="username" class="redLabel">
                    <el-input v-model="loginForm.username" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password" class="redLabel">
                    <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click.native="login" :loading="editLoading">登陆</el-button>
                    <el-button type="primary" @click="resetForm('loginForm')">重置</el-button>
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
  import * as systemApi from '@/base/api/system'
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
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        user: {
          userid: '',
          username: '',
          userimg: ''
        },
        logined: false,
        returnUrl: ''
      }
    },
    methods: {
      login: function () {
        let that = this
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            that.editLoading = true
            let para = Object.assign({}, that.loginForm)
            loginApi.login(para).then((res) => {
              that.editLoading = false
              if (res.success) {
                utilApi.setCookie('uid', res.token)
                this.$message.success('登录成功')
                if (this.returnUrl !== 'undefined' && this.returnUrl !== '' &&
                    this.returnUrl.indexOf('/userlogout') === -1 &&
                    this.returnUrl.indexOf('/userlogin') === -1 &&
                    this.returnUrl.indexOf('/login') === -1
                ) {
                  if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)
                    location.reload()
                  that.$router.push('/home')
                } else {
                  if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)
                    location.reload()
                  // 跳转到首页
                  that.$router.push('/home')
                }
              } else {
                if (res.message) {
                  that.$message.error(res.message)
                } else {
                  that.$message.error('登陆失败')
                }
              }
            }).catch(()=>{})
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
      if (this.$route.query && this.$route.query.returnUrl) {
        let returnUrl = Base64.decode(this.$route.query.returnUrl)
        this.returnUrl = returnUrl
      }
    }
  }
</script>
<style lang="less">
  .bgColor {
    width: 100%;
    height: 100%;
    min-height: 600px;
    background: url("../../../public/images/bg1.jpg") no-repeat center;
    background-size: 100% 100%;
    .Land {
      width: 30%;
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
      .container {
        // width: 470px;
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
