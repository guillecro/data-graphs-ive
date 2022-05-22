<template>
  <div class="box">
    <div v-if="$fetchState.pending">
      <i class="fas fa-spin fa-sync" /> Cargando...
    </div>
    <div v-else-if="$fetchState.error">
      <i class="fas fa-exclamation-triangle" /> Error!
    </div>
    <div v-else>
      <h1 class="subtitle is-6 has-text-grey-light">
        {{ graph.fecha_actualizacion }} - {{ graph.fuente }}
      </h1>
      <h1 class="title is-3 has-text-primary">
        {{ graph.nombre_visualizacion }}
      </h1>
      <!-- {{ graph }} -->
      <div>
        <VueGauge class="chart" :option="chartOptions" v-if="graphReady" />
        <div class="chart is-flex is-justify-content-center is-align-items-center" v-else>
          <i class="fas fa-spin fa-5x fa-sync"></i>
        </div>
      </div>
      <!-- <b-table :data="theData.values">
        <b-table-column v-slot="props" field="jurisdiccion" label="Jurisdiccion">
          {{ props.row.jurisdiccion }}
        </b-table-column>
        <b-table-column v-slot="props" field="cant_absoluta" numeric label="Cantidad">
          {{ props.row.cant_absoluta }}
        </b-table-column>
        <b-table-column v-slot="props" field="porcentaje" numeric label="Porcentaje">
          {{ props.row.cant_porcentaje }}
        </b-table-column>
        <b-table-column v-slot="props" field="ranking" numeric sortable label="Ranking">
          {{ props.row.ranking }}
        </b-table-column>
      </b-table> -->
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
    googleSheetId () {
      return process.env.googleSheetId
    },
    googleApiKey () {
      return process.env.googleApiKey
    }
  },
  methods: {
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
      this.chartOptions.visualMap.max = maxValue
      this.chartOptions.series.push(serie)
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
