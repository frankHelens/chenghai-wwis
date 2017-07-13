<template>
<div v-loading="onLoad">
  <div class="clearfix">
    <div class="btn-style">
      <el-button
        v-for="btn in titleBtnList"
        :icon="btn.icon"
        type="primary"
        @click="titleEvent(btn.name)">
        {{btn.label}}
      </el-button>
    </div>
  </div>
  <el-dialog title="提示" v-model="saveDialogVisible" size="tiny">
    <span class="save">{{dialogLabel}}</span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveDialogEvent">确 定</el-button>
      <el-button @click="cancelDialogEvent">取 消</el-button>
    </span>
  </el-dialog>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <div class="commit-date">
          {{applyTime}}
      </div>
      <el-table
        :data="dataList"
        border
        stripe
        height="450"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="70">
        </el-table-column>
        <el-table-column
          v-for="data in tableList"
          :prop="data.prop"
          :label="data.label"
          :min-width="data.width">
        </el-table-column>
      </el-table>
      <templet
        :titleList="tableList"
        :dataList="dataList"
        :isPrint="isPrint"
        :title="title"
        @printChange="printChange"
      />
    </div>
  </div>
</div>
</template>

<script>
import { fetchList, fetch } from '../../../utils/api'
import moment from 'moment'
import tableExport from 'table-export'
import Templet from './Templet'

export default {
  components: {
    Templet
  },
  data () {
    return {
      title: '统计报表明细',
      resource: 'statistics/' + this.$route.query.resource,
      applyTime: this.$route.query.applyTime,
      orderStatus: this.$route.query.orderStatus,
      serviceType: this.$route.query.serviceType,
      isPrint: false,
      onLoad: true,
      data: {},
      dataType: 'date',
      titleBtnList: [{
        name: 'back',
        label: '返回',
        icon: 'arrow-left'
      }, {
        name: 'export',
        label: '导出',
        icon: 'upload'
      }, {
        name: 'print',
        label: '打印'
      }],
      selectValue: 0,
      selectOptions: [],
      dataList: [],
      basicList: [{
        prop: 'clientNo',
        label: '户号',
        width: '150'
      }, {
        prop: 'clientName',
        label: '客户名称',
        width: '100'
      }, {
        prop: 'meterNearNo',
        label: '近表号',
        width: '100'
      }, {
        prop: 'clientAddress',
        label: '用水地址',
        width: '150'
      }, {
        prop: 'clientContact',
        label: '客户电话',
        width: '150'
      }, {
        prop: 'meterDiameter',
        label: '水表口径',
        width: '130'
      }, {
        prop: 'clientType',
        label: '用水性质',
        width: '100'
      }, {
        prop: 'userCount',
        label: '用水人数',
        width: '100'
      }, {
        prop: 'meterOuterNum',
        label: '水表外码',
        width: '100'
      }, {
        prop: 'buildDate',
        label: '安装日期',
        width: '150'
      }],
      dialogLabel: '是否导出页面',
      saveDialogVisible: false,
      isExport: false
    }
  },
  created () {
    this.getRelation()
  },
  computed: {
    tableList () {
      /**
      新装  1  户号去掉
      过户  3  户号 原用户名 继承户名
      调基  4  原用水基数 现用水基数
      增容  5  原水表口径 现水表口径
      移表  6  原用水地址 现用水地址
      调价  7  原水价    现水价 原用水性质 用水性质
      **/
      if (this.serviceType === '1') {
        return this.basicList.splice(1)
      }
      if (this.serviceType === '3') {
        return [{
          prop: 'clientOldName',
          label: '原用户名称',
          width: '110'
        }, {
          prop: 'clientNewName',
          label: '继承户名称',
          width: '110'
        }, ...this.basicList]
      }
      if (this.serviceType === '4') {
        return [{
          prop: 'quantityOldBase',
          label: '原用水基数',
          width: '10'
        }, {
          prop: 'quantityBase',
          label: '用水基数',
          width: '10'
        }, ...this.basicList]
      }
      if (this.serviceType === '5') {
        return [{
          prop: 'meterOldDiameter',
          label: '原水表口径',
          width: '110'
        }, {
          prop: 'meterDiameter',
          label: '水表口径',
          width: '100'
        }, ...this.basicList]
      }
      if (this.serviceType === '6') {
        return [{
          prop: 'clientOldAddress',
          label: '原用水地址',
          width: '110'
        }, {
          prop: 'clientAddress',
          label: '用水地址',
          width: '110'
        }, ...this.basicList]
      }
      if (this.serviceType === '7') {
        return [{
          prop: 'priceOldBase',
          label: '原水价',
          width: '100'
        }, {
          prop: 'priceBase',
          label: '现水价',
          width: '100'
        }, {
          prop: 'clientOldType',
          label: '原用水性质',
          width: '110'
        }, {
          prop: 'clientType',
          label: '用水性质',
          width: '100'
        }, ...this.basicList]
      }
    }
  },
  methods: {
    startDateChange (value) {
      if (value) {
        this.startDateValue = value
      }
    },
    endDateChange (value) {
      if (value) {
        this.endDateValue = value
      }
    },
    checkDate (start, end) {
      if (start !== '' && end !== '') {
        this.getRelation()
      }
    },
    getRelation () {
      fetchList({
        resource: 'statistics/relation'
      })
      .then(rel => {
        this.getData(rel)
      })
    },
    getData (relation) {
      fetch({
        method: 'get',
        url: this.resource,
        params: {
          startDate: this.applyTime,
          endDate: this.applyTime,
          orderStatus: this.orderStatus || 0,
          serviceType: this.serviceType
        }
      }).then(data => {
        this.setDataList(data.data, relation)
      })
    },
    setDataList (data, relation) {
      this.dataList = data.filter(filterItem => {
        return !!filterItem
      }).map(item => {
        item.applyTime = moment(item.applyTime).format('YYYY年MM月DD日')
        item.buildDate = item.buildDate ? moment(item.buildDate).format('YYYY年MM月DD日') : ''
        Object.keys(relation).map(key => {
          item[key] = relation[key].find(relItem => relItem.id === item[key]) ? relation[key].find(relItem => relItem.id === item[key]).label : ''
        })
        return item
      })
      this.onLoad = false
    },
    titleEvent (name) {
      if (name === 'export') {
        this.saveDialogVisible = true
        this.isExport = true
      }
      if (name === 'back') {
        this.$router.go(-1)
      }
      if (name === 'print') {
        this.isPrint = true
      }
    },
    saveDialogEvent () {
      tableExport('table', '统计报表明细', 'csv')
      this.isExport = false
      this.saveDialogVisible = false
    },
    cancelDialogEvent () {
      this.saveDialogVisible = false
      this.isExport = false
    },
    printChange (val) {
      this.isPrint = val
    }
  }
}
</script>

<style lang="sass" scoped>
.btn-style
  float: left
  margin-right: 12px
.border
  border-right: 1px solid #000
  border-bottom: 1px solid #000
  text-align: center
  td
    border-right: 1px solid #000
    height: 38px 
.title
  text-align: center
  letter-spacing: 10px
.main
  width: 100%
  margin: 30px auto
  table
    border: 1px solid #000
  .commit-date
    text-align: right
    margin-bottom: 10px
    color: rgb(31, 48, 61)
  .bottom-msg
    text-align: center
    margin-top: 20px
    span:nth-child(1)
      margin-right: 100px
</style>