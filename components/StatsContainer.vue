<template>
  <div class="">
    <div v-if="$fetchState.pending" class="chart is-flex is-justify-content-center is-align-items-center">
      <i class="fas fa-spin fa-5x fa-sync" />
    </div>
    <div v-else-if="$fetchState.error" class="chart is-flex is-justify-content-center is-align-items-center">
      <i class="fas fa-exclamation-triangle fa-5x fa-sync" /> Error!
    </div>
    <div v-else>
      <h1 class="title is-3 has-text-primary has-text-centered is-700">
        {{ graph.nombre_visualizacion }}
      </h1>
      <h1 class="subtitle is-5 mb-0 has-text-dark has-text-centered">
        {{ graph.subtitulo_vizualizacion }}
      </h1>
      <!-- {{ graph }} -->
      <div v-if="graphReady">
        <!-- <VueEchart class="chart" :option="chartOptions" :autoresize="true" /> -->
        <GraphTorta v-if="graph.grafico_tipo == 'torta'" :data="theData" :graph="graph" />
        <GraphBarraHorizontal v-if="graph.grafico_tipo == 'barra_horizontal'" :data="theData" :graph="graph" />
      </div>
      <div v-else class="chart is-flex is-justify-content-center is-align-items-center">
        <i class="fas fa-spin fa-5x fa-sync" />
      </div>
      <!-- <div class="has-background-primary" style="border-radius: 5px; height: 20px; position: relative; margin: 0px 10px;">
        <div class="has-background-white has-text-centered" style="line-height: normal; border: 2px solid #000; height: 20px; width: 20px; border-radius: 20px; position: absolute; top: 0; left: -10px;">
          1
        </div>
      </div> -->
      <div class="is-flex is-justify-content-space-between is-align-items-center my-3">
        <!-- <button @click="showTable = !showTable" class="button is-primary ml-4" :class="{'is-outlined': !showTable}">
          <i class="fas fa-table-list fa-fw" />&nbsp;Tabla
        </button> -->
        <h1 class="subtitle is-6 has-text-grey-light is-flex-grow-1 m-0">
          Fuente: {{ graph.fuente }}<br>Fecha de actualización: {{ graph.fecha_actualizacion }}
        </h1>
        <div class="ml-4 is-700">
          <a class="has-text-primary" style="white-space: nowrap;" @click="showTable = !showTable">
            {{ showTable ? 'Ocultar' : 'Mostrar' }}&nbsp;Tabla&nbsp;<i class="fas fa-fw" :class="{'fa-angle-down': !showTable, 'fa-angle-up': showTable}" />
          </a>
        </div>
      </div>
      <TableData v-if="showTable" :graph="graph" :data="theData" />
    </div>
  </div>
</template>

