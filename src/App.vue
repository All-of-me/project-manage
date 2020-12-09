<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  // 子组件注入，相当于全局方法
  // 无论层级深度
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      name: 'app',
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  },
  mounted () {
    // 检查ie浏览器，解决ie浏览器router.push失效的问题
    // function checkIE () {
    //   return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    // }
    // if (checkIE()) {
    //   window.addEventListener('hashchange', () => {
    //     var currentPath = window.location.hash.slice(1)
    //     if (currentPath.indexOf(this.$route.path) === -1) {
    //       this.$router.push(currentPath)
    //     }
    //   }, false)
    // }
  },
  created: function (newPath) {
    if (!window.console) {
      window.console = {
        log: function (msg) { },
        err: function (msg) { },
        warn: function (msg) { }
      }
    }
  }

}
</script>

<style>
@import "../public/css/main.css";

* {
  -webkit-user-select: text;
}
html,
body,
#app,
#app > div {
  width: 100%;
  height: 100%;
}
.el-table--border th.gutter:last-of-type {
  display: block !important;
}
</style>
