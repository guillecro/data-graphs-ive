export const state = () => ({
  columns: 6
})

export const mutations = {
  setColumns (state, columns) {
    state.columns = columns
  }
}
