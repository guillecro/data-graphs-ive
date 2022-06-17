
export const state = () => ({
  selected: ['nacional'],
  list: {
    nacional: 'Todas las Jurisdicciones',
    caba: 'Ciudad Autónoma de Buenos Aires',
    pba: 'Buenos Aires',
    catamarca: 'Catamarca',
    chaco: 'Chaco',
    chubut: 'Chubut',
    cordoba: 'Córdoba',
    corrientes: 'Corrientes',
    entre_rios: 'Entre Ríos',
    formosa: 'Formosa',
    jujuy: 'Jujuy',
    la_pampa: 'La Pampa',
    la_rioja: 'La Rioja',
    mendoza: 'Mendoza',
    misiones: 'Misiones',
    neuquen: 'Neuquén',
    rio_negro: 'Río Negro',
    salta: 'Salta',
    san_juan: 'San Juan',
    san_luis: 'San Luis',
    santa_cruz: 'Santa Cruz',
    santa_fe: 'Santa Fe',
    santiago_del_estereo: 'Santiago del Estero',
    tierra_antartida: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
    tucuman: 'Tucumán'
  }
})

export const mutations = {
  toggleJurisdiccion (state, jurisdiccion) {
    if (jurisdiccion === 'nacional') {
      state.selected = ['nacional']
    } else {
      // remove 'nacional' if it's in the array
      state.selected = state.selected.filter(s => s !== 'nacional')
      // if selected is already in the state.selected, remove it
      if (state.selected.includes(jurisdiccion)) {
        state.selected = state.selected.filter(s => s !== jurisdiccion)
        if (state.selected.length === 0) {
          state.selected = ['nacional']
        }
      } else {
        state.selected.push(jurisdiccion)
      }
    }
  },
  toggleOneJurisdiccion (state, jurisdiccion) {
    if (jurisdiccion === 'nacional') {
      state.selected = ['nacional']
    } else if (state.selected.includes(jurisdiccion)) {
      state.selected = ['nacional']
    } else {
      state.selected = [jurisdiccion]
    }
  },
  restartNacional (state) {
    state.selected = ['nacional']
  }
}

// actions
export const actions = {
  setSelected ({ state, rootState, commit }, jurisdiccion) {
    if (rootState.system.proMode) {
      // if its proMode, selected can be more than one, so add it.
      commit('toggleJurisdiccion', jurisdiccion)
    } else {
      commit('toggleOneJurisdiccion', jurisdiccion)
    }
  },
  restart ({ state, rootState, commit }) {
    commit('restartNacional')
  }
}
