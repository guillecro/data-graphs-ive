
export const state = () => ({
  selected: 'nacional',
  list: {
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
    tucuman: 'Tucumán',
    nacional: 'Todas las Jurisdicciones'
  }
})

export const mutations = {
  setSelected (state, selected) {
    state.selected = selected
  }
}
