<template>
<div class="print-style">
  <h1>{{title}}</h1>
  <section style="margin:0 auto 30px;display: table;" v-for="pageIndex in pageTotal">
    <ul class="topBox">
      <li>用户名称 </li>
      <li class="flex">此处用户名称</li>
      <li>{{operatTime}}</li>
    </ul>
    <table cellspacing="0" cellpadding="0">
      <tr>
        <th rowspan="3" class="w25">编<br />号</th>
        <th rowspan="3" class="w25">型<br />号</th>
        <th colspan="10">材料</th>
        <th colspan="7">工费</th>
        <th rowspan="3" class="w55">结算<br />项目</th>
        <th rowspan="2" colspan="7" class="w100">金额</th>
      </tr>
      <tr>
        <th rowspan="2" class="w100">名称</th>
        <th rowspan="2" class="w30">单位</th>
        <th rowspan="2" class="w40">数量</th>
        <th rowspan="2" class="w40">单价<br>（元）</th>
        <th colspan="6" class="w90">金额</th>
        <th rowspan="2" class="w40">定额</th>
        <th colspan="6" class="w90">金额</th>
      </tr>
      <tr>
        <th>千</th>
        <th>百</th>
        <th>十</th>
        <th>元</th>
        <th>角</th>
        <th>分</th>
        <th>千</th>
        <th>百</th>
        <th>十</th>
        <th>元</th>
        <th>角</th>
        <th>分</th>
        <th>万</th>
        <th>千</th>
        <th>百</th>
        <th>十</th>
        <th>元</th>
        <th>角</th>
        <th>分</th>
      </tr>
      <tr v-for="(i,index) in pageSize">
        <td>{{i + (pageIndex - 1) * pageSize}}</td>
        <template v-if="materialList[index + (pageIndex - 1) * pageSize]">
          <td>{{materialList[index + (pageIndex - 1) * pageSize].size}}</td>
          <td>{{materialList[index + (pageIndex - 1) * pageSize].label}}</td>
          <td>{{materialList[index + (pageIndex - 1) * pageSize].unit}}</td>
          <td>{{materialList[index + (pageIndex - 1) * pageSize].planNum}}</td>
          <td>{{materialList[index + (pageIndex - 1) * pageSize].price}}</td>
          <td v-for="j in 6">{{materialList[index + (pageIndex - 1) * pageSize].costReverse[6-j]}}</td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
          <td> </td>
        </template>
        <template v-else>
          <td v-for="j in 18"> </td>
        </template>
        <template v-if="index<pageSize-7">
          <template v-if="budgetList[index] && pageIndex === 1">
              <td>{{budgetList[index].label}}</td>
              <td v-for="j in 7">{{budgetList[index].costReverse[7-j]}}</td>
          </template>
          <template v-else>
              <td v-for="j in 8"> </td>
          </template>
        </template>
        <template v-else-if="index===pageSize-7">
          <td rowspan="6" :colspan="8" valign="top">备&nbsp;&nbsp;&nbsp;&nbsp;注<p></p></td>
        </template>
        <template v-else-if="index===pageSize-1">
          <td colspan="8" class="sign">领料人签名:</td>
        </template>
        <template v-else>
        </template>
      </tr>
    </table>
    <ul class="topBox">
      <li>计算员:</li>
      <li class="flex"></li>
      <li>收款员:</li>
      <li class="flex"></li>
      <li>保管员:</li>
      <li class="flex"></li>
      <li>第{{pageIndex}}页，共{{pageTotal}}页</li>
    </ul>
  </section>
</div>
</template>

