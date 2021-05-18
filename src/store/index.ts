import { createStore, useStore } from 'vuex'
import modules from './modules/index'

const store = createStore({
  modules,
  state: {}
})

export default store
