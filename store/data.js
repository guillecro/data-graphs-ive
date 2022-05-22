export const state = () => ({
  isLoading: true,
  data: {},
  index: []
})

export const mutations = {
  setData (state, data) {
    state.data = data
  },
  setIndex (state, index) {
    state.index = index
  },
  setMapSelected (state, mapSelected) {
    state.mapSelected = mapSelected
  },
  setIsLoading (state, isLoading) {
    state.isLoading = isLoading
  }
}
