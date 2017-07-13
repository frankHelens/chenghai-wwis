<template>
<div>
  <h2 class="title tc">
    {{title}}
  </h2>
  <div style="width: 50%; margin: 0 auto;">
    <div style="float:left;width:33%">
        用户：{{dataList.clientName}}
    </div>
    <div style="float:left;width:33%">
        表号：{{dataList.meterNearNo}}
    </div>
    <div style="float:left;width:33%">
        口径：{{dataList.meterDiameter}}
    </div>
    <div style="margin-top:25px;clear:bold;">地址：我是地址</div>
  </div>
    
  <table cellspacing="0" cellpadding="0">
    <tr class="borders">
      <td>拆表原因</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders">
      <td>收费情况</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders">
      <td>复表日期</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders">
      <td>原表复装</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders">
      <td>换新表复装</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders">
      <td>原表校零</td>
      <td colspan="5"></td>
    </tr>
    <tr class="borders tl">
      <td rowspan="3" colspan="6" class="pl10 bs">
        经办人意见: 
        <p style="text-indent:2em;margin-top:10px;line-height:180%;">我户将遵守《汕头市城市供水用水条例》，按照澄海区自来水公司的有关规定，申请用水报装
        及鉴定合同等手续。</p>
      </td>
    </tr>
    <tr>
      <td></td>
    </tr>
    <tr>
      <td></td>
    </tr>
    <tr>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td colspan="2" class="tl">营业所(监察科)签名：</td>
      <td class="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
    </tr>
  </table> 
</div>
</template>

<script>
import { getMenus } from '../../auth'
import { fetchList } from '../../utils/api'

export default {
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/agreement')
    return {
      title: '澄海市自来水公司用户更换复表通知单',
      flowDefineId: menu.flowid,
      tableData: [],
      resource: 'installorder',
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        // value: menu.flowid
        value: 21
      }],
      dataList: {}
    }
  },
  created () {
    // this.getRelation()
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
          console.log(item)
          this.dataList = item
        })
      }).catch((error) => {
        console.log(error)
      })
    }, /* 获取数据 */
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          this.columns[key].options = data[key]
        })
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '联合勘查指派').id
        }]
      })
    }
  }
}
</script>

<style type="text/css" scoped>
table{width: 50%;text-align: center;border: 1px solid #000;border-collapse: inherit; border-top: 0px;margin: 0 auto;}
table .borders:nth-child(0){border-top: 0px;}
td{height: 42px;line-height: 42px;}
.h35{height: 35px;}
.h55{height: 55px;}
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
</style>

