<template>
  <li class="flow-step-item" :style="leftBorderStyle" >
    <div class="flow-content">
      <span class="icon" :style="iconStyle">{{index}}</span>
      <span class="leftIcon fa fa-caret-left"></span>
      <div class="item-content">
        <div class="item-title" @click="showInfoEvent">
          <h6 :class="styles === 'default'?'h6-active':''">
            <strong 
            :style="titleStyle"
            >{{title}}</strong>
            <span>{{infoList[0]}}</span>
            <span v-if="infoList[1]">{{infoList[1]}}</span>
            <!-- <span :style='titleStyle' v-if="isBack">不同意</span> -->
          </h6>
          <i v-if="canOpen" class="fa" :class="!isOpen ? 'fa-caret-down' : 'fa-caret-up'"></i>
        </div>
        <transition name="slide-fade">
          <div v-if="canOpen" class="info_content" v-show="isOpen"> 
            <ul>
              <div v-for="(fromData, index) in formList" >
                <li :class="currentStepOwner ? 'from-data' : 'full-from-data'">
                  <el-tooltip v-if="fromData.type !== 'button'"  :content="fromData" placement="bottom" effect="light">
                    <div>{{fromData}}</div>
                  </el-tooltip>
                  <router-link v-else
                    :to="fromData.url">
                    <el-button
                      size="mini"
                      :type="fromData.style">
                      {{fromData.label}}
                    </el-button>
                  </router-link>
                </li><br v-if="currentStepOwner ? (index+1)%2===0 : (index+1)%3===0"/>
              </div>
            </ul>
            <ul v-if="imageList.length" class="info_content imageStyle">
              <li v-for="(image , index) in imageList" :style="{backgroundImage: 'url(' + image.url + ')'}" @click.stop="showImage(image)"></li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <el-dialog :title="dialogTitle" v-model="dialogVisible">
      <img class="dialog-img" :src="dialogImg" alt="">
    </el-dialog>
  </li>
</template>

<script>
export default {
  props: {
    styles: String,
    title: String,
    infoList: Array,
    formList: Array,
    imageList: Array,
    isActive: Boolean,
    canOpen: Boolean,
    index: Number,
    currentStepOwner: Boolean
  },
  data () {
    return {
      isOpen: this.isActive,
      dialogVisible: false,
      dialogImg: '',
      dialogTitle: '',
      isCurrent: this.styles === 'primary',
      isBack: this.styles === 'warning',
      iconStyle: {
        background: this.showStyle(this.styles)
      },
      leftBorderStyle: {
        borderLeftColor: this.showStyle(this.styles)
      }
    }
  },
  computed: {
    titleStyle () {
      if (this.styles === 'primary') {
        return 'color: #03a9f4;'
      }
      if (this.styles === 'warning') {
        return 'color: #ffcd14;'
      }
      if (this.styles === 'danger') {
        return 'color: #fe6553;'
      }
    }
  },
  methods: {
    showInfoEvent () {
      this.isOpen = !this.isOpen
    },
    showImage (image) {
      this.dialogVisible = !this.dialogVisible
      this.dialogTitle = image.label
      this.dialogImg = image.url
    },
    showStyle (color) {
      return color === 'warning'
      ? '#ffcd14'
      : color === 'danger'
      ? '#fe6553'
      : color === 'success'
      ? '#58d68d'
      : color === 'default'
      ? '#ddd'
      : '#03a9f4'
    }
  }
}
</script>

<style lang="sass" scoped>
h3,h6
  font-family: '微软雅黑'
.slide-fade-enter-active
  transition: all .1s ease
.slide-fade-leave-active
  transition: all .1s
.slide-fade-enter, .slide-fade-leave-active
  transform: translateX(10px)
  opacity: 0
h6
  vertical-align: middle
  font-size: 14px
  color: #555
  span
    margin: 0 20px 0 20px
.h6-active
  color: #ddd
  height: 20px    
.icon
  width: 24px
  height: 24px
  border-radius: 50%
  display: inline-block
  background: #03a9f4
  vertical-align: middle
  text-align: center
  line-height: 24px
  color: #ffffff
  position: absolute
  left: -43px
  top: 8px

.flow-step-item
  border-left: 2px solid #03a9f4
  padding-bottom: 20px
  .flow-content
    position: relative
    left: 30px
    .leftIcon
      position: absolute 
      left: -7px
      top: 9px
      color: #ffffff
      font-size: 21px
      margin-left: 0
    .item-content
      width: 100%
      background: white
      cursor: pointer
      padding: 10px
      overflow: hidden
      border-radius: 8px
      .item-title
        display: flex
        justify-content: space-between
        align-items: center
        i
          color: #03a9f4  
.fa
  margin-left: 15px
.info_content
  ul
    background: #f6f8fa
    font-size: 14px
    color: #555
    margin: 10px
    overflow: hidden
    div
      width: 100%
    li 
      width: 20%
      display: inline-block
      line-height: 35px
      margin: 0 2% 0 2%
      float: left
      div
        overflow: hidden     
        text-overflow: ellipsis
        white-space: nowrap
    .from-data
      width: 44%
      float: left
    .full-from-data
      width: 29%
      float: left  
    br
      clear: both
  .imageStyle
    display: flex 
    li
      width: 100%
      height: 220px
      flex: 1
      background-size: contain
      background-position: center center
      background-repeat: no-repeat
.class-back
  color: #fe6553
.class-current
  color: #03a9f4 
.icon-active
  background-color: #ddd
.dialog-img
  width: 100%
</style>