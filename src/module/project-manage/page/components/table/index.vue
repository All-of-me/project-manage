<template>
<div>
  <el-table v-loading="listLoading"
            :data="tableData"
            ref="table"
            border
            fit
            highlight-current-row
            style="width: 100%">
    <el-table-column type="selection"
                     :selectable="selectable"
                     width="30"> </el-table-column>
    <el-table-column v-for="(item, index) in tableHead"
                     :key="index"
                     :prop="index"
                     :sortable="item.sortable"
                     :width="item.width"
                     :min-width="item.minWidth"
                     :label="item.label"
                     :fixed="item.fixed"
                     :formatter="item.formatter"
                     :show-overflow-tooltip="item.overflow" />
    <slot></slot>
    <!-- <el-table-column label="操作"
                     fixed="right"
                     align="center"
                     width="200px">
      <template slot-scope="{row}">
        <el-button size="mini"
                   type="success"
                   @click="$router.push({path:'/exam-manage/paper/do',query:{id:row.id, isAnswer: false}})">预览</el-button>
        <el-button size="mini"
                   type="warning"
                   v-if="row.hideResult === 1"
                   @click="$router.push({path:'/exam-manage/paper/edit',query:{id:row.id}})">编辑</el-button>
        <el-button size="mini"
                   type="danger"
                   @click="deletePaper([row.id])"
                   v-if="row.hideResult === 1"
                   class="link-left">删除</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</div>
</template>

<script>
export default {
  name: 'projectTable',
  inject:['reload'],
  data () {
    return {
      queryParam: {},
    }
  },
  props: {
    listLoading: {
      type:Boolean,
      default: false
    },
    tableData: {
      type: Array,
      default: function () {
        return [
          {name:'hhh',age:'18'},
          {name:null,age:'22'},
          {name:'aaa',age:'9'},
        ]
      }
    },
    tableHead: {
      type: Object,
      default: function () {
        return {
          name: {
            label: '名称',
            sortable: false,
            width: null,
            minWidth: null,
            fixed: false,
            formatter: null,
            overflow: false
          },
          age: {
            label: '年龄',
            sortable: false,
            width: null,
            minWidth: null,
            fixed: false,
            formatter: null,
            overflow: false
          },
        }
      }
    },
    selectable: {
      type: Function,
      default: function (row, index) {
        return false
      }
    }
  },
  watch: {
  },
  methods: {
    
  },
  computed: {
    
  },
}
</script>

<style>
.el-table td, .el-table th {
  padding:5px 0;
}
</style>