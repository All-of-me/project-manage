<template>
  <div>
      <div class="note-release-success">
        <p class="ico"><img src="/static/images/page-success.png" alt=""></p>
        <p class="title" v-if="logoutsuccess">退出成功！</p>
        <p class="title" v-if="!logoutsuccess">退出失败，请尝试刷新页面重新操作！</p>
        <!--<p class="info"></p>-->
        <p><router-link :to="{path: '/login'}">重新登陆</router-link></p>
      </div>
  </div>
</template>
<script>
/* eslint-disable */
import utilApi from '@/common/utils';
import * as loginApi from '../../../base/api/login';
export default {
	components:{
	},
  data() {
    return {
      logoutsuccess:false
    }
  },
  methods: {

  },
  created(){
    loginApi.logout({}).then((res) => {
        if(res.success){
          sessionStorage.removeItem('activeUser');
          this.$message.success('退出成功');
          this.logoutsuccess = true
        }else{
          this.logoutsuccess = false
        }
      },
      (res) => {
        this.logoutsuccess = false
      });
  },
  mounted() {

  }
}
</script>
<style scoped>
  @import '../../../statics/css/page.css';
  .login-form{width: 400px;margin:5% auto 0;}
</style>
