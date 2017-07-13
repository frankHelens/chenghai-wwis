<template>
<div v-loading="onLoad">
  <div class="clearfix">
    <div class="btn-style">
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        placeholder="选择日期范围">
      </el-date-picker>
      </el-date-picker>
      <el-select v-model="selectValue" placeholder="请选择工单状态">
        <el-option
          v-for="item in selectOptions"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
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
          {{settleTime}}
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
          v-for="data in titleList"
          :prop="data.prop"
          :label="data.label"
          :min-width="data.width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="120">
          <template scope="scope">
            <el-button
              @click.native.prevent="operationEvent(scope.$index, scope.row)"
              type="text"
              size="small">
              查看明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <templet
        :titleList="titleList"
        :dataList="dataList"
        :isPrint="isPrint"
        :title="title"
        :settleTime="settleTime"
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
      title: '用户业务统计报表',
      resource: 'statistics/orderInstall',
      data: {},
      onLoad: true,
      settleTime: moment().format('YYYY年MM月'),
      dataType: 'date',
      isPrint: false,
      titleBtnList: [{
        name: 'query',
        label: '查询',
        icon: 'search'
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
      serviceType: [],
      dateRange: [new Date(moment().startOf('month')), new Date(moment().endOf('month'))],
      dataList: [],
      titleList: [{
        prop: 'applyTime',
        label: '办理时间',
        width: '150'
      }, {
        prop: 'orderStatus',
        label: '工单状态',
        width: '130'
      }, {
        prop: 'serviceType',
        label: '服务类型',
        width: '140'
      }, {
        prop: 'total',
        label: '办理数量',
        width: '130'
      }],
      dialogLabel: '是否导出页面',
      saveDialogVisible: false,
      isExport: false
    }
  },
  created () {
    this.getRelation()
  },
  methods: {
    getRelation () {
      fetchList({
        resource: 'statistics/relation'
      })
      .then(rel => {
        this.selectOptions = rel.orderStatus
        this.serviceType = rel.serviceType
        this.getData(rel)
      })
    },
    getData (relation) {
      console.log(this.dateRange)
      // 设置时间段
      if (this.dateRange) {
        if (this.dateRange[0] === null) {
          this.$message({
            message: '请输入搜索日期',
            type: 'error'
          })
          this.onLoad = false
        } else {
          const startDate = moment(this.dateRange[0]).format('YYYY年MM月DD日')
          const endDate = moment(this.dateRange[1]).format('YYYY年MM月DD日')
          this.settleTime = startDate === endDate ? startDate : startDate + '－' + endDate
          fetch({
            method: 'get',
            url: this.resource,
            params: {
              startDate: moment(this.dateRange[0]).format('YYYY-MM-DD'),
              endDate: moment(this.dateRange[1]).format('YYYY-MM-DD'),
              orderStatus: this.selectValue || 0
            }
          }).then(data => {
            this.setDataList(data.data, relation)
          })
          this.onLoad = false
        }
      } else {
        this.$message({
          message: '请输入搜索日期',
          type: 'error'
        })
        this.onLoad = false
      }
    },
    setDataList (data, relation) {
      // 判断是否是完成，显示成完成的时间
      if (this.selectValue === 2) {
        this.titleList.map(title => {
          if (title.prop === 'applyTime') {
            title.label = '完成时间'
          }
        })
      } else {
        this.titleList.map(title => {
          if (title.prop === 'applyTime') {
            title.label = '办理时间'
          }
        })
      }
      this.dataList = data.filter(filterItem => {
        return !!filterItem
      }).map(item => {
        item.applyTime = moment(item.applyTime).format('YYYY年MM月DD日')
        item.meterDiameter = item.meterDiameter ? relation.meterDiameter.find(findItem => findItem.id === item.meterDiameter).label : ''
        item.orderStatus = item.orderStatus ? relation.orderStatus.find(findItem => findItem.id === item.orderStatus).label : ''
        item.serviceType = item.serviceType ? relation.serviceType.find(findItem => findItem.id === item.serviceType).label : ''
        item.clientType = item.clientType ? relation.clientType.find(findItem => findItem.id === item.clientType).label : ''
        return item
      })
    },
    operationEvent (key, data) {
      this.$router.push({
        path: '/install/statistics/detail',
        query: {
          applyTime: moment(data.applyTime, 'YYYY年MM月DD日').format('YYYY-MM-DD'),
          orderStatus: this.selectOptions.find(item => data.orderStatus === item.label).id,
          serviceType: this.serviceType.find(item => data.serviceType === item.label).id,
          resource: 'orderDetail'
        }
      })
    },
    titleEvent (name) {
      if (name === 'export') {
        this.saveDialogVisible = true
      }
      if (name === 'query') {
        this.onLoad = true
        this.getRelation()
      }
      if (name === 'print') {
        // this.CreatePage()
        this.isPrint = true
      }
    },
    saveDialogEvent () {
      tableExport('table', '用户业务统计报表', 'csv')
      this.saveDialogVisible = false
    },
    cancelDialogEvent () {
      this.saveDialogVisible = false
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