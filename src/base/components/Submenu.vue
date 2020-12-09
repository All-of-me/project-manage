<!-- 递归侧边栏 -->
<template>
  <el-submenu v-if="list!=undefined" :index="list.path">
    <template slot="title">
      <i :class="list.iconCls" v-if="list.iconCls && !isIe"></i>
      <span>{{list.name}}</span>
    </template>
    <template v-for="item in list.children">
      <template v-if="item.children && item.children.length > 0">
        <submenu
          v-if="!item.hidden"
          :key="item.path"
          :index="item.path"
          :list="item">
        </submenu>
      </template>
      <template v-else>
        <el-menu-item
          v-if="!item.hidden"
          :key="item.path"
          :index="item.path">
          <i :class="item.iconCls" v-if="item.iconCls && !isIe"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </template>
    </template>
  </el-submenu>
</template>

<script>
import submenu from './Submenu.vue'
export default {
  name: 'submenu',
  components: {
    submenu
  },
  data () {
    return {

    }
  },
  props: {
    list: Object,
  },
  methods: {

  },
  mounted () {
  }
}
</script>

<style>

</style>
