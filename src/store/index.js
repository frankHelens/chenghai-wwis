import Vue from 'vue'
import Vuex from 'vuex'
import navbar from './modules/navbar'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    isOpen: true,
    isHover: false
  },
  getters: {
    isOpen: (state) => state.isOpen,
    isHover: (state) => state.isHover
  },
  mutations: {
    changeOpen (state) {
      state.isOpen = !state.isOpen
    },
    changeHover (state, hoverState) {
      state.isHover = hoverState
    }
  },
  modules: {
    navbar
  },
  strict: debug
})
