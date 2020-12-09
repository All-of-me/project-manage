<template>
<div id="formTemplate">
  <el-form :model="list" :label-width="labelWidth+'px'" :disabled="disabled" :inline="inline" :size="size" :rules="disabled?null:rules">
    <el-row>
      <el-col :span="8"
              v-for="(item, index) in list"
              :key="index">
        <el-form-item :prop="index"
                      :label="item.label"
                      :rules="disabled?null:item.rules"
                      :required="item.required"
                      v-if="!item.hidden">
          <el-input v-model="item.value"
                    :placeholder="item.label"
                    :type="item.textarea?'textarea':'text'"
                    v-if="!item.list && !item.isDate"
                    :readonly="item.disabled"
                    :disabled="item.disabled"
                    style="width:100%!important;"></el-input>
          <el-select v-model="item.value"
                     :placeholder="item.label"
                     :value-key="item.listKey?item.listKey:'id'"
                     v-else-if="item.list && !item.isDate"
                     :disabled="item.disabled"
                     :filterable="item.filterable"
                     :default-first-option="item.filterable"
                     :clearable="item.clearable"
                     :multiple="item.multiple"
                     :collapse-tags="item.multiple"
                     style="width:100%!important;">
            <span slot="empty" v-if="item.list.length==0" class="empty">{{item.empty?item.empty:empty?empty:'未查到数据'}}</span>
            <el-option v-for="i in item.list"
                       :key="i[item.listKey?item.listKey:'id']"
                       :label="i[item.listLabel?item.listLabel:'name']+(item.listLabel2?'('+i[item.listLabel2]+')':'')"
                       :value="i[item.listKey?item.listKey:'id']">
            </el-option>
          </el-select>
          <el-date-picker v-model="item.value"
                          :placeholder="item.label"
                          :type="item.type"
                          :value-format="item.format"
                          :disabled="item.disabled"
                          :readonly="item.disabled"
                          v-else-if="!item.list && item.isDate"
                          style="width:100%!important;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" style="text-align:center;">
        <slot></slot>
      </el-col>
    </el-row>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'projectForm',
  data () {
    return {
      name: null,
    }
  },
  props: {
    list: {
      type: Object,
      default: function() {
        return {
          input: {
            value: null,
            label: '我是标题',
            disabled: false,
            list: null,
            isDate: null
          },
          select: {
            value: null,
            label: '我是标题2',
            list: [
              {id:'1',name:'1'},
              {id:'2',name:'2'},
              {id:'3',name:'3'},
            ],
            listKey: 'id',
            listLabel: 'name',
            isDate: null,
            filterable: false,
            clearable: false,
            multiple: false,
            disabled: false,
          },
          date: {
            value: null,
            label: '我是标题3',
            list: null,
            disabled: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            isDate: true,
            type: 'date'
          }
        }
      },
      required: false
    },
    disabled: Boolean,
    inline: {
      type:Boolean,
      default: true
    },
    size: {
      type:String,
      default: 'mini'
    },
    labelWidth: {
      type:String|Number,
      default: '110'
    },
    empty: {
      type:String,
      default:'未查到数据'
    },
    rules: {
      type:Object
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  watch: {
  },
}
</script>

<style lang="less">
.edit #formTemplate .el-form-item {
  margin: 0 0 22px 0!important;
}
#formTemplate {
  .el-form-item {
    width: 100%!important;
    margin: 0 0 10px 0!important;
    .el-form-item__content {
      // width: 100%!important;
      width: calc(~"100% - 110px")!important;
    }
    .el-input {
      width:100%!important;
    }
    .el-select {
      width:100%!important;
    }
    // .el-select__tags { 
    //   flex-wrap: unset; 
    //   overflow: auto;
    // }
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266!important;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px!important;
  }
}
span.empty {
  font-size: 14px;
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
  font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
  color: #606266;
}
</style>