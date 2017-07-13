<template>
  <div class="container">
    <div class="control">
      <div class="frist">
        <div>
          <el-button type="primary" v-for="deviceItem in deviceList" @click="deviceEvent(deviceItem.name)">{{deviceItem.label}}</el-button>
          <div>
            <span class="label">分辨率</span><el-select class="select-style" v-model="resValue" @change="SetResIndex(resValue)" placeholder="请选择分辨率">
              <el-option
                v-for="item in iResVecOptions"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          </div>
        <el-button class="capture-btn" @click="CaptureToFile"><i class="fa fa-camera-retro fa-2x"></i><div>拍摄</div></el-button>
      </div>
      <div class="second">
        <div v-for="iptItem in inputList">
          <span class="label">{{iptItem.label}}</span>
          <el-input  v-model="iptItem.value" @blur="iptEvent(iptItem.name, iptItem.value)"></el-input>
        </div>
      </div>
      <div class="third">
        <div>
          <span class="label">图片旋转</span>
          <div class="button-list">
            <el-button type="primary" size="small" v-for="dir in dirList" @click="SetDeviceRotation(dir.value)">{{dir.label}}</el-button>
            </div>
          </div>
          <div class="select-list" v-for="selectItem in selectList">
            <span class="label">{{selectItem.label}}</span>
            <el-select v-model="selectItem.value" @change="selectEvent(selectItem.name, selectItem.value)" :placeholder="selectItem.placeholder">
              <el-option
                v-for="item in selectItem.options"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
      </div>
    </div>
    <div class="capture-content">
      <object ref="Capture" width="100%" height="100%"  align="middle" classid="clsid:9A73DB73-2CA3-478D-9A3F-7E9D6A8D327C" codebase="CaptureVideo.cab#version=1,7,8,0">
      </object>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { isNumber } from 'lodash'

