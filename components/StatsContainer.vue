<template>
  <div class="">
    <div class="chart is-flex is-justify-content-center is-align-items-center" v-if="$fetchState.pending">
      <i class="fas fa-spin fa-5x fa-sync" />
    </div>
    <div class="chart is-flex is-justify-content-center is-align-items-center" v-else-if="$fetchState.error">
      <i class="fas fa-exclamation-triangle fa-5x fa-sync" /> Error!
    </div>
    <div v-else>
      <h1 class="title is-3 has-text-centered has-text-primary">
        {{ graph.nombre_visualizacion }}
      </h1>
      <!-- {{ graph }} -->
      <div v-if="graphReady">
        <VueGauge class="chart" :option="chartOptions" />
      </div>
      <div v-else class="chart is-flex is-justify-content-center is-align-items-center">
        <i class="fas fa-spin fa-5x fa-sync" />
      </div>
      <h1 class="subtitle is-6 has-text-grey-light">
        Fecha de actualización: {{ graph.fecha_actualizacion }} <br> Fuente: {{ graph.fuente }}
      </h1>
      <b-table
        :data="theData.values"
        :default-sort="['ranking']"
        default-sort-direction="asc"
        :row-class="colorRow"
        narrowed
        hoverable
      >
        <b-table-column v-slot="props" field="jurisdiccion" label="Jurisdiccion">
          {{ props.row.jurisdiccion || 'N/A' }}
        </b-table-column>
        <b-table-column v-slot="props" field="cant_absoluta" numeric centered label="Cantidad">
          {{ props.row.cant_absoluta || 'N/A' }}
        </b-table-column>
        <b-table-column v-slot="props" field="porcentaje" numeric centered label="Porcentaje">
          <b>{{ props.row.cant_porcentaje || 'N/A' }} %</b>
        </b-table-column>
        <b-table-column
          v-slot="props"
          field="ranking"
          numeric
          centered
          sortable
          label="Ranking"
        >
          {{ props.row.ranking || 'N/A' }}
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    graph: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      theData: {
        keys: [],
        labels: {},
        values: {}
      },
      chartOptions: {
        visualMap: {
          show: false,
          min: 0,
          max: 0,
          inRange: {
            colorAlpha: [0.1, 1]
          }
        },
        series: []
      },
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
          if (['-', 'N/A', ''].includes(entry[i])) {
            data[k] = null
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
      this.prepareChart()
    } catch (err) {
      console.error(err)
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
    selected (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareChart()
      }
    }
  },
  methods: {
    colorRow (row, index) {
      if (this.selected.includes(row.id_jurisdiccion)) {
        return 'is-info'
      }
      return ''
    },
    prepareChart () {
      const serie = {
        type: 'pie',
        colorBy: 'data',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
          color: '#37BBED'
        },
        data: []
      }
      let maxValue = 0
      if (this.selected.length === 1 && this.selected[0] === 'nacional') {
        this.theData.values.forEach((v) => {
          if (v.id_jurisdiccion === 'nacional') {
            return
          }
          const _aux = {}
          _aux.value = v.cant_absoluta
          if (v.cant_absoluta > maxValue) {
            maxValue = v.cant_absoluta
          }
          _aux.name = v.jurisdiccion
          serie.data.push(_aux)
        })
        serie.data = serie.data.sort((a, b) => {
          return b.value - a.value
        })
      } else {
        this.theData.values.forEach((v) => {
          if (v.id_jurisdiccion === 'nacional') {
            return
          }
          if (!this.selected.includes(v.id_jurisdiccion)) {
            return
          }
          const _aux = {}
          _aux.value = v.cant_absoluta
          if (v.cant_absoluta > maxValue) {
            maxValue = v.cant_absoluta
          }
          _aux.name = v.jurisdiccion
          serie.data.push(_aux)
        })
        serie.data = serie.data.sort((a, b) => {
          return b.value - a.value
        })
        // maxValue = this.theData.values.find(v => v.id_jurisdiccion === this.selected).cant_absoluta
        // const _aux = {
        //   value: this.theData.values.find(v => v.id_jurisdiccion === this.selected).cant_absoluta,
        //   name: this.theData.values.find(v => v.id_jurisdiccion === this.selected).jurisdiccion
        // }
        // serie.data.push(_aux)
      }
      this.chartOptions.visualMap.max = maxValue
      this.chartOptions.series = [serie]
      this.graphReady = true
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 600px;
}
</style>