<script>
import GraphTorta from './graphs/Torta.vue'
import GraphBarraHorizontal from './graphs/BarraHorizontal.vue'
export default {
  components: {
    GraphTorta,
    GraphBarraHorizontal
  },
  props: {
    graph: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      showTable: true,
      theData: {
        keys: [],
        labels: {},
        values: {}
      },
      // chartOptions: {
      //   visualMap: {
      //     show: false,
      //     min: 0,
      //     max: 0,
      //     inRange: {
      //       colorAlpha: [0.1, 1]
      //     }
      //   },
      //   tooltip: {
      //     padding: [4, 10],
      //     borderWidth: 0,
      //     textStyle: {
      //       fontFamily: 'Encode Sans',
      //       fontSize: 12,
      //       color: '#FFF'
      //     },
      //     backgroundColor: '#9283BE',
      //     extraCssText: 'box-shadow: none;',
      //     formatter: (a) => {
      //       // console.log()
      //       return `<p class="has-text-centered has-text-weight-bold">${a.data.name}</p><p class="has-text-centered">${a.percent} %</p>`
      //     }
      //   },
      //   toolbox: {
      //     show: true,
      //     feature: {
      //       saveAsImage: {
      //         show: true,
      //         title: 'Guardar'
      //       }
      //     }
      //   },
      //   series: []
      // },
      graphReady: false
    }
  },
  fetchOnServer: false,
  async fetch () {
    try {
      // console.log(app)
      // fetch with axios
      const response = await this.$axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetId}/values/${this.graph.id_datos}?key=${this.googleApiKey}`)
      const keys = response.data.values[0]
      const labels = response.data.values[1]
      const values = response.data.values.slice(2)
      const theLabels = {}
      keys.forEach((key, index) => {
        theLabels[key] = labels[index]
      })
      const theValues = []
      values.forEach((entry) => {
        // eslint-disable-next-line prefer-const
        const data = {}
        keys.forEach((k, i) => {
          if ([''].includes(entry[i])) {
            data[k] = null
          } else if (['...', '///'].includes(entry[i])) {
            data[k] = entry[i]
          } else if (this.graph.cast_int.includes(k)) {
            // remove dot
            data[k] = parseInt(entry[i].replace('.', '').replace(',', '.'))
          } else if (this.graph.cast_float.includes(k)) {
            data[k] = parseFloat(entry[i].replace('.', '').replace(',', '.'))
          } else {
            data[k] = entry[i]
          }
        })
        theValues.push(data)
      })
      this.theData = {
        keys,
        labels: theLabels,
        values: theValues
      }
      this.$store.commit('data/addData', {
        id: this.graph.id_datos,
        data: this.theData
      })
      this.$store.commit('data/setFetched', {
        id: this.graph.id_datos,
        fetched: true
      })
      this.graphReady = true
    } catch (err) {
      this.$buefy.dialog.alert(`Error al obtener los datos: ${err.message}`)
      // console.error(err)
      return null
    }
  },
  computed: {
    selected () {
      return this.$store.state.map.selected
    },
    selectedData () {
      return this.theData.values.filter(d => this.selected.includes(d.jurisdiccion))
    },
    googleSheetId () {
      return process.env.googleSheetId
    },
    googleApiKey () {
      return process.env.googleApiKey
    }
  },
  watch: {
    // selected (newVal, oldVal) {
    //   if (newVal !== oldVal) {
    //     this.prepareChart()
    //   }
    // }
  },
  methods: {
    // prepareChart () {
    //   const serie = {
    //     type: 'pie',
    //     colorBy: 'data',
    //     radius: ['40%', '70%'],
    //     itemStyle: {
    //       borderRadius: 6,
    //       borderColor: '#fff',
    //       borderWidth: 2,
    //       color: '#37BBED'
    //     },
    //     data: []
    //   }
    //   let maxValue = 0
    //   if (this.selected.length === 1 && this.selected[0] === 'nacional') {
    //     this.theData.values.forEach((v) => {
    //       if (v.id_jurisdiccion === 'nacional') {
    //         return
    //       }
    //       const _aux = {}
    //       _aux.value = v[this.graph.grafico_valor]
    //       if (v[this.graph.grafico_valor] > maxValue) {
    //         maxValue = v[this.graph.grafico_valor]
    //       }
    //       _aux.name = v.jurisdiccion
    //       serie.data.push(_aux)
    //     })
    //     serie.data = serie.data.sort((a, b) => {
    //       return b.value - a.value
    //     })
    //   } else {
    //     this.theData.values.forEach((v) => {
    //       if (v.id_jurisdiccion === 'nacional') {
    //         return
    //       }
    //       if (!this.selected.includes(v.id_jurisdiccion)) {
    //         return
    //       }
    //       const _aux = {}
    //       _aux.value = v[this.graph.grafico_valor]
    //       if (v[this.graph.grafico_valor] > maxValue) {
    //         maxValue = v[this.graph.grafico_valor]
    //       }
    //       _aux.name = v.jurisdiccion
    //       serie.data.push(_aux)
    //     })
    //     serie.data = serie.data.sort((a, b) => {
    //       return b.value - a.value
    //     })
    //     // maxValue = this.theData.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor]
    //     // const _aux = {
    //     //   value: this.theData.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor],
    //     //   name: this.theData.values.find(v => v.id_jurisdiccion === this.selected).jurisdiccion
    //     // }
    //     // serie.data.push(_aux)
    //   }
    //   this.chartOptions.visualMap.max = maxValue
    //   this.chartOptions.series = [serie]
    //   this.graphReady = true
    // }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 550px;
}
</style>
