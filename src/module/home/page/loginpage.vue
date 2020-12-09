<template>
  <div style="overflow: auto">

    <login-form></login-form>

  </div>
</template>
<script>
/* eslint-disable */
import loginForm from '@/base/components/loginForm.vue';
import utilApi from '@/common/utils';
export default {
	components:{
    loginForm
	},
  data() {
    return {

    }
  },
  methods: {
  },
  mounted() {

  }
}
</script>
<style scoped>
  .login-form{width: 400px;margin:5% auto 0;}
</style>
