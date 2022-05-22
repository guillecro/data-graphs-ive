
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
  setSelected (state, selected) {
    if (selected === 'nacional') {
      state.selected = ['nacional']
    } else {
      // remove 'nacional' if it's in the array
      state.selected = state.selected.filter(s => s !== 'nacional')
      // if selected is already in the state.selected, remove it
      if (state.selected.includes(selected)) {
        state.selected = state.selected.filter(s => s !== selected)
        console.log(state.selected)
        if (state.selected.length === 0) {
          state.selected = ['nacional']
        }
      } else {
        state.selected.push(selected)
      }
    }
  }
}
