<template>
<div style="height:100%">
  <!-- <router-view v-if="routerName=='Login'"/> -->
  <el-container style="height:100%">
    <el-header height="50px" style="color:white;padding:0;">
      <Mheader></Mheader>
    </el-header>

    <el-container style="height:90%">
      <Maside :style="{background:backColor}" style="height:100%;overflow-y:auto;"></Maside>
      <Mmain></Mmain>
    </el-container>

    <!-- <el-footer height="60px" :style="{background:mainColor}">
      <Mfooter></Mfooter>
    </el-footer> -->
  </el-container>
</div>
</template>

<script>
// import Mheader from '@/base/components/Mheader.vue'
import Mheader from '@/base/components/Mheader copy.vue'
import Maside from '@/base/components/Maside.vue'
import Mfooter from '@/base/components/Mfooter.vue'
import Mmain from '@/base/components/Mmain.vue'
export default {
  name: 'layout',
  components: {
    Maside,
    Mfooter,
    Mheader,
    Mmain
  },
  data () {
    return {
      // 侧边栏背景色
      backColor: 'rgb(34, 45, 50)',
      // 主题色
      mainColor: 'rgb(13, 91, 174)'
    }
  },
  computed: {
    routerName: function () {
      return this.$route.name
    }
  }
}
</script>

<style>

</style>