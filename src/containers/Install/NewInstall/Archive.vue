<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        v-if="hasRelation"
        :label="label"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
        :toolbar = "toolbar"
        :columnsObject="columns"
        :customOperation="customOperation"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import { getMenus } from '../../../auth'
import { fetchList } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import { getLodop } from '../../../utils/LodopFuncs'

export default {
  name: 'archive',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/Archive')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '施工安装',
      label: '施工安装',
      labelName: 'name',
      relation: true,
      hasRelation: false,
      toolbar: {
        export: true
      },
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount'],
      tableFullList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'userCount', 'cardType', 'cardNo', 'clientType'],
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
          type: 'select'
        },
        createTime: {
          label: '办理时间',
          type: 'time',
          filter: {
            type: 'dateRange'
          },
          sort: true
        },
        applyTime: {
          label: '受理日期',
          type: 'time'
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
        clientAddress: {
          label: '用水地址',
          width: '200px',
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
        serviceType: {
          label: '服务项目',
          type: 'select'
        },
        clientOldName: {
          label: '改名过户原用户名称'
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
        this.$router.push('/base/task/' + data.flowInstanceId)
      } else if (name === 'print') {
        this.print(data)
      }
    },
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          if (this.columns[key]) {
            this.columns[key].options = data[key]
          }
        })
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '登记施工信息').id
        }]
        this.hasRelation = true
      })
    },
    print (data) {
      const css = `<style type="text/css">
        *{padding: 0;margin: 0;font-size: 14px;font-family: "微软雅黑";font-weight: normal;}
        .w15{width: 15px;}
        .w20{width: 20px;}
        .w25{width: 25px;}
        .w30{width: 30px;}
        .w40{width: 40px;}
        .w55{width: 55px;}
        .w90{width: 90px;}
        .w100{width: 100px;}
        .border{border-right: 1px solid #000;border-bottom: 1px solid #000;}
        .bb{border-bottom: 1px solid #000;}
        .f12{font-size: 12px;}
        .sign{text-align: left;padding-left: 5px;box-sizing: border-box;}
        table{border-top: 1px solid #000;border-left: 1px solid #000;margin-bottom: 10px;}
        td,th{border-right: 1px solid #000;border-bottom: 1px solid #000;text-align: center;}
        th{height: 30px;}
        td{height: 40px;}
        li{list-style: none;}
        h1{font-size: 32px;text-align: center;margin-bottom: 25px;}
        .topBox{display: -webkit-flex;display: -moz-box;display: flex;margin-bottom: 10px;}
        .flex{-webkit-flex: 1;-moz-box-flex: 1;flex: 1;padding-left: 10px;box-sizing: border-box;}
      </style>`
      const html = `<section style="margin: 0 auto;display: table;">
        <h1>海丰县自来水公司工程安装结算表</h1>
        <ul class="topBox">
          <li>用户名称 </li>
          <li class="flex">此处用户名称</li>
          <li style="margin-right: 30px;">2016年6月27日</li>
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
            <th rowspan="2" class="w40">单价</th>
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

          <tr>
            <td>1</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>材料费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>2</td>
            <td></td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>安装工费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>3</td>
            <td></td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>开口驳<br />接工费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>4</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>综合费<br />(或零工)</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>5</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>小计</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>6</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>工程利润</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>7</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>勘测工费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>8</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>开&nbsp;&nbsp;口<br />耗水费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>9</td>
            <td>25</td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td style="font-size: 8px;">挖沟、填土、打孔、<br />硬质路等杂工费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>10</td>
            <td></td>
            <td>名称</td>
            <td>米</td>
            <td>数量</td>
            <td>单价</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>定额</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
            <td>主&nbsp;&nbsp;管<br />材料费</td>
            <td>万</td>
            <td>千</td>
            <td>百</td>
            <td>十</td>
            <td>元</td>
            <td>角</td>
            <td>分</td>
          </tr>

          <tr>
            <td>11</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>合&nbsp;&nbsp;计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>12</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>税&nbsp;&nbsp;金</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>13</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>总&nbsp;&nbsp;计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>14</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td rowspan="6" colspan="8" valign="top">备&nbsp;&nbsp;&nbsp;&nbsp;注<p></p></td>
          </tr>

          <tr>
            <td>15</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>16</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>17</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>18</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>19</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>

          <tr>
            <td>20</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td colspan="8" class="sign">领料人签名:</td>
          </tr>
        </table>
        <ul class="topBox">
          <li>计算员:</li>
          <li class="flex"></li>
          <li>收款员:</li>
          <li class="flex"></li>
          <li>保管员:</li>
          <li class="flex"></li>
        </ul>
      </section>`
      let LODOP = getLodop()
      LODOP.PRINT_INITA('')
      LODOP.ADD_PRINT_HTM(40, 40, 700, 1000, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>
