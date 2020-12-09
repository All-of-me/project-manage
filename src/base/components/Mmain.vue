<template>
  <el-main style="height:100%;background:#eee;">
    <!-- <transition name="fade" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <router-view v-if="!$route.meta.keepAlive"></router-view> -->
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'Mmain',
  data () {
    return {

    }
  },
  computed: {
  }
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
