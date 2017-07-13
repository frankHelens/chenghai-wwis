<template>
  <div style='display: none;'>
    <div ref="title">
      <h2>{{title}}</h2>
    </div>
    <div ref="table">
      <table id="table" cellspacing="0" border="1">
        <tr class="border">
          <td>序号</td>
          <td v-for="th in titleList">{{th.label}}</td>
        </tr>
        <tr class="border" v-for="(data, index) in dataList">
          <td>{{index+1}}</td>
          <td v-for="title in titleList">
            {{data[title.prop]}}
          </td>
        </tr>
      </table>
    </div>
    <div ref="footer">
      <p><span>打印人：{{this.getUserName}}</span><span>打印日期：{{this.nowDate}}</span></p>
    </div>
  </div>
</template>

<script>
import { getLodop } from '../../../utils/LodopFuncs'
import moment from 'moment'
import { getRealname } from '../../../auth'

export default {
  props: {
    title: {
      type: String
    },
    dataList: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Array,
      default: () => []
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    settleTime: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      getUserName: getRealname(),
      nowDate: moment().format('YYYY年MM月DD日')
    }
  },
  watch: {
    isPrint (bol) {
      if (bol) {
        this.printEvent()
        this.$emit('printChange', !bol)
        // 组件内对printChange变更后向外部发送事件通知
      }
    }
  },
  methods: {
    printEvent () {
      const css = `<style>
        div {
          display: block !important;
        }
        h2 {
          text-align: center;
        }
        table {
          width: 100%;
        }
        .title {
          text-align: center;
          text-decoration: underline;
        }
        tr,td {
          height: 40px;
        }
        p span{margin-right:20px;}
        .time-style {
          width: 300px;
          text-align: right;
        }
      </style>`
      const html = this.$refs.table.innerHTML
      const title = this.$refs.title.innerHTML
      const footer = this.$refs.footer.innerHTML
      const settleTime = `<div class="time-style">${this.settleTime || ''}</div>`
      let LODOP = getLodop()
      // 标题
      LODOP.ADD_PRINT_HTM(20, 0, 700, 900, css + title)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 查询事件
      LODOP.ADD_PRINT_HTM(30, 430, 300, 900, css + settleTime)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 内容
      LODOP.ADD_PRINT_HTM(60, 30, 700, 900, css + html)
      // 打印人 跟 时间
      LODOP.ADD_PRINT_HTM(900, '5%', '80%', 100, css + footer)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
       // 分页
      LODOP.ADD_PRINT_HTM(900, '70%', 300, 100, '总页号：<font color="#0000ff" format="ChineseNum" style="color:#000;"><span tdata="pageNO">第##页</span>/<span tdata="pageCount">共##页</span></font>')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.PREVIEW()
    }
  }
}
</script>