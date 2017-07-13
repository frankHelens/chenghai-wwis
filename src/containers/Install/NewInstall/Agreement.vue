<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        v-if="hasRelation"
        :label="label"
        :toolbar = "toolbar"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
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
import moment from 'moment'
// import { config } from '../../../utils/common'

export default {
  name: 'agreement',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/agreement')
    return {
      resource: 'installorder',
      title: '签订协议书',
      label: '签订协议书',
      labelName: 'name',
      relation: true,
      hasRelation: false,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'clientName', 'meterDiameter', 'cardType', 'cardNo', 'clientPhone'],
      tableFullList: ['orderCode', 'clientName', 'meterDiameter', 'cardType', 'cardNo', 'clientPhone', 'clientMobile', 'clientAddress', 'userCount', 'updateTime'],
      columns: {
        orderCode: {
          label: '受理编号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        orderStatus: {
          label: '归档状态'
        },
        flowInstanceId: {
          label: '工单号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        stepDefineId: {
          label: '流程定义步骤'
        },
        isBigUser: {
          label: '是否大用户',
          sort: true,
          filter: {
            type: 'input'
          }
        },
        updateTime: {
          label: '操作时间',
          type: 'time'
        },
        applyTime: {
          label: '受理日期',
          type: 'time'
        },
        pactNo: {
          label: '合同号'
        },
        clientName: {
          label: '客户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        meterDiameter: {
          label: '水表口径'
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
            type: 'input',
            like: true
          }
        },
        clientPhone: {
          label: '客户固话',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientMobile: {
          label: '客户手机',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientAddress: {
          label: '用水地址',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientType: {
          label: '用户类型'
        },
        serviceType: {
          label: '服务项目'
        },
        clientOldName: {
          label: '改名过户原用户名称'
        },
        applyName: {
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
        userCount: {
          label: '用水人数'
        }
      },
      filterByInit: [],
      flowDefineId: menu.flowid,
      toolbar: {
        export: true
      }
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
        let LODOP = getLodop()
        LODOP.PRINT_INITA(30, 10, 800, 1000, '')
        // LODOP.SET_PRINT_PAGESIZE(1)
        // LODOP.ADD_PRINT_HTM(30, 0, '100%', '100%', css + html)
        LODOP.ADD_PRINT_SETUP_BKIMG("<img src='http://test2.gddxit.com/hetong.jpg' />")
        LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1)
        LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0)
        LODOP.SET_SHOW_MODE('BKIMG_TOP', 0)
        LODOP.ADD_PRINT_TEXT(80, 540, 39, 20, moment(data.applyTime).format('YYYY'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(80, 630, 28, 20, moment(data.applyTime).format('DD'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(80, 580, 31, 20, moment(data.applyTime).format('MM'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(108, 530, 125, 20, data.pactNo || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(140, 137, 188, 20, data.clientName || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(140, 406, 57, 20, data.meterDiameter || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 3)
        LODOP.ADD_PRINT_TEXT(140, 548, 114, 20, data.clientNo || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(175, 134, 57, 20, data.cardType || '')
        LODOP.ADD_PRINT_TEXT(175, 274, 187, 20, data.cardNo || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(175, 552, 107, 20, data.clientPhone || data.clientMobile || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(210, 138, 521, 20, data.clientAddress || '')
        switch (Number(data.clientType)) {
          case 1:
            LODOP.ADD_PRINT_TEXT(250, 140, 30, 20, '√')
            break
          case 2:
            LODOP.ADD_PRINT_TEXT(250, 210, 30, 20, '√')
            break
          case 3:
            LODOP.ADD_PRINT_TEXT(250, 285, 31, 20, '√')
            break
          case 4:
            LODOP.ADD_PRINT_TEXT(250, 355, 31, 20, '√')
            break
          case 5:
            LODOP.ADD_PRINT_TEXT(250, 400, 31, 20, '√')
            break
          case 6:
            LODOP.ADD_PRINT_TEXT(250, 480, 30, 20, '√')
            break
          case 7:
            LODOP.ADD_PRINT_TEXT(250, 525, 31, 20, '√')
            break
          case 8:
            LODOP.ADD_PRINT_TEXT(250, 575, 31, 20, '√')
            break
          case 9:
            LODOP.ADD_PRINT_TEXT(250, 620, 31, 20, '√')
            break
        }
        switch (Number(data.serviceType)) {
          case 1:
            LODOP.ADD_PRINT_TEXT(290, 138, 29, 20, '√')
            break
          case 2:
            LODOP.ADD_PRINT_TEXT(290, 180, 31, 20, '√')
            break
          case 3:
            LODOP.ADD_PRINT_TEXT(290, 230, 31, 20, '√')
            break
          case 4:
            LODOP.ADD_PRINT_TEXT(290, 490, 31, 20, '√')
            break
          case 5:
            LODOP.ADD_PRINT_TEXT(325, 138, 31, 20, '√')
            break
          case 6:
            LODOP.ADD_PRINT_TEXT(325, 185, 31, 20, '√')
            break
          case 7:
            LODOP.ADD_PRINT_TEXT(325, 230, 31, 20, '√')
            break
          case 8:
            LODOP.ADD_PRINT_TEXT(325, 490, 31, 20, '√')
            break
        }
        LODOP.ADD_PRINT_TEXT(352, 206, 185, 20, data.clientOldName || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(352, 478, 181, 20, '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(384, 136, 121, 20, data.applyName || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(386, 339, 125, 20, data.applyIdcard || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(386, 543, 118, 20, data.applyPhone || data.applyMobile || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(435, 135, 40, 20, moment(data.buildDate).format('YYYY'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(435, 185, 31, 20, moment(data.buildDate).format('MM'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(435, 221, 31, 20, moment(data.buildDate).format('DD'))
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(422, 337, 63, 22, data.meterOuterNum || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(422, 475, 57, 20, data.meterType || '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.ADD_PRINT_TEXT(422, 609, 53, 20, '')
        LODOP.SET_PRINT_STYLEA(0, 'Alignment', 2)
        LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '725px')
        // LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '1000px')
        // LODOP.PRINT_DESIGN()
        LODOP.PREVIEW()
      } else if (name === 'printUser') {
        console.log(data)
        this.CreatePage(data)
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
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '打印协议合同').id
        }]
        this.hasRelation = true
      })
    },
    CreatePage (data) {
      const css = `<style type="text/css">
        *{padding: 0;margin: 0;}
        table{width: 100%;text-align: center;border: 1px solid #000;}
        td{height: 42px;}
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
        .title{font-size: 32px;color: #000;margin: 30px 0;}
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
      </style>`
      const html = `<h1 class="title tc">澄海区自来水公司用户申请审批表</h1>
        <table cellspacing="0" cellpadding="0">
          <tr class="borders">
            <td>用户名称</td>
            <td style="width:150px;">${data.clientName || ''}</td>
            <td>联系人</td>
            <td style="width:100px;">${data.applyName || ''}</td>
            <td colspan="2">
              <p style="float: left;width: 30%;border-right: 1px solid #000;height: 100%;line-height: 35px;">电话</p>
              <p style="float: left;>${data.clientPhone || data.clientMobile || ''}</p>
              <br style="clear: both;display: block;height: 0px;" />
            </td>
          </tr>
          <tr class="borders">
            <td>身份证号</td>
            <td colspan="2">${data.applyIdcard || ''}</td>
            <td colspan="3">
              <p style="float: left;width: 30%;border-right: 1px solid #000;height: 100%;line-height: 35px;">近表号</p>
              <p style="float: left;>${data.meterNearNo || ''}</p>
              <br style="clear: both;display: block;height: 0px;" />
            </td>
          </tr>
          <tr class="borders">
            <td>用户地址</td>
            <td colspan="5">${data.clientAddress}</td>
          </tr>
          <tr class="borders tl">
            <td rowspan="3" colspan="6" class="pl40 bs">
              <br />
              申请事由：
              <p style="text-indent:2em;margin-top:10px;line-height:180%;">因_________需要，我户将遵守《汕头市城市供水用水条例》，按照澄海区自来水公司的有关规定，申请用水报装
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
            <td>用户签名：</td>
            <td></td>
            <td colspan="2" class="tl">营业经办人：</td>
            <td class="">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
          </tr>
          <tr class="borders">
            <td rowspan="15" class="br">联<br /><br />合<br /><br />勘<br /><br />察<br /><br />意<br /><br />见</td>
          </tr>
          <tr class="borders">
            <td class="br0">工程类别：</td>
            <td colspan="4" class="tl">${data.serviceType || ''}</td>
          </tr>
          <tr>
            <td colspan="2" class="tl pl10">拟定水表口径：</td>
            <td class="tl">${data.meterDiameter || ''}</td>
            <td>用水性质：</td>
            <td>${data.useType || ''}</td>
          </tr>
          <tr class="borders">
            <td rowspan="3" class="br0">技术科：</td>
            <td rowspan="3" colspan="4"></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr class="borders">
            <td rowspan="3" class="br0">设计室：</td>
            <td rowspan="3" colspan="4"></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr class="borders">
            <td rowspan="3" class="br0">营业所</td>
            <td rowspan="3" colspan="4"></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr class="borders">
            <td rowspan="3" class="br0">安装公司：</td>
            <td rowspan="3" colspan="4"></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
          </tr>
          <tr class="borders">
            <td rowspan="2">设计预算</td>
            <td colspan="5" class="tl pl80 bs">附设计图及工程预算书</td>
          </tr>
          <tr>
            <td></td>
            <td>签名：</td>
            <td></td>
            <td colspan="2">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
          </tr>
          <tr class="borders">
            <td rowspan="2">造价审核</td>
            <td colspan="5"></td>
          </tr>
          <tr>
            <td></td>
            <td>签名：</td>
            <td></td>
            <td colspan="2">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
          </tr>
          <tr class="borders">
            <td rowspan="2">分管经理审批意见</td>
            <td colspan="5"></td>
          </tr>
          <tr>
            <td></td>
            <td>签名：</td>
            <td></td>
            <td colspan="2">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
          </tr>
          <tr class="borders">
            <td rowspan="2">经理审批意见</td>
            <td colspan="5"></td>
          </tr>
          <tr>
            <td></td>
            <td>签名：</td>
            <td></td>
            <td colspan="2">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp年&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp月&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp日</td>
          </tr>
        </table>`
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(40, 40, 700, 1000, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>
