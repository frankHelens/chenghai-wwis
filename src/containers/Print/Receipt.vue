<template>
<div>
  <div>
    <el-button
      type="text"
      v-for="item in buttonList"
      :type="item.style"
      @click="buttonEvent(item.name)"
    >{{item.label}}</el-button>
  </div>
  <div class="receipt-style" ref="receipt">
    <table cellspacing="0" cellpadding="0">
      <tr>
        <th colspan="9" class="bbd h55">
          <h2>{{title}}</h2>
        </th>
      </tr>
      <tr>
        <td>流水编号:</td>
        <td class="tl" colspan="4">{{dataList.orderCode || ''}}</td>
        <td colspan="2" class="">打印日期：{{time}}</td>
      </tr>
      <tr class="borders">
        <td width="100">客户名称</td> 
        <td width="150" colspan="2">{{dataList.clientName}}</td>
        <td width="100">客户电话</td>
        <td width="150" colspan="2">{{dataList.clientPhone || dataList.clientMobile || dataList.agentContact || ''}}</td>
        <td width="100">表径</td>
        <td width="150"colspan="2">{{dataList.meterDiameter || ''}}</td>
      </tr>
      <tr class="borders">
        <td>证件名称</td>
        <td colspan="2">{{dataList.cardType || ''}}</td>
        <td>证件号码</td>
        <td colspan="2">{{dataList.cardNo || ''}}</td>
        <td>客户类型</td>
        <td colspan="2">{{dataList.clientType || ''}}</td>
      </tr>
      <tr class="borders">
        <td>申办人</td>
        <td colspan="2">{{dataList.agentName || ''}}</td>
        <td>身份证号码</td>
        <td colspan="2">{{dataList.agentIdcard || ''}}</td>
        <td>服务项目</td>
        <td colspan="2">{{dataList.serviceType || ''}}</td>
      </tr>
      <tr class="borders">
        <td>用水地址</td>
        <td colspan="8" class="tl ti">{{dataList.clientAddress || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="3">其它约定</td>
        <td rowspan="3" colspan="8">{{dataList.pactText || ''}}</td>
      </tr>
      <tr>
        <td colspan="9"></td>
      </tr>
      <tr>
        <td colspan="9"></td>
      </tr>
      <tr class="borderd tl">
        <td rowspan="3" colspan="9" class="pl20 bs">  尊敬的用户：您的（服务项目:{{dataList.serviceType}}）申请已登记，我司将在5个工作日内预约办理。</td>
      </tr>
      <tr>
        <td colspan="9"></td>
      </tr>
      <tr>
        <td colspan="9"></td>
      </tr>
      <tr class="borderd">
        <td>联系地址：</td>
        <td colspan="8" class="tl ti">广东省汕头市澄海区文祠东路34号 (515800)</td>
      </tr>
      <tr class="borderd">
        <td>联系电话：</td>
        <td colspan="8"  class="tl ti">0754-85738583</td>
      </tr>
    </table>
    <div class="bottom-style">经办人：{{dataList.applyUserName}}</div>
  </div>  
</div>
</template>

<script>
import { fetchList } from '../../utils/api'
import moment from 'moment'
import { getLodop } from '../../utils/LodopFuncs'

export default {
  data () {
    return {
      title: '汕头市澄海区自来水公司供用水业务登记回执',
      flowId: this.$route.params.id,
      tableData: [],
      resource: 'installorder',
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        value: this.$route.params.id
      }],
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary'
      }, {
        name: 'print',
        label: '打印',
        style: 'primary'
      }],
      dataList: {},
      time: moment().format('YYYY-MM-DD')
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      this.tableData = []
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
          this.getRelation(dataObj)
        })
      }).catch((error) => {
        console.log(error)
      })
    }, /* 获取数据 */
    getRelation (dataObj) {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        this.dataList = dataObj
        let dataValue = {}
        Object.keys(data).map(key => {
          dataValue[key] = data[key].find(item => item.optionValue === this.dataList[key])
          this.dataList[key] = dataValue[key] ? dataValue[key].label : this.dataList[key]
        })
      })
    },
    buttonEvent (name) {
      if (name === 'print') {
        this.CreatePage()
      } else if (name === 'back') {
        this.$router.go(-1)
      }
    },
    CreatePage () { /* 打印 */
      let css = `<style type="text/css" scoped>
        table{width: 100%;text-align: center;border: 1px solid #000;margin:0 auto; border-collapse: inherit;}
        h2{font-size: 24px;text-align: center;}
        td{height: 35px;}
        .h35{height: 35px;}
        .h55{height: 55px;}
        .bts{border-top: 1px solid #000000;}
        .bbs{border-bottom: 1px solid #000000;}
        .bls{border-left: 1px solid #000000;}
        .brs{border-right: 1px solid #000000;}
        .btd{border-top: 1px solid #000;}
        .bld{border-left: 1px solid #000;}
        .brd{border-right: 1px solid #000;}
        .borders td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
        .borders td:nth-last-of-type(1){border-right: 0px;}
        .borderd td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
        .borderd td:nth-last-of-type(1){border-right: 0px;}
        .tl{text-align: left;}
        .ti{text-indent: 2em;}
        .fw{font-weight: bold;}
        .pl10{padding-left: 10px;}
        .pl20{padding-left: 20px;}
        .bs{box-sizing: border-box;}
      </style>`
      let html = this.$refs.receipt.innerHTML
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(40, 40, 700, 1000, css + html)
      LODOP.ADD_PRINT_TEXT(178, 740, 25, 120, '第一联：存根')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
      LODOP.ADD_PRINT_HTM(580, 40, 700, 1000, css + html)
      LODOP.ADD_PRINT_TEXT(710, 740, 25, 120, '第二联：客户')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 12)
      // LODOP.PRINT_DESIGN()
      LODOP.PREVIEW()
    }
  }
}
</script>

<style type="text/css" scoped>
.receipt-style{margin-top: 10px;}
table{width: 80%;text-align: center;border: 1px solid #000;margin:0 auto; border-collapse: inherit;}
h2{font-size: 24px;text-align: center;}
td{height: 35px;}
.h35{height: 35px;}
.h55{height: 55px;}
.bts{border-top: 1px solid #000000;}
.bbs{border-bottom: 1px solid #000000;}
.bls{border-left: 1px solid #000000;}
.brs{border-right: 1px solid #000000;}
.btd{border-top: 1px solid #000;}
.bld{border-left: 1px solid #000;}
.brd{border-right: 1px solid #000;}
.borders td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
.borders td:nth-last-of-type(1){border-right: 0px;}
.borderd td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
.borderd td:nth-last-of-type(1){border-right: 0px;}
.tl{text-align: left;}
.fw{font-weight: bold;}
.pl10{padding-left: 10px;}
.pl20{padding-left: 20px;}
.bs{box-sizing: border-box;}
.ti{text-indent: 2em;}
.bottom-style{
  width: 80%;
  margin: auto;
  margin-top: 10px;
}

/*.title{font-size: 18px;color: #000;font-weight: bold;}*/
</style>