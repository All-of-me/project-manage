/*
 * @Descripttion: 
 * @Author: mqp
 * @Date: 2020-07-14 16:19:12
 * @LastEditors: mqp
 * @LastEditTime: 2020-07-27 09:48:23
 */
// import * as subjectApi from '@/module/examManage/education/api/subject'

const state = {
  subjects: [],
  subSubjects: []
}

const getters = {
  subjectEnumFormat: (state) => (key) => {
    for (let item of state.subjects) {
      if (item.id === key) {
        return item.name
      }
    }
    return null
  },
  subSubjectEnumFormat: (state) => (key) => {
    for (let item of state.subSubjects) {
      if (item.id === key) {
        return item.name
      }
    }
    return null
  }
}

// actions
const actions = {
  // initSubject ({ commit }) {
  //   subjectApi.list(1).then(re => {
  //     commit('setSubjects', re.result)
  //     if (action !== undefined) {
  //       action()
  //     }
  //   })
  // },
  // initSubSubject ({ commit }) {
  //   subjectApi.list(2).then(re => {
  //     commit('setSubSubjects', re.result)
  //     if (action !== undefined) {
  //       action()
  //     }
  //   })
  // }
}

// mutations
const mutations = {
  setSubjects: (state, subjects) => {
    state.subjects = subjects
  },
  setSubSubjects: (state, subSubjects) => {
    state.subSubjects = subSubjects
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
