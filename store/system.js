export const state = () => ({
  columns: 6,
  proMode: false
})

export const mutations = {
  setColumns (state, columns) {
    state.columns = columns
  },
  setProMode (state, proMode) {
    state.proMode = proMode
  }
}

export const actions = {
  setProMode ({ state, dispatch, commit, rootState }, proMode) {
    if (proMode !== state.proMode) {
      commit('setProMode', proMode)
      dispatch('map/restart', null, { root: true })
    }
  }
}