<script>
import { fetchList } from '../../utils/api'
import moment from 'moment'
export default {
  name: 'print-account',
  data () {
    return {
      flowId: this.$route.params.id,
      pageSize: 20,
      title: '海丰县供水总公司工程安装结算表',
      operatTime: moment().format('YYYY年M月D日'),
      user: '',
      materialList: [],
      budgetList: [],
      budget: {
        costDeposit: {
          label: '用水按金'
        },
        costDesign: {
          label: '设计费'
        },
        costEngineering: {
          label: '工程费'
        },
        costMeter: {
          label: '水表费'
        },
        costMisc: {
          label: '杂工费'
        },
        costPipe: {
          label: '主管材料费'
        // },
        // costPrepaid: {
        //   label: '预交水费'
        // },
        // costOther: {
        //   label: '其它'
        }
      },
      relation: {
      }
    }
  },
  created () {
    this.getBudgetList()
    this.getUser()
    this.getRelation()
  },
  computed: {
    pageTotal () {
      return Math.ceil(this.materialList.length / this.pageSize)
    }
  },
  methods: {
    getUser () {
      fetchList({
        resource: 'installorder/' + this.flowId
      })
      .then((data) => {
        console.log(data)
      })
    },
    getBudgetList () {
      fetchList({
        resource: 'installCost/' + this.flowId
      })
      .then((data) => {
        this.budgetList = Object.keys(this.budget).map(item => {
          return {
            name: item,
            label: this.budget[item].label,
            costReverse: data[item] ? data[item].toFixed(2).replace('.', '').split('').reverse() : []
          }
        })
      })
    },
    getRelation (value) {
      fetchList({
        resource: 'installProductPlan/relation'
      })
      .then((data) => {
        this.relation.productId = data.productId.map(item => {
          return {
            ...item,
            label: item.name
          }
        })
        this.relation.type = data.type
        this.relation.unit = data.unit
        this.relation.size = data.size
        this.getMaterial()
      })
    }, /* 获取当前资源所关联的数据，并填到对应的列里 */
    getMaterial () {
      this.tableData = []
      this.onLoad = true
      fetchList({
        resource: 'installProductPlan/' + this.flowId
      })
      .then((data) => {
        this.onLoad = false
        const materialList = data.map(product => {
          const productOptions = this.relation.productId.find(item => item.id === product.productId)
          const cost = productOptions.costPrice * product.planNum
          return {
            ...productOptions,
            ...product,
            unit: this.relation.unit.find(item => item.id === productOptions.unit).label,
            type: this.relation.type.find(item => item.id === productOptions.type).label,
            size: this.relation.size.find(item => item.id === productOptions.size).label,
            price: productOptions.costPrice.toFixed(2),
            costReverse: cost.toFixed(2).replace('.', '').split('').reverse()
          }
        })
        this.materialList = [
          ...materialList
        ]
      }).catch(() => {
        this.onLoad = false
      })
    }
  }
}
</script>

<style type="text/css" scoped>
  .w15{width: 15px;}
  .w20{width: 20px;}
  .w25{width: 25px;}
  .w30{width: 30px;}
  .w40{width: 40px;}
  .w55{width: 55px;}
  .w90{width: 90px;}
  .w100{width: 100px;}
  .print-style .border{border-right: 1px solid #000;border-bottom: 1px solid #000;}
  .bb{border-bottom: 1px solid #000;}
  .f12{font-size: 12px;}
  .print-style table{border-top: 1px solid #000;border-left: 1px solid #000;margin-bottom: 10px;}
  .print-style th{border-right: 1px solid #000;border-bottom: 1px solid #000;text-align: center;}
  .print-style td{border-right: 1px solid #000;border-bottom: 1px solid #000;text-align: center;}
  .print-style td.sign{text-align: left;padding-left: 5px;box-sizing: border-box;}
  th{height: 30px;}
  td{height: 40px;}
  li{list-style: none;}
  h1{font-size: 32px;text-align: center;margin-bottom: 25px;}
  .topBox{display: -webkit-flex;display: -moz-box;display: flex;margin-bottom: 10px;}
  .flex{-webkit-flex: 1;-moz-box-flex: 1;flex: 1;padding-left: 10px;box-sizing: border-box;}
</style>