export default {
  props: {
    orderCode: String
  },
  data () {
    return {
      strFilePath: 'D:\\Pictures\\' + this.orderCode + '\\', // 存放地址
      time: moment().format('YYYY-MM-DD'),
      nameNum: 1,
      deviceList: [{
        name: 'open',
        label: '打开'
      }, {
        name: 'close',
        label: '关闭'
      }],
      iResVecOptions: [],
      resValue: '',
      selectList: [{
        name: 'cut',
        label: '切边类型',
        value: 0,
        placeholder: '请选择切边类型',
        options: [{
          label: '不切边',
          value: 0
        }, {
          label: '自动切边',
          value: 1
        }, {
          label: '自定义切边',
          value: 2
        }]
      }, {
        name: 'merge',
        label: '合并类型',
        value: -1,
        placeholder: '请选择合并类型',
        options: [{
          label: '不合并',
          value: -1
        }, {
          label: '左右合并',
          value: 0
        }, {
          label: '上下合并',
          value: 1
        }]
      }],
      inputList: [{
        name: 'DPI',
        value: '200',
        label: 'DPI'
      }, {
        name: 'light',
        value: '10',
        label: '曝光度'
      }, {
        name: 'quality',
        value: '10',
        label: 'JPG质量'
      }],
      dirList: [{
        label: '左转',
        value: 270
      }, {
        label: '上下',
        value: 180
      }, {
        label: '右转',
        value: 90
      }, {
        label: '恢复',
        value: 0
      }],
      strFileNameList: [],
      strMergeSource1: '',
      strMergeSource2: '',
      openStatus: false
    }
  },
  created () {
    // 初始化，打开高拍仪
    this.init()
  },
  methods: {
    init () {
      this.nameNum = 0
      try {
        // WMSelect = document.getElementById("WaterMarkSelect")
      } catch (err) {
        this.showMessage('未找到ICaptureVideo.ocx控件，请重新安装', 'error')
      }
    },
    onbeforeunload () {
      this.Capture.CloseDeviceEx()
      // Capture.Dispose();
      window.event.returnValue = '确定要退出本页吗？'
    },
    deviceEvent (name) {
      if (name === 'open') {
        this.openDevice()
      }
      if (name === 'close') {
        this.closeDevice()
        this.$emit('toggle', true)
      }
    },
    iptEvent (name, value) { // 输入框触发事件
      if (name === 'DPI') {
        this.SetDPI(Number(value))
      }
      if (name === 'light') {
        this.SetExposure(Number(value))
      }
      if (name === 'quality') {
        this.SetJPGQuality(Number(value))
      }
    },
    selectEvent (name, value) { // 选择框事件
      const options = this.selectList.find(item => item.name === name).options
      if (name === 'cut') {
        console.log(options)
        this.SetCutPageType(value, options)
      }
      if (name === 'merge') {
        this.SetMergePageType(value, options)
      }
    },
    openDevice () { // 打开设备
      const Capture = this.$refs.Capture
      if (Capture.OpenDevice(0) === 0) {
        this.showMessage('启动设备成功', 'success')
        this.openStatus = true
        Capture.SetCameraExposure(0, 10) // 设置自动曝光
        this.FillInRes() // 分辨率
        // this.SetCutPageType() // 打开设备顺便自动切边
      } else {
        this.showMessage('启动设备失败', 'error')
      }
    },
    closeDevice () { // 关闭设备
      const Capture = this.$refs.Capture
      this.openStatus = false
      Capture.CloseDeviceEx()
    },
    FillInRes () { // 设置分辨率
      const Capture = this.$refs.Capture
      let iResVecLenth = Capture.GetResolutionCount(0)
      let optionsList = []
      for (var i = 0; i < iResVecLenth; i++) {
        optionsList.push(Capture.GetResolutionWidth(0, i) + '×' + Capture.GetResolutionHeight(0, i))
      }
      this.iResVecOptions = optionsList.map((item, index) => {
        return {
          label: item,
          value: index
        }
      })
      setTimeout(function () {
        this.resValue = 0
      }.bind(this), 1500)
    },
    SetResIndex (value) { // 设置分辨率
      const Capture = this.$refs.Capture
      let iIndex = parseInt(value)
      if (Capture.SetResolutionIndex(0, iIndex) === 0) {
        this.showMessage('设置分辨率成功', 'success')
      } else {
        this.showMessage('设置分辨率失败', 'error')
      }
    },
    SetDPI (iDPIValue) { // 设置拍照存档的DPI
      const Capture = this.$refs.Capture
      if (iDPIValue === '') {
        this.showMessage('DPI值都不能为空！', 'warning')
        return
      }
      if (isNumber(iDPIValue)) {
        let iDpi = parseInt(iDPIValue)
        if (Capture.SetGrabbedDPIEx(iDpi) === 0) {
          this.showMessage('DPI设置成功', 'success')
        } else {
          this.showMessage('DPI设置失败', 'error')
        }
      } else {
        this.showMessage('含有非法字符，请重新输入数字！', 'error')
      }
    },
    SetExposure (iExposureVal) { // 设置曝光度
      const Capture = this.$refs.Capture
      if (isNumber(iExposureVal)) {
        Capture.SetCameraExposure(0, parseInt(iExposureVal))
        // 当-6<=IExposureVal<=-1为此曝光值，否则为自动曝光
      } else {
        this.showMessage('请输入数字', 'warning')
      }
      // WriteInfomation(Capture.GetCameraExposureEx(iDeviceIndex));
    },
    SetJPGQuality (iQuality) { // 设置jpg图片质量
      const Capture = this.$refs.Capture
      if (isNumber(iQuality)) {
        Capture.SetJPGQuality(parseInt(iQuality))
      } else {
        this.showMessage('请输入数字', 'warning')
      }
    },
    SetDeviceRotation (rotation) { // 摄像旋转
      const Capture = this.$refs.Capture
      let nRotation = parseInt(rotation)
      if (nRotation % 90 !== 0) {
        Capture.SetDeviceRotate(0, 0)
        // 不能被90整除的默认不旋转
      }
      Capture.SetDeviceRotate(0, nRotation)
    },
    CaptureToFile () { // 拍摄图片
      const Capture = this.$refs.Capture
      let strFileName = this.strFilePath + this.time + '-' + String(this.nameNum) + '.jpg' // 设置保存图片的名字
      Capture.GrabToFile(strFileName)
      this.nameNum ++
      if (this.openStatus) {
        this.showMessage('文件保存在' + strFileName, 'success')
      } else {
        this.showMessage('拍摄失败,请打开设备!', 'error')
      }
      // this.strFileNameList.push(strFileName)
      // 只保存最后2次拍摄的文件名作为合并图像参数文件名
      if (this.strMergeSource1 !== '') {
        this.strMergeSource2 = this.strMergeSource1
      }
      this.strMergeSource1 = strFileName
    },
    SetCutPageType (value, options) { // 设置切边方式
      const Capture = this.$refs.Capture
      let iType = parseInt(value)
      if (Capture.SetCutPageType(0, iType) === 0) {
        this.showMessage('设置切边方式为' + options.find(item => iType === item.value).label, 'info')
      }
    },
    SetMergePageType (value, options) { // 合并图像
      const Capture = this.$refs.Capture
      let iMergePageType = parseInt(value) // 合并类型
      let dstFileName = this.strFilePath + 'merge' + this.time + '-' + iMergePageType + String(this.nameNum) + '.jpg' // 合并后的文件名路径
      // 合并的目标文件名
      if (this.strMergeSource1 !== '' && this.strMergeSource2 !== '') {
        if (Capture.MergeImages(this.strMergeSource1, this.strMergeSource2, dstFileName, iMergePageType) === 0) {
          this.showMessage('合并成功，合并方式为' + options.find(item => iMergePageType === item.value).label, 'success')
        } else {
          // this.showMessage('合并失败，合并方式为' + options.find(item => iMergePageType === item.value).label, 'error')
        }
      } else {
        this.showMessage('合并图像需要2张图片', 'warning')
      }
    },
    showMessage (value, status) { // 消息提示
      this.$message({
        showClose: true,
        message: value,
        type: status
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.content
  height: 100%
.label
  font-size: 14px
  color: #52627d
  margin-right: 10px
  margin-top: 0px !important
.container
  width: 100%
  height: 600px
.control
  width: 375px
  // height: 500px
  float: left
  overflow: hidden
  .frist
    >div
      width: 250px
      float: left
      div
        vertical-align: middle
      button
        width: 100px
        height: 40px
        margin-bottom: 15px
      .select-style
        width: 160px
    .capture-btn
      width: 100px
      height: 100px
      border: 2px solid #03a9f4
      border-radius: 50%
      text-align: center
      background: #fff
      font-size: 18px
      color: #03a9f4
      cursor: pointer
  .second
    overflow: hidden
    padding: 10px
    width: 100%
    background: #f7f7f7
    margin-top: 10px
    >div
      float: left
      .el-input
        width: 60px
        margin-right: 10px
      span
        float: left
  .third
    @extend .second
    .button-list
      width: 70%
      float: left 
      .el-button
        width: 120px
        height: 35px
        margin-top: 10px
      .el-button:nth-child(1)
        margin-left: 10px
    .select-list
      margin-top: 10px
      .el-select
        margin-left: 10px
.capture-content
  width: 64%
  height: 530px
  float: right
  border: 2px solid #f7f7f7
</style>