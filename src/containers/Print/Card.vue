<template>
  <div class="main">
    <div class="button-content">
      <el-button
        v-for="button in buttonList"
        :type="button.style"
        @click="buttonListEvent(button.name, button.validate)">
        {{button.label}}
      </el-button>
    </div>
    <div class="top-msg">
      <ul>
        <li>户名：{{dataList.clientName || ''}}</li>
        <li>合同号：{{dataList.pactNo || ''}}</li>
        <li>分类性质：{{dataList.useType || ''}}</li>
        <li>户号：{{dataList.clientNo || ''}}</li>
      </ul>
      <ul>
        <li>地址：{{dataList.clientOldAddress || ''}}</li>
        <li>新地址：{{dataList.clientAddress || ''}}</li>
        <li>信用记录：</li>
      </ul>
      <ul>
        <li>计划用水量：{{dataList.quantityBase || ''}}M³/月</li>
        <li>联系人：{{dataList.clientName || ''}}</li>
        <li>电话：{{dataList.clientPhone || ''}}</li>
        <li>表况：</li>
        <li>还款方式：
          <el-checkbox label="托收" :disabled="true"></el-checkbox>
          <el-checkbox label="现金" :disabled="true"></el-checkbox>
        </li>
      </ul>
      <table class="mid-chart">
        <tr>
          <td colspan="5">安装日期</td>
          <td colspan="4">口径(mm)</td>
          <td colspan="2" rowspan="4">换<br>表<br>记<br>录</td>
          <td colspan="3">日期</td>
          <td colspan="4">水表外码</td>
          <td colspan="2" rowspan="4">单价<br>变动<br>记录</td>
          <td colspan="3">日期</td>
          <td colspan="3">单价</td>
          <td colspan="2" rowspan="4">联系<br>电话<br>变更<br>记录</td>
          <td colspan="4">日期</td>
          <td colspan="4">联系电话</td>
        </tr>
        <tr>
          <td colspan="5">{{dataList.buildDate || ''}}</td>
          <td colspan="4">{{dataList.meterDiameter || ''}}</td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="3"></td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="5">施工人员</td>
          <td colspan="4">表型</td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="3"></td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="5">{{''}}</td>
          <td colspan="4">{{''}}</td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="3"></td>
          <td colspan="3"></td>
          <td colspan="4"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="3">抄表日期</td>
          <td colspan="7">抄见行码</td>
          <td colspan="6">实用水量</td>
          <td colspan="2">备注</td>
          <td colspan="3">抄表日期</td>
          <td colspan="7">抄件行码</td>
          <td colspan="6">实用水量</td>
          <td colspan="2">备注</td>
        </tr>
        <tr>
          <td v-for="item in unit">{{item}}</td>
          <td colspan="2"></td>
          <td v-for="item in unit">{{item}}</td>
          <td colspan="2"></td>
        </tr>
        <tr v-for="item in 12">
          <td v-for="(index, item) in 34" :colspan="index===16?2:0"></td>
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
      unit: ['年', '月', '日', '百', '十', '万', '千', '百', '十', '个', '十', '万', '千', '百', '十', '个'],
      dataList: {},
      flowId: this.$route.params.id,
      resource: 'installorder',
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        value: this.$route.params.id
      }],
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
    buttonListEvent (name) {
      if (name === 'back') {
        this.$router.go(-1)
      } else if (name === 'print') {
        this.CreatePage(this.dataList)
      }
    },
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
        console.log(this.dataList)
      })
    },
    CreatePage (data) { // 打印
      let LODOP = getLodop()
      LODOP.PRINT_INITA(0, 0, 800, 1000, '')
      LODOP.ADD_PRINT_TEXT(45, 100, 195, 20, data.clientName)
      LODOP.ADD_PRINT_TEXT(45, 359, 52, 20, data.pactNo)
      LODOP.ADD_PRINT_TEXT(45, 505, 61, 20, data.clientType)
      LODOP.ADD_PRINT_TEXT(45, 598, 119, 20, data.clientNo)
      LODOP.ADD_PRINT_TEXT(65, 96, 203, 19, data.clientOldAddress)
      LODOP.ADD_PRINT_TEXT(65, 358, 203, 20, data.clientAddress)
      LODOP.ADD_PRINT_TEXT(65, 622, 96, 20, '')
      LODOP.ADD_PRINT_TEXT(88, 132, 49, 18, '')
      LODOP.ADD_PRINT_TEXT(87, 261, 71, 19, data.agentName)
      LODOP.ADD_PRINT_TEXT(86, 372, 92, 20, data.applyPhone || data.applyMobile)
      LODOP.ADD_PRINT_TEXT(89, 504, 63, 20, '')
      // LODOP.ADD_PRINT_TEXT(90, 650, 55, 20, '√')
      LODOP.ADD_PRINT_TEXT(134, 70, 100, 20, data.buildDate)
      LODOP.ADD_PRINT_TEXT(136, 174, 55, 20, data.meterDiameter)
      // LODOP.ADD_PRINT_TEXT(181, 84, 69, 20, data.builder)
      // LODOP.ADD_PRINT_TEXT(182, 172, 55, 20, data.meterType)
      LODOP.ADD_PRINT_SETUP_BKIMG('<img src=' + getUrl() + '/printbg/card.jpg?111' + ' />')
      LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1)
      LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0)
      LODOP.SET_SHOW_MODE('BKIMG_TOP', 0)
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '700px')
      // LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '1000px')
      // LODOP.PRINT_DESIGN()
      LODOP.PREVIEW()
    }
  }
}
</script>

<style scoped lang="sass">
.main
  >div:nth-child(2)
    width: 80%
    margin: 20px auto
.top-msg
  ul
    display: -webkit-flex
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    justify-content: space-between
    li
table.mid-chart td
  width: 34px
  height: 30px
  font-size: 16px
table.mid-chart
  border: 1px solid #000
  text-align: center
table.mid-chart td
  border: 1px solid #000
td.underline
  border-bottom: 1px solid #000
table.underline-chart td
  width: 32px
  height: 18px
  font-size: 16px
.underline-chart
  width: 100%
  text-align: left
</style>
