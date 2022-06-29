export const state = () => ({
  isLoading: true,
  data: {},
  chapters: [],
  chapter: null,
  index: []
})

export const mutations = {
  setData (state, data) {
    state.data = data
  },
  addData (state, payload) {
    state.data[payload.id] = payload.data
  },
  setChapter (state, chapter) {
    console.log('setChapter', chapter)
    state.chapter = chapter
  },
  setChapters (state, chapters) {
    state.chapters = chapters
  },
  setIndex (state, index) {
    state.index = index
  },
  setMapSelected (state, mapSelected) {
    state.mapSelected = mapSelected
  },
  setIsLoading (state, isLoading) {
    state.isLoading = isLoading
  },
  setFetched (state, payload) {
    state.index.find(g => g.id_datos === payload.id).fetched = payload.fetched
  }
}

// getters
export const getters = {
  allGraphFetched: (state) => {
    // check if every item in index has fetched true
    if (state.index.length === 0) {
      return false
    }
    return state.index.every(g => g.fetched)
  },
  graphsChapter: (state) => {
    return state.index.filter(g => g.capitulo === state.chapter)
  }
}
