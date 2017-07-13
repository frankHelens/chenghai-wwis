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
  <div ref="approve">
    <h2 class="tc title">
      {{title}}
    </h2>
    <div class="title-style">合同号: {{dataList.pactNo || ''}}</div>
    <table cellspacing="0" cellpadding="0">
      <tr class="borders">
        <td width="100">用户名称</td>
        <td>{{dataList.clientName || ''}}</td>
        <td width="100">联系人</td>
        <td>{{dataList.agentName || ''}}</td>
        <td width="100">电话</td>
        <td>{{dataList.agentContact || ''}}</td>
      </tr>
      <tr class="borders">
        <td>身份证号</td>
        <td colspan="2">{{dataList.agentIdcard || ''}}</td>
        <td>近表号</td>
        <td colspan="2">
          {{dataList.meterNearNo || ''}}
        </td>
      </tr>
      <tr class="borders">
        <td>用户地址</td>
        <td colspan="5" class="tl ti2">{{dataList.clientAddress || ''}}</td>
      </tr>
      <tr class="borders tl">
        <td colspan="6" class="pl40 bs">
          <p style="margin-top: 10px;">申请事由：</p>
          <p style="text-indent:2em;line-height:150%;">我户将遵守《汕头市城市供水用水条例》，按照澄海区自来水公司的有关规定，申请用水报装及鉴定合同等手续。</p>
        </td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td colspan="2" class="tl">营业经办人：{{dataList.applyUserName || ''}}</td>
        <td colspan="2">{{dataList.applyTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="15" class="br">联<br /><br />合<br /><br />勘<br /><br />察<br /><br />意<br /><br />见</td>
      </tr>
      <tr class="borders">
        <td class="br0 tr">工程类别：</td>
        <td colspan="4" class="tl">{{dataList.serviceType || ''}}</td>
      </tr>
      <tr height="40">
        <td class="tr pl10">拟定水表口径：</td>
        <td class="tl">{{dataList.meterDiameter || ''}}</td>
        <td class='tr'>用水性质：</td>
        <td class="tl pl10">{{dataList.clientType || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="3">技术科：</td>
        <td colspan="5" class="tl ti2">{{dataList.lookRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{getLookName}}</td>
        <td colspan="1">{{dataList.lookTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="3">设计室：</td>
        <td colspan="5" class="tl ti2"></td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{getLookName}}</td>
        <td colspan="3">{{dataList.lookTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="3">营业所：</td>
        <td colspan="5" class="tl ti2">{{dataList.bizLookRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.bizLookUserName || dataList.bizLookUserId || ''}}</td>
        <td colspan="3">{{dataList.bizLookTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="3">安装公司：</td>
        <td colspan="5" class="tl ti2">{{dataList.instLookRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.instLookUserName || dataList.instLookUserId || ''}}</td>
        <td colspan="3">{{dataList.instLookTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="2">设计预算</td>
        <td colspan="5" class="tl ti2">{{dataList.pactText}}</td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.planUserName || dataList.planUserId || ''}}</td>
        <td colspan="2">{{dataList.planTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="2">造价审核</td>
        <td colspan="5" class="tl ti2">{{dataList.verifyRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.verifyUserName || dataList.verifyUserId || ''}}</td>
        <td colspan="2">{{dataList.verifyTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="2">分管经理<br>审批意见</td>
        <td colspan="5" class="tl ti2">{{dataList.subApprRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.subApprUserName || dataList.subApprUserId || ''}}</td>
        <td colspan="2">{{dataList.subApprTime || ''}}</td>
      </tr>
      <tr class="borders">
        <td rowspan="2">经理审批意见</td>
        <td colspan="5" class="tl ti2">{{dataList.mainApprRemark || ''}}</td>
      </tr>
      <tr>
        <td></td>
        <td class="tr">签名：</td>
        <td class="tl">{{dataList.mainApprUserName || dataList.mainApprUserId || ''}}</td>
        <td colspan="2">{{dataList.mainApprTime || ''}}</td>
      </tr>
    </table> 
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
      title: '澄海区自来水公司用户申请审批表',
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
      dataTime: {},
      relation: {},
      dataInitList: {}
    }
  },
  created () {
    this.getData()
  },
  computed: {
    getLookName () {
      if (this.dataList.stepDefineId > 3) {
        return this.dataList.lookUserName || this.dataList.lookUserId || ''
      } else {
        return ''
      }
    }
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
        let dataValue = {}
        Object.keys(data).map(key => {
          dataValue[key] = data[key].find(item => item.optionValue === dataObj[key])
          dataObj[key] = dataValue[key] ? dataValue[key].label : dataObj[key]
        })
      })
      fetchList({
        resource: 'user/relation'
      })
      .then(data => {
        dataObj.lookUserId = data.users ? data.users.find(user => {
          return user.id === dataObj.lookUserId
        }).label : ''
      })
      this.dataList = dataObj
      console.log(dataObj)
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
        .title{
          color: #000;
          letter-spacing: 10px
        }
        .ti2{text-indent: 2em;}
        .title-style{margin:0 auto;width: 100%;text-align: right;margin-bottom: 10px;}
        table{width: 100%;text-align: center;border: 1px solid #000;border-collapse: inherit; border-top: 0px;margin: 0 auto;}
        table .borders:nth-child(0){border-top: 0px;}
        td{height: 30px;line-height: 30px;}
        .bts{border-top: 1px solid #000000;}
        .bbs{border-bottom: 1px solid #000000;}
        .bls{border-left: 1px solid #000000;}
        .brs{border-right: 1px solid #000000;}
        .btd{border-top: 1px dashed #eee;}
        .bbd{border-bottom: 1px dashed #eee;}
        .bld{border-left: 1px dashed #eee;}
        .brd{border-right: 1px dashed #eee;}
        .borders td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
        .borders td:nth-last-of-type(1){border-right: 0px;}
        .borderd td{border: 1px dashed #eee; border-left: 0px; border-bottom: 0px;}
        .borderd td:nth-last-of-type(1){border-right: 0px;}
        .title{margin: 20px 0;}
        .tl{text-align: left;}
        .tc{text-align: center;}
        .tr{text-align: right;}
        .fw{font-weight: bold;}
        .pl10{padding-left: 10px;}
        .pl20{padding-left: 20px;}
        .pl40{padding-left: 40px;}
        .pl80{padding-left: 80px;}
        .bs{box-sizing: border-box;}
        .br0{border-right: 0px !important;}
        .br{border-right: 1px solid #000 !important;}
      </style>`
      let html = this.$refs.approve.innerHTML
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(40, 40, 700, 1100, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>

<style type="text/css" scoped>
.title{
  color: #000;
  letter-spacing: 10px
}
table{width: 70%;text-align: center;border: 1px solid #000;border-collapse: inherit; border-top: 0px;margin: 0 auto;}
table .borders:nth-child(0){border-top: 0px;}
td{height: 40px;line-height: 40px;}
.bts{border-top: 1px solid #000000;}
.bbs{border-bottom: 1px solid #000000;}
.bls{border-left: 1px solid #000000;}
.brs{border-right: 1px solid #000000;}
.btd{border-top: 1px dashed #eee;}
.bbd{border-bottom: 1px dashed #eee;}
.bld{border-left: 1px dashed #eee;}
.brd{border-right: 1px dashed #eee;}
.borders td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
.borders td:nth-last-of-type(1){border-right: 0px;}
.borderd td{border: 1px dashed #eee; border-left: 0px; border-bottom: 0px;}
.borderd td:nth-last-of-type(1){border-right: 0px;}
.title{margin: 30px 0;}
.ti2{text-indent: 2em;}
.tl{text-align: left;}
.tc{text-align: center;}
.tr{text-align: right;}
.fw{font-weight: bold;}
.pl10{padding-left: 10px;}
.pl20{padding-left: 20px;}
.pl40{padding-left: 40px;}
.pl80{padding-left: 80px;}
.bs{box-sizing: border-box;}
.br0{border-right: 0px !important;}
.br{border-right: 1px solid #000 !important;}
.title-style{margin:0 auto;width: 70%;text-align: right;margin-bottom: 10px;}
</style>