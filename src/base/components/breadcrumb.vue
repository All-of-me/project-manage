<template>
  <div style="display:inline-block;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(item,index) in realList" :to="item.path" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script type="text/javascript">
  export default {
    data () {
      return {
        realList: []
      }
    },
    methods: {
    },
    mounted () {
      this.realList = this.$route.meta.routeList
    }
  }
</script>
<style scoped lang="scss">

</style>
