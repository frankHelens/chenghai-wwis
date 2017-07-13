<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <servertable class="datatable"
        v-if="hasRelation"
        :label="label"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
        :columnsObject="columns"
        :toolbar = "toolbar"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        :serviceList="serviceTypeList"
        :customOperation="customOperation"
        @customOperationEvent="customOperationEvent"
        @changeService="changeService"
      >
      </servertable>
    </div>
  </div>
</template>

<script>
import { fetchList } from '../../utils/api'
import Servertable from '../../components/Datatable/Servertable'
// import { isNumber } from 'lodash'

export default {
  name: 'record',
  components: {
    Servertable
  },
  data () {
    return {
      resource: 'installorder',
      title: '综合进度查询',
      label: '综合进度查询',
      labelName: 'name',
      relation: true,
      toolbar: {
        export: true
      },
      hasRelation: false,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'clientNo', 'clientName', 'meterDiameter', 'clientContact', 'userCount', 'clientType', 'createTime', 'applyTime', 'orderStatus'],
      tableFullList: ['orderCode', 'clientNo', 'clientOldName', 'clientName', 'quantityOldBase', 'quantityBase', 'priceOldBase', 'priceBase', 'clientOldType', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus'],
      serviceTypeList: [],
      serviceList: [{ // 全部
        optionValue: 0,
        tableInitList: ['orderCode', 'clientNo', 'clientName', 'meterDiameter', 'clientContact', 'userCount', 'clientType', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'clientOldName', 'clientName', 'quantityOldBase', 'quantityBase', 'priceOldBase', 'priceBase', 'clientOldType', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 新装
        optionValue: 1,
        tableInitList: ['orderCode', 'clientNo', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 过户
        optionValue: 3,
        tableInitList: ['orderCode', 'clientNo', 'clientOldName', 'clientNewName', 'clientAddress', 'meterDiameter', 'clientContact', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'clientOldName', 'clientNewName', 'clientAddress', 'meterDiameter', 'clientContact', 'agentName', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 调整用水基数
        optionValue: 4,
        tableInitList: ['orderCode', 'clientNo', 'quantityOldBase', 'quantityBase', 'userOldCount', 'userCount', 'clientName', 'clientAddress', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'quantityOldBase', 'quantityBase', 'userOldCount', 'userCount', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 增容
        optionValue: 5,
        tableInitList: ['orderCode', 'clientNo', 'clientName', 'clientAddress', 'meterOldDiameter', 'meterDiameter', 'clientContact', 'userCount', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'clientName', 'clientAddress', 'meterOldDiameter', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 移表
        optionValue: 6,
        tableInitList: ['orderCode', 'clientNo', 'clientName', 'clientOldAddress', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'clientName', 'clientOldAddress', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType', 'createTime', 'applyTime', 'orderStatus']
      }, { // 调整价格
        optionValue: 7,
        tableInitList: ['orderCode', 'clientNo', 'priceOldBase', 'priceBase', 'clientOldType', 'clientType', 'clientName', 'clientAddress', 'createTime', 'applyTime', 'orderStatus'],
        tableFullList: ['orderCode', 'clientNo', 'priceOldBase', 'priceBase', 'clientOldType', 'clientType', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'cardType', 'cardNo', 'userCount', 'createTime', 'applyTime', 'orderStatus']
      }],
      columns: {
        orderCode: {
          label: '流水编号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        flowInstanceId: {
          label: '工单号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        meterOldDiameter: {
          label: '原水表口径',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        meterDiameter: {
          label: '水表口径',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        orderStatus: {
          label: '归档状态',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        createTime: {
          label: '创建时间',
          type: 'time',
          sort: true
        },
        applyTime: {
          label: '办理时间',
          type: 'time',
          sort: true
        },
        updateTime: {
          label: '操作时间',
          type: 'time'
        },
        clientName: {
          label: '客户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientNo: {
          label: '户号',
          filter: {
            type: 'input'
          }
        },
        cardType: {
          label: '证件名称',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        cardNo: {
          label: '证件号码',
          filter: {
            type: 'input'
          }
        },
        clientPhone: {
          label: '客户固话',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientContact: {
          label: '客户手机',
          filter: {
            type: 'input',
            like: true
          }
        },
        agentContact: {
          label: '客户手机',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientOldAddress: {
          label: '原用水地址',
          width: '180px',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientAddress: {
          label: '用水地址',
          width: '180px',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientType: {
          label: '用水性质',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        clientOldType: {
          label: '原用水性质',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          },
          width: '120px'
        },
        serviceType: {
          label: '服务项目',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        clientOldName: {
          label: '原用户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientNewName: {
          label: '继承户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        quantityOldBase: {
          label: '原用水基数',
          filter: {
            type: 'input',
            like: true
          }
        },
        quantityBase: {
          label: '用水基数',
          filter: {
            type: 'input',
            like: true
          }
        },
        agentName: {
          label: '申办人'
        },
        applyIdcard: {
          label: '申办人身份证号码'
        },
        applyPhone: {
          label: '申办人联系电话固话'
        },
        applyMobile: {
          label: '申办人手机号码'
        },
        buildDate: {
          label: '安装日期',
          type: 'time'
        },
        meterOuterNum: {
          label: '水表外码'
        },
        meterType: {
          label: '水表表型'
        },
        cfmVerifyRemark: {
          label: '审核施工完成备注'
        },
        builder: {
          label: '施工员'
        },
        meterNearNo: {
          label: '近表号'
        },
        stepDefineId: {
          label: '流程定义'
        },
        userCount: {
          label: '用水人数',
          filter: {
            type: 'input',
            like: true
          }
        },
        userOldCount: {
          label: '原用水人数',
          filter: {
            type: 'input',
            like: true
          }
        },
        priceOldBase: {
          label: '原水价',
          filter: {
            type: 'input',
            like: true
          }
        },
        priceBase: {
          label: '现水价',
          filter: {
            type: 'input',
            like: true
          }
        }
      },
      filterByInit: []
    }
  },
  created () {
    this.getRelation()
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'task') {
        this.$router.push('/base/checkTask/' + data.flowInstanceId)
      }
    },
    changeService (data) {
      let serviceData = this.serviceTypeList.find(item => item.value === data)
      this.tableFullList = serviceData.tableFullList
    },
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          this.columns[key].options = data[key]
        })
        this.serviceTypeList = [{
          id: '0',
          label: '请选择业务类型',
          optionValue: '0'
        }, ...data.serviceType].map(obj => {
          const serviceObj = this.serviceList.find(item => item.optionValue === Number(obj.optionValue))
          const tableFullList = serviceObj ? serviceObj.tableFullList : this.tableFullList
          const tableInitList = serviceObj ? serviceObj.tableInitList : this.tableInitList
          return {
            ...obj,
            value: Number(obj.optionValue),
            tableFullList,
            tableInitList
          }
        })
        this.hasRelation = true
        console.log(this.serviceTypeList)
      })
    }
  }
}
</script>
