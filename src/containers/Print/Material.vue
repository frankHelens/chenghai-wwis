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
  <div class="table">
    <div ref="title">
      <h1 class="title" style="text-align: center">{{title}}</h1> 
    </div>
    <div ref="material">
      <div class="top-table-style">
        <div>用户名称: {{installorder.clientName || ''}}</div>
        <div>{{nowDate}}</div>
      </div>
      <table cellpadding="0" cellspacing="0">
        <tr class="borders">
          <td v-for="title in titleList">{{title}}</td>
        </tr>
        <tr class="borders" v-for="data in dataList">
          <td width="100">{{data.productId.code}}</td>
          <td width="150">{{data.productId.name}}</td>
          <td width="150">{{data.productId.size}}</td>
          <td width="50">{{data.productId.unit}}</td>
          <td width="100">{{data.planNum}}</td>
          <td width="150">{{data.productId.costPrice}}</td>
          <td width="150">{{(data.productId.costPrice * data.planNum).toFixed(2)}}</td>
          <td width="80"></td>
          <td width="80"></td>
          <td width="80"></td>
          <td width="150"></td>
        </tr>
        <tr v-if="dataList.length <= 13" v-for="i in dataList.length<=13?13-dataList.length : 0">
          <td width="100"></td>
          <td width="150"></td>
          <td width="150"></td>
          <td width="50"></td>
          <td width="100"></td>
          <td width="150"></td>
          <td width="150"></td>
          <td width="80"></td>
          <td width="80"></td>
          <td width="80"></td>
          <td width="150"></td>
        </tr>
        <tr>
          <td>水表费</td>
          <td>{{costList.costMeter || ''}}</td>
          <td>管材费</td>
          <td colspan="2">{{costList.costPipe || ''}}</td>
          <td>配件费</td>
          <td>{{costList.costPart || ''}}</td>
          <td colspan="3">综合工资</td>
          <td>{{costList.costWage || ''}}</td>
        </tr>
      </table>
      <div class="top-table-style">
        <div>发料人：____________________</div>
        <div>领料人：____________________</div>
      </div> 
    </div>             
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
      title: '澄海区自来水公司安装工程材料计划表',
      flowId: this.$route.params.id,
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary'
      }, {
        name: 'print',
        label: '打印',
        style: 'primary'
      }],
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        value: this.$route.params.id
      }],
      dataList: [],
      pageIndex: 1,
      titleList: ['货号', '材料名称', '规格', '单位', '预计数量', '单价', '总价', '退回数量', '实用数量', '增加数', '备注'],
      costList: [],
      nowDate: moment().format('YYYY年MM月DD日'),
      installorder: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      // 材料接口
      fetchList({
        resource: 'installProductPlan/' + this.flowId
      })
      .then((data) => {
        this.getRelation(data)
      }).catch(() => {
      })
      // 材料费用接口
      fetchList({
        resource: 'installCost/' + this.flowId
      })
      .then((data) => {
        this.costList = data
      }).catch(() => {
      })
      fetchList({
        resource: 'installorder/' + this.flowId,
        filterBy: this.filterBy.map(item => item.name + '|' + item.type + '|' + item.value).join(';')
      })
      .then((data) => {
        console.log(data)
        this.installorder = data
      }).catch((err) => {
        console.log(err)
      })
    },
    getRelation (dataList) {
      fetchList({
        resource: 'installProductPlan/relation'
      })
      .then((data) => {
        this.dataList = dataList
        dataList.map(item => {
          // 获取dataList的内容
          const productId = data.productId.find(product => item.productId === product.id)
          item.productId = productId
          // 获取dataList对应的relation
          Object.keys(data).map(key => {
            const rel = data[key].find(findItem => item.productId[key] === findItem.optionValue)
            item.productId[key] = rel ? rel.label ? rel.label : item.productId[key] : ''
          })
        })
      })
    },
    buttonListEvent (name) {
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
          height: 42px; 
        }
        table td{
          text-align: center;
          border: 1px solid #000;
          height: 42px;
        }
        .top-table-style div{
          float: left;
          width: 50%;
          text-align: center;
          margin: 10px 0;
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
          width: 85%;
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
      const material = this.$refs.material.innerHTML
      const title = this.$refs.title.innerHTML
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(60, 50, 700, 920, css + material)
      LODOP.ADD_PRINT_HTM(26, '5%', '90%', 100, css + title)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_HTM(1000, '40%', 300, 100, '总页号：<font color="#0000ff" format="ChineseNum" style="color:#000;"><span tdata="pageNO">第##页</span>/<span tdata="pageCount">共##页</span></font>')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
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
  width: 80%
  margin: 0 auto
  th
    text-align: center
    border: 1px solid #000
    height: 42px
  td
    @extend th
  .top-table-style
    font-size: 18px
    div
      margin: 10px 0
      float: left
      width: 50%
      text-indent: 2em
    div:nth-child(1)
      text-align:left
    div:nth-child(2)
      text-align:center
</style>