<template>
<div>
  <div class="button-content">
    <el-button
      v-for="button in buttonList"
      :type="button.style"
      @click="buttonListEvent(button.name, button.validate)">
      {{button.label}}
    </el-button>
  </div>
  <div ref="declare">
    <h2 class="title tc">
      {{title}}
    </h2>
    <div class="title-style">受理日期: {{dataList.applyTime || ''}}</div>
    <div class="title-style">合同号: {{dataList.pactNo || ''}}</div>
    <table cellspacing="0" cellpadding="0">
      <tr class="borders">
        <td width="100">客户名称</td>
        <td width="300" colspan="3">{{dataList.clientName || ''}}</td>
        <td width="100">表径</td>
        <td　width="100">{{dataList.meterDiameter || ''}}</td>
        <td width="100">户号</td>
        <td width="200" colspan="2">{{dataList.clientNo || ''}}</td>
      </tr>
      <tr class="borders">
        <td>证件名称</td>
        <td>{{dataList.cardType || ''}}</td>
        <td>证件号码</td>
        <td colspan="3">{{dataList.cardNo || ''}}</td>
        <td>客户电话</td>
        <td>{{dataList.clientContact || ''}}</td>
      </tr>
      <tr class="borders">
        <td>用水地址</td>
        <td colspan="8">{{dataList.clientAddress || ''}}</td>
      </tr>
      <tr class="borders">
        <td>客户类型</td>
        <td colspan="8">
          <el-checkbox-group v-model="checkedClientType"　style="text-align:left;margin-left:20px;">
            <el-checkbox :disabled="checkedClientType[1] === typeItem.label ? false : true" v-for="typeItem in clientTypeList"  :label="typeItem.label"></el-checkbox>

          </el-checkbox-group>
        </td>
      </tr>
      <tr class="borders">
        <td>服务项目</td>
        <td colspan="8">
          <el-checkbox-group v-model="checkedServiceType"　style="text-align:left;margin-left:20px;">
            <div style="float:left;margin-right:10px;" v-for="(item, index) in checkboxList">
              <el-checkbox :disabled="checkedServiceType[1] === item.label ? false : true" :label="item.label" v-if="!item.remark"></el-checkbox>
              <span v-else>{{item.remark}}</span>
            </div>
          </el-checkbox-group>
        </td>
      </tr>
      <tr class="borders">      
        <td>改名过户</td>
        <td>原用户名称</td>
        <td colspan="3">{{originalList.serviceType === 3 ? dataList.clientName : ''}}</td>
        <td>继承户名称</td>
        <td colspan="3">{{originalList.serviceType === 3 ? dataList.agentName : ''}}</td>
      </tr>
       <tr class="borders">      
        <td>申办人</td>
        <td colspan="2">{{dataList.agentName || ''}}</td>
        <td>身份证号码</td>
        <td colspan="2">{{dataList.agentIdcard || ''}}</td>
        <td>联系电话</td>
        <td colspan="2">{{dataList.agentContact || dataList.agentPhone || dataList.agentMobile}}</td>
      </tr>
      <tr class="borders">
        <td>安装日期</td>
        <td>{{dataList.buildDate || ''}}</td>
        <td>水表外码</td>
        <td>{{''}}</td>
        <td>表型</td>
        <td>{{''}}</td>
        <td>施工员</td>
        <td>{{''}}</td>
      </tr>
      <tr class="borders">
        <td class="br">其<br>它<br>约<br>定</td>
        <td colspan="8">
          {{dataList.pactText || ''}}
        </td>
      </tr>
      <tr class="borders">
        <td class="br">客<br>户<br>须<br>知</td>
        <td colspan="8" class="tl">
          1、以上客户资料必须真实,否则,我司有权暂停或终止向您提供服务。<br>
          2、凡单位客户应加盖单位印章、经办人持有效证件，其中工商客户需提供工商登记副本及用水项目的相关资料。<br>
          3、凡个人客户在签订本合同时，必须是年满十八周岁的本地公民，并持有本人有效身份证证件。<br>
          4、改名过户时，继承户应提供房产权属有效证明，原用户手续和欠费未缴清前，一律不得办理。<br>
          5,、服务热线电话：85722554。<br>
        </td>
      </tr>
      <tr class="tl" >
        <td class="ws btd tr" >客户声明
        </td>
        <td class="ws btd" colspan="8">以上填报的内容真实有效,背面《供用水合同》的条款已和供水方协商达成一致，予以确认。
        </td>
      </tr>
      <tr class="tl">
        <td class="ws" colspan="4">
          受理单位:
        </td>
        <td colspan="5">
          客户签名:
        </td>
      </tr>
      <tr class="tl">
        <td class="ws" colspan="4">
          受理人:
        </td>
        <td colspan="5">
          单位签单:
        </td>
      </tr>
      <tr class="tl">
        <td class="ws" colspan="9">
          审批人:
        </td>
      </tr>
      <tr class="tl" height="50">
        <td  colspan="3"></td>
      </tr>
      <tr>
        <td colspan="3"></td>
        <td class="ws last-td">&nbsp年&nbsp月&nbsp日</td>
        <td colspan="3"></td>
        <td class="ws last-td" colspan="2">&nbsp年&nbsp月&nbsp日</td>
      </tr>
    </table> 
  </div>
