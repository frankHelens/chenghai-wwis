<template>
<div class="content">
  <div class="button-content">
    <el-button
      v-for="button in buttonList"
      :type="button.style"
      @click="buttonListEvent(button.name, button.validate)">
      {{button.label}}
    </el-button>
  </div>
  <div class="table" ref="budget">
    <h2 class="title" style="text-align:center;">
      {{title}}
    </h2>
    <div class="title-msg">
      <table class="top-table-style">
        <tr>
          <td style="text-align:left;" width="500px">用户名称：{{dataList.clientName || ''}}</td>
          <td class="text-align:right;" width="500px">{{newDateTime}}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align:left;">安装地址：{{dataList.clientAddress || ''}}</td>
        </tr>
      </table>
      <table class="el-table__header" cellpadding="0" cellspacing="0">
        <el-form :model="formValues" ref="form" >
          <thead>
            <th width="100px">序号</th>
            <th width="200px">项目名称</th>
            <th width="200px">金额</th>
            <th width="350px">计算依据说明</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in column">
              <td width="50">{{index}}</td>
              <td width="150">
               {{item.label}}
              </td>
              <td width="200">
                {{formValues[item.name]}}
              </td>
              <td width="300">
                {{formValues[item.remark]}}
              </td>
            </tr>
          </tbody>
        </el-form>  
      </table>
       <div style="width: 70%; height: 20px; margin: 20px auto;clear: blod;">
        <div>
          <div class="text-left">预算员：</div>
          <div class="text-right">复核：</div>
        </div>
      </div>
    </div>
  </div>
</div> 
</template>

<script>
import { fetchList, fetch } from '../../utils/api'
import VFormItem from '../../components/VForm/VFormItem'
import moment from 'moment'
import { getLodop } from '../../utils/LodopFuncs'

export default {
  components: {
    VFormItem
  },
  data () {
    return {
      title: '澄海区自来水公司工程预算书',
      flowId: this.$route.params.id,
      resource: 'installorder',
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        // value: menu.flowid
        value: this.$route.params.id
      }],
      formValues: {},
      dataList: {},
      newDateTime: moment().format('YYYY年MM月DD日'),
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary'
      }, {
        name: 'print',
        label: '打印',
        style: 'primary'
      }],
      column: [{
        name: 'costWage',
        label: '综合工资',
        remark: 'costWageRemark'
      }, {
        name: 'costPipe',
        label: '管材费',
        remark: 'costPipeRemark'
      }, {
        name: 'costPart',
        label: '配件费',
        remark: 'costPartRemark'
      }, {
        name: 'costMeter',
        label: '水表费',
        remark: 'costMeterRemark'
      }, {
        name: 'costAttach',
        label: '附属工程费',
        remark: 'costAttachRemark'
      }, {
        name: 'costMeterTest',
        label: '水表检测费',
        remark: 'costMeterTestRemark'
      }, {
        name: 'costUnpredict',
        label: '不可预见费',
        remark: 'costUnpredictRemark'
      }, {
        name: 'cost1to7',
        label: '1~7合计'
      }, {
        name: 'costDesign',
        label: '设计费',
        remark: 'costDesignRemark'
      }, {
        name: 'costForceTest',
        label: '试压检测费',
        remark: 'costForceTestRemark'
      }, {
        name: 'costDeposit',
        label: '工程押金',
        remark: 'costDepositRemark'
      }, {
        name: 'costMachine',
        label: '机械费',
        remark: 'costMachineRemark'
      }, {
        name: 'costAgent',
        label: '代领代运费',
        remark: 'costAgentRemark'
      }, {
        name: 'costTax',
        label: '税金',
        remark: 'costTaxRemark'
      }, {
        name: 'costTotal',
        label: '总计',
        remark: 'costTotalRemark'
      }]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      fetch({
        method: 'get',
        url: '/installCost/' + this.flowId
      }).then(data => {
        let formValues = {}
        Object.keys(data).map(key => {
          if (key.indexOf('Remark') === -1) {
            formValues[key] = parseFloat(data[key]).toFixed(2)
          } else {
            formValues[key] = data[key]
          }
        })
        this.formValues = formValues
      })
      fetchList({
        resource: this.resource,
        filterBy: this.filterBy.map(item => item.name + '|' + item.type + '|' + item.value).join(';')
      })
      .then((data) => {
        data.data.map(item => {
          // 将所有time字段转时间格式
          let dataObj = {}
          Object.keys(item).map(key => {
            if (key.indexOf('Time') !== -1) {
              item[key] = moment(item[key]).format('YYYY年MM月DD日')
            }
            dataObj[key] = item[key]
          })
          this.dataList = dataObj
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    buttonListEvent (name) {
      if (name === 'back') {
        this.$router.go(-1)
      } else if (name === 'print') {
        this.CreatePage()
      }
    },
    CreatePage () { /* 打印 */
      console.log(11)
      let css = `<style type="text/css" scoped>
        .title{
          color: #000;
          font-size: 25px;
          letter-spacing: 3px;
        }
        .main{
          margin: 0 auto;
        }
        table {
          border: 2px solid #000;
          width: 100%;
          text-align: center;
          margin: 0 auto;
          font-size: 18px;
        }
        table th{
          text-align: center;
          border: 1px solid #000;
          height: 42px; 
        }
        table td{
          text-align: center;
          border: 1px solid #000;
          height: 42px;
        }
        .top-table-style{
          border: 0px;
          text-align: left;
        }
        .top-table-style td{
          border: 0px;
          text-indent: 2em;
          text-align: left;
        }
        .table td {
          text-indent: 2em;
        }
        .button-content{  
          margin-top: 20px;
        }
        .title-msg>div:nth-child(1){
          margin-top: 20px;
        }
        .title-msg>div:nth-child(1) div{  
          margin-top: 20px;
        }
        .title-msg {
          width: 90%;
          margin: 0 auto;
        }
        .text-left{
          float: left;
          font-size: 18px;
        }
        .text-right{
          float: right;
          width: 50%;
          text-align: right;
          font-size: 18px;
        }
      </style>`
      let html = this.$refs.budget.innerHTML
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(40, 40, 700, 1000, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>

<style lang="sass" scoped>
.title
  color: #000
  font-size: 25px
  letter-spacing: 3px
.main
  margin: 0 auto
table
  border: 2px solid #000
  width: 100%
  text-align: center
  margin: 0 auto
  font-size: 18px
.table
  th
    text-align: center
    border: 1px solid #000
    height: 42px
  td
    @extend th
  .top-table-style
    border: 0px
    text-align: left
    td
      @extend .top-table-style
      text-indent: 2em
.button-content    
  margin-top: 20px
.title-msg
  width: 65%;
  margin: 0 auto
.title-msg>div:nth-child(1)
    @extend .button-content
    div
      @extend .button-content
.text-left
  float: left
  font-size: 18px
.text-right
  float: right
  width: 50%
  text-align: right
  font-size: 18px
</style>