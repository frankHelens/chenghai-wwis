<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <div id="table" class="Statistics"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

export default {
  components: {},
  data () {
    return {
      title: '统计报告'
    }
  },
  mounted () {
    console.log(echarts)
    var myChart = echarts.init(document.getElementById('table'))
    myChart.setOption({
      title: {
        text: '堆叠式区域图'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '裙子']
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '衬衫',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '羊毛衫',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        },
        {
          name: '雪纺衫',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '裤子',
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '裙子',
          type: 'line',
          stack: '总量',
          areaStyle: {
            normal: {
              show: true,
              position: 'bottom'
            }
          },
          data: [320, 332, 301, 334, 390, 330, 320]
        }
      ]
    })
  }
}
</script>

<style lang="sass" scoped>
.content
  display: flex
  flex: 1
  flex-direction: column
  padding: 25px 20px 10px
.main
  display: flex
  flex: 1
  flex-direction: column
.title
  padding: 0
  font-size: 28px
  letter-spacing: -1px
  display: block
  color: #666
  margin: 0 0 15px
  font-weight: 300
.datatable
  display: flex
  flex: 1
  flex-direction: column
.Statistics
  display: flex
  flex: 1
  flex-direction: column
  border: 1px solid #ddd
</style>
