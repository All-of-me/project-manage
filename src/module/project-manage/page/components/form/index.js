export default {
  render (createElement) {
    var that = this
    function input (title,item) {
      return createElement('el-'+title,{
        style: {
          width: '100%!important'
        },
        props: {
          value: item.value
        },
        on: {
          'input':function(value) {
            item.value = value
          }
        },
        attrs: {
          // model:item.value,
          placeholder:item.label,
          type:item.type?item.type:item.textarea?'textarea':'text',
          readonly:item.disabled,
          disabled:item.disabled,
          valueKey:item.listKey?item.listKey:'id',
          filterable:item.filterable,
          defaultFirstOption:item.filterable,
          clearable:item.clearable,
          multiple:item.multiple,
          collapseTags:item.multiple,
          valueFormat:item.format
        }
      },[
        (item.list && item.list.length!==0)?(item.list.map(i => {
          return createElement('el-option',{
            props:{
              label: i[item.listLabel?item.listLabel:'name']+(item.listLabel2?'('+i[item.listLabel2]+')':''),
              value: i[item.listKey?item.listKey:'id']
            },
            attrs:{
              label: i[item.listLabel?item.listLabel:'name']+(item.listLabel2?'('+i[item.listLabel2]+')':'')
            },
          })
        })):
        (<span slot='empty' class="empty">{that.empty}</span>)
      ])
    }
    return (
      <div id="formTemplate">
        <el-form ref="form" props={{model:this.objList}} label-width={this.labelWidth+'px'} disabled={this.disabled} inline={this.inline} size={this.size}>
          <el-row>{
            Object.keys(this.objList).map(index => <el-col span={8}>{
              this.objList[index].hidden?null: <el-form-item prop={index} label={this.objList[index].label}>{
                (!this.objList[index].list && !this.objList[index].isDate)?input('input',this.objList[index]):
                (this.objList[index].list && !this.objList[index].isDate)?input('select',this.objList[index]):
                (!this.objList[index].list && this.objList[index].isDate)?input('date-picker',this.objList[index]):null
              }</el-form-item>
            }</el-col>)
          }</el-row>
          {that.$slots.default}
        </el-form>
      </div>
    )
  },
  name: 'projectForm',
  data () {
    return {
      name: null,
      objList: {}
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
              {id:1,name:'1'},
              {id:2,name:'2'},
              {id:3,name:'3'},
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
    }
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(val) {
        this.objList = val
      }
    },
    // objList: {
    //   deep: true,
    //   immediate: true,
    //   handler(val) {
    //     console.log(val)
    //   }
    // }
  },
}