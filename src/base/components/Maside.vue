<template>
  <el-aside id="aside"
            width="280px!important"
            style="height:100%;overflow: auto;"
            :style="{background:asideColor}">
    <el-input id="filter"
              v-model="filterText"
              placeholder="输入关键字进行过滤">
    </el-input>
    <div style="width:100%;height:30px;" class="link" :class="$route.query.name==='项目管理'?'active':''">
      <router-link to="/project/list?name=项目管理" style="display:block;color:#fff;width:cala(100% - 10px);height:100%;line-height:30px;margin-left:10px;font-size:16px;">
        <i class="iconfont icon-gongchengliebiao"></i>
        项目管理
      </router-link>
    </div>
    <el-tree
      ref="tree"
      style="background:transparent;color:#fff;"
      :data="projectList"
      :props="defaultProps"
      @node-click="link"
      :default-expanded-keys="expandedKeys"
      :filter-node-method="filterNode"
      node-key="id"
      :default-expand-all="false"
      :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :class="$route.query.id===data.id?'active':''" style="width:100%;height:100%;display:block;">
          <i class="iconfont icon-gongchengxiangmu" v-if="node.level===1"></i>
          <i class="iconfont icon-daorubiaoduancailiao" v-else-if="node.level===2"></i>
          <i class="iconfont icon-qiaoliang" v-else-if="node.level===3"></i>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </el-aside>
</template>

<script>
import submenu from './Submenu.vue'
import * as projectApi from '@/module/project-manage/api/project'
import * as sectionApi from '@/module/project-manage/api/section'
import * as bridgeApi from '@/module/project-manage/api/bridge'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'Maside',
  components: {
    submenu
  },
  //监听
  watch: {
    // 树形结构过滤
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    $route: {
      deep:true,
      immediate:true,
      handler (val) {
        if (val.query&&val.query.id)
          this.expandedKeys = [val.query.id]
      }
    }
  },
  data () {
    return {
      projectList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      expandedKeys: [],
    }
  },
  mounted () {
    let that = this
    this.initProjects(()=>{
      for (let i in that.allProjects) {
        that.allProjects[i].label = that.allProjects[i].itemTitle
        let sections = that.allProjects[i].section_aList
        for (let j in sections) {
          sections[j].label = sections[j].sectionTitle
          let bridges = sections[j].bridge_aList
          for (let k in bridges) {
            bridges[k].label = bridges[k].bridgeTitle
          }
          sections[j].children = bridges
        }
        that.allProjects[i].children = sections
      }
      that.projectList = that.allProjects
    })
  },
  computed: {
    asideColor: function () {
      return this.$store.state.asideColor
    },
    ...mapState('project', { allProjects: state => state.allProjects }),
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    link (data,node,haha) {
      switch (node.level) {
        case 1:this.$router.push({path:'/project',query: {id:data.id,name:data.label}});break
        case 2:this.$router.push({path:'/section',query: {id:data.id,name:data.label}});break
        case 3:this.$router.push({path:'/bridge',query: {id:data.id,name:data.label}});break
      }
    },
    ...mapActions('project', { initProjects: 'initProjects' }),
  },
  created () {
    if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style)
    this.isIe = true
  }
}
</script>

<style lang="less">
#aside {
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
  }
  .el-tree-node__content {
    background: transparent!important;
    height: 35px;
    &:hover {
      background:rgb(60, 141, 181)!important;
    }
  }
  .link:hover {
    background:rgb(60, 141, 181)!important;
  }
  .el-tree-node__label {
    font-size:16px;
  }
  #filter.el-input__inner {
    background: transparent;
    border: 0px;
    color: #fff;
  }
  .active {
    background:rgb(60, 141, 181);
  }
}

</style>