</div>
</template>

<script>
import { fetchList } from '../../utils/api'
import moment from 'moment'
import { getLodop } from '../../utils/LodopFuncs'
import { getUrl } from '../../utils/common'

export default {
  data () {
    return {
      title: '汕头市澄海区自来水公司供用水业务申报表',
      flowId: this.$route.params.id,
      tableData: [],
      resource: 'installorder',
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        value: this.$route.params.id
      }],
      clientTypeList: [],
      checkedClientType: [],
      serviceTypeList: [],
      checkedServiceType: [],
      dataList: {},
      checkList: [],
      isDisable: true,
      originalList: {},
      newDateTime: moment().format('YYYY年MM月DD日'),
      buildDate: '',
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary'
      }, {
        name: 'print',
        label: '打印',
        style: 'primary'
      }],
      checkboxList: [{
        label: '新装',
        disable: false,
        remark: 0
      }, {
        label: '复装',
        disable: false,
        remark: 0
      }, {
        label: '过户',
        disable: false,
        remark: 0
      }, {
        type: 3,
        remark: '(合同号: )'
      }, {
        label: '调整用水基数',
        disable: false,
        remark: 0
      }, {
        label: '增容',
        disable: false,
        remark: 0
      }, {
        label: '移表',
        disable: false,
        remark: 0
      }, {
        label: '调整价格',
        disable: false,
        remark: 0
      }, {
        type: 4,
        remark: '(________________)'
      }, {
        label: '其他',
        disable: false,
        remark: 0
      }]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      fetchList({
        resource: this.resource,
        filterBy: this.filterBy.map(item => item.name + '|' + item.type + '|' + item.value).join(';')
      })
      .then((data) => {
        this.originalList = data.data[0]
        data.data.map(item => {
          // 将所有time字段转时间格式
          let dataObj = {}
          Object.keys(item).map(key => {
            if (key.indexOf('Time') !== -1) {
              item[key] = moment(item[key]).format('YYYY年MM月DD日')
            }
            if (key.indexOf('Date') !== -1) {
              item[key] = moment(item[key]).format('YYYY年MM月DD日')
            }
            dataObj[key] = item[key]
          })
          this.getRelation(dataObj)
        })
      }).catch((error) => {
        console.log(error)
      })
    },
    splitDate (date) {
      return date.split(/[\u4e00-\u9fa5]/)
    },
    buttonListEvent (name) {
      if (name === 'back') {
        this.$router.go(-1)
      } else if (name === 'print') {
        this.CreatePage()
      }
    },
    getRelation (dataObj) {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        if (dataObj.clientType) {
          this.clientTypeList = data.clientType
        }
        if (dataObj.serviceType) {
          this.serviceTypeList = data.serviceType
        }
        this.dataList = dataObj
        let dataValue = {}
        let clientType = [] // 客户类型
        let serviceType = []// 服务类型
        Object.keys(data).map(key => {
          dataValue[key] = data[key].find(item => item.optionValue === this.dataList[key])
          this.dataList[key] = dataValue[key] ? dataValue[key].label : this.dataList[key]
          clientType.push(this.dataList.clientType)
          serviceType.push(this.dataList.serviceType)
        })
        this.checkedClientType = clientType
        this.checkedServiceType = serviceType
        this.computCheckBox()
      })
    }, // 计算多选框
    computCheckBox () {
      this.checkboxList.map(item => {
        if (item.remark) {
          if (item.type === 3) {
            item.remark = '合同号(' + this.dataList.pactNo + ')'
          }
        }
      })
    },
    CreatePage () { /* 打印 */
      let LODOP = getLodop()
      LODOP.PRINT_INITA(30, 10, 800, 1000, '')
      LODOP.ADD_PRINT_SETUP_BKIMG('<img src=' + getUrl() + '/printbg/pact.jpg?654651' + ' />')
      LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1)
      LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0)
      LODOP.SET_SHOW_MODE('BKIMG_TOP', -26)
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '197.91mm')
      LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '278mm')
      LODOP.ADD_PRINT_TEXT(82, 535, 44, 20, moment(this.originalList.applyTime, 'YYYY年MM月DD日').format('YYYY'))
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(82, 587, 31, 20, moment(this.originalList.applyTime, 'YYYY年MM月DD日').format('MM'))
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(82, 631, 28, 20, moment(this.originalList.applyTime, 'YYYY年MM月DD日').format('DD'))
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(108, 529, 154, 26, this.originalList.pactNo || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(286, 312, 138, 20, this.originalList.pactNo || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(472, 149, 492, 140, this.originalList.pactText || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(140, 123, 188, 20, this.originalList.clientName || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(140, 406, 57, 20, this.originalList.meterDiameter || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(140, 548, 114, 20, this.originalList.clientNo || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(175, 123, 57, 20, this.dataList.cardType || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(175, 274, 187, 20, this.originalList.cardNo || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.ADD_PRINT_TEXT(175, 552, 107, 25, this.originalList.clientContact || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(210, 130, 521, 20, this.originalList.clientAddress || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      switch (Number(this.originalList.serviceType)) {
        case 1:
          LODOP.ADD_PRINT_TEXT(249, 118, 30, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 2:
          LODOP.ADD_PRINT_TEXT(249, 106, 30, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 3:
          LODOP.ADD_PRINT_TEXT(249, 281, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 4:
          LODOP.ADD_PRINT_TEXT(249, 351, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 5:
          LODOP.ADD_PRINT_TEXT(249, 396, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 6:
          LODOP.ADD_PRINT_TEXT(249, 476, 30, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 7:
          LODOP.ADD_PRINT_TEXT(249, 521, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 8:
          LODOP.ADD_PRINT_TEXT(249, 571, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 9:
          LODOP.ADD_PRINT_TEXT(249, 616, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
      }
      switch (Number(this.originalList.serviceType)) {
        case 1:
          LODOP.ADD_PRINT_TEXT(289, 119, 29, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 2:
          LODOP.ADD_PRINT_TEXT(289, 176, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 3:
          LODOP.ADD_PRINT_TEXT(289, 226, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 4:
          LODOP.ADD_PRINT_TEXT(289, 486, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 5:
          LODOP.ADD_PRINT_TEXT(325, 134, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 6:
          LODOP.ADD_PRINT_TEXT(325, 181, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 7:
          LODOP.ADD_PRINT_TEXT(325, 226, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
        case 8:
          LODOP.ADD_PRINT_TEXT(325, 486, 31, 20, '√')
          LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
          break
      }
      LODOP.ADD_PRINT_TEXT(352, 206, 185, 20, this.originalList.clientOldName || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(352, 478, 181, 20, '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(400, 120, 121, 20, this.originalList.agentName || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(400, 318, 163, 20, this.originalList.agentIdcard || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(400, 543, 118, 20, this.originalList.agentContact || this.originalList.agentPhone || this.originalList.agentMobile)
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(421, 132, 40, 20, this.originalList.buildDate ? moment(this.originalList.buildDate, 'YYYY年MM月DD日').format('YYYY') : '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(420, 180, 31, 20, this.originalList.buildDate ? moment(this.originalList.buildDate, 'YYYY年MM月DD日').format('MM') : '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(420, 218, 31, 20, this.originalList.buildDate ? moment(this.originalList.buildDate, 'YYYY年MM月DD日').format('DD') : '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      // LODOP.ADD_PRINT_TEXT(422, 337, 63, 22, this.dataList.meterOuterNum || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      // LODOP.ADD_PRINT_TEXT(422, 475, 57, 20, this.dataList.meterType || '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.ADD_PRINT_TEXT(422, 609, 53, 20, '')
      LODOP.SET_PRINT_STYLEA(0, 'FontSize', 11)
      LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '725px')
      // LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '1000px')
      // LODOP.PRINT_DESIGN()
      LODOP.PREVIEW()
    }
  }
}
</script>

<style type="text/css" scoped>
table{width: 80%;text-align: center;border: 1px solid #000;border-collapse: inherit; border-top: 0px;margin: 0 auto;}
table .borders:nth-child(0){border-top: 0px;}
td{height: 38px;line-height: 38px;}
.h35{height: 35px;}
.h55{height: 55px;}
.bts{border-top: 1px solid #000000;}
.bbs{border-bottom: 1px solid #000000;}
.bls{border-left: 1px solid #000000;}
.brs{border-right: 1px solid #000000;}
.btd{border-top: 1px solid #000;}
.bbd{border-bottom: 1px solid #000;}
.bld{border-left: 1px solid #000;}
.brd{border-right: 1px solid #000;}
.borders td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
.borders td:nth-last-of-type(1){border-right: 0px;}
.borderd td{border: 1px solid #000; border-left: 0px; border-bottom: 0px;}
.borderd td:nth-last-of-type(1){border-right: 0px;}
.title{margin: 30px 0;}
.ws{text-indent: 1em}
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
.rel{position: relative;}
.abs{position: absolute;}
.title-style{
  width: 90%;
  text-align: right;
}
</style>