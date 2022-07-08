<template>
  <VueEchart v-if="graphReady" class="chart" :option="chartOptions" :autoresize="true" @click="handleChartClickEvent" />
</template>

<script>
export default {
  name: 'TortaGraph',
  props: {
    data: {
      type: Object,
      required: true
    },
    graph: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chartOptions: {
        aria: {
          enabled: true,
          decal: {
            show: true
          }
        },
        tooltip: {
          padding: [4, 10],
          borderWidth: 0,
          textStyle: {
            fontFamily: 'Encode Sans',
            fontSize: 14
            // color: '#FFF'
          },
          // backgroundColor: '#9283BE',
          backgroundColor: '#f5f5f5',
          extraCssText: 'box-shadow: none;',
          formatter: (a) => {
            if (this.selected.length === 1 && this.selected.includes('nacional')) {
              return `<p class="has-text-centered has-text-weight-bold my-0">${a.data.name}</p><p class="has-text-centered my-0">${a.percent} %</p>`
            } else if (this.proMode) {
              return `<p class="has-text-centered has-text-weight-bold">${a.data.name}</p><p class="has-text-centered">${a.percent} %</p>`
            } else if (this.selected.includes(a.data.id_jurisdiccion)) {
              return `<p class="has-text-centered has-text-weight-bold">${a.data.name}</p><p class="has-text-centered">${a.percent} %</p>`
            } else {
              return null
            }
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: {
              show: true,
              title: 'Guardar'
            }
          }
        },
        series: []
      },
      graphReady: false
    }
  },
  computed: {
    selected () {
      return this.$store.state.map.selected
    },
    selectedData () {
      return this.data.values.filter(d => this.selected.includes(d.jurisdiccion))
    },
    proMode () {
      return this.$store.state.system.proMode
    }
  },
  watch: {
    selected (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareChart()
      }
    }
  },
  mounted () {
    this.prepareChart()
  },
  methods: {
    handleChartClickEvent (event) {
      if (!this.proMode) {
        if (event.data && event.data && event.data.id_jurisdiccion) {
          this.$store.dispatch('map/setSelected', event.data.id_jurisdiccion)
        }
      }
    },
    prepareChart () {
      if (this.proMode) {
        this.createSerieProMode()
      } else {
        this.createSerie()
      }
    },
    createSerie () {
      const serie = {
        type: 'pie',
        colorBy: 'data',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2
          // color: '#8D80B9'
        },
        emphasis: {
          focus: 'self'
        },
        label: {
          fontFamily: 'Encode Sans'
        },
        data: []
      }
      let maxValue = 0
      this.data.values.forEach((jurisdiccionData) => {
        // if the value is the jurisdiction "nacional" and the graph should not include it, skip it
        if (!this.graph.include_nacional && jurisdiccionData.id_jurisdiccion === 'nacional') {
          return
        }
        // if this.graph.grafico_valor is not a number, skip it
        if (isNaN(jurisdiccionData[this.graph.grafico_valor])) {
          return
        }
        // now we build the object to be added to the serie
        // a data is an object with "name" and
        const _aux = {}
        _aux.id_jurisdiccion = jurisdiccionData.id_jurisdiccion
        _aux.value = jurisdiccionData[this.graph.grafico_valor]

        if (jurisdiccionData[this.graph.grafico_valor] > maxValue) {
          maxValue = jurisdiccionData[this.graph.grafico_valor]
        }
        _aux.name = jurisdiccionData.jurisdiccion_grafico
        if (this.selected.length === 1 && this.selected.includes('nacional')) {
          _aux.itemStyle = {
            color: '#8D80B9',
            decal: {
              symbol: 'none'
            }
          }
        } else if (jurisdiccionData.id_jurisdiccion === this.selected[0]) {
          _aux.itemStyle = {
            color: '#8D80B9',
            decal: {
              symbol: 'none'
            }
          }
        } else {
          _aux.itemStyle = {
            color: '#cacaca',
            decal: {
              symbol: 'none'
            }
          }
        }
        if (jurisdiccionData.id_jurisdiccion === 'nacional') {
          _aux.itemStyle.decal.symbol = 'rect'
          _aux.itemStyle.decal.dashArrayX = [1, 0]
          _aux.itemStyle.decal.dashArrayY = [2, 3]
          _aux.itemStyle.decal.symbolSize = 1
          _aux.itemStyle.decal.rotation = Math.PI / 4
        }
        serie.data.push(_aux)
      })
      serie.data = serie.data.sort((a, b) => {
        return b.value - a.value
      })
      this.chartOptions.series = [serie]
      this.graphReady = true
    },
    createSerieProMode () {
      const serie = {
        type: 'pie',
        colorBy: 'data',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
          color: '#8D80B9'
        },
        data: []
      }
      const visualMap = {
        show: false,
        min: 0,
        max: 0,
        inRange: {
          colorAlpha: [0.2, 1]
        }
      }
      let maxValue = 0
      if (this.selected.length === 1 && this.selected[0] === 'nacional') {
        maxValue = this.getMaxValueInAllJurisdicciones()
        // if the selected array is just "nacional" we need to add all the jurisdictions
        this.data.values.forEach((jurisdiccionData) => {
          // if the value is the jurisdiction "nacional" and the graph should not include it, skip it
          if (!this.graph.include_nacional && jurisdiccionData.id_jurisdiccion === 'nacional') {
            return
          }
          // if this.graph.grafico_valor is not a number, skip it
          if (isNaN(jurisdiccionData[this.graph.grafico_valor])) {
            return
          }
          // now we build the object to be added to the serie
          // a data is an object with "name" and
          const _aux = {}
          _aux.id_jurisdiccion = jurisdiccionData.id_jurisdiccion
          _aux.value = jurisdiccionData[this.graph.grafico_valor]
          _aux.name = jurisdiccionData.jurisdiccion_grafico
          serie.data.push(_aux)
        })
        serie.data = serie.data.sort((a, b) => {
          return b.value - a.value
        })
      } else {
        // add to serie.data only the data from the selected jurisdictions array
        maxValue = this.getMaxValueInSelectedJurisdicciones()
        const _seriesData = this.filterDataBySelectedJurisdicciones(maxValue)
        serie.data = _seriesData.sort((a, b) => {
          return b.value - a.value
        })
        // maxValue = this.data.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor]
        // const _aux = {
        //   value: this.data.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor],
        //   name: this.data.values.find(v => v.id_jurisdiccion === this.selected).jurisdiccion
        // }
        // serie.data.push(_aux)
      }
      visualMap.max = maxValue
      this.chartOptions.visualMap = visualMap
      this.chartOptions.series = [serie]
      this.graphReady = true
    },
    filterDataBySelectedJurisdicciones () {
      const seriesData = []
      this.data.values.forEach((v) => {
        if (!this.graph.include_nacional && v.id_jurisdiccion === 'nacional') {
          return
        }
        if (!this.selected.includes(v.id_jurisdiccion)) {
          return
        }
        const _aux = {}
        _aux.value = v[this.graph.grafico_valor]
        _aux.name = v.jurisdiccion_grafico
        seriesData.push(_aux)
      })
      return seriesData
    },
    getMaxValueInSelectedJurisdicciones () {
      let _maxValue = 0
      this.selected.forEach((idJurisdiccion) => {
        const _aux = this.data.values.find(jurisdiccionData => jurisdiccionData.id_jurisdiccion === idJurisdiccion)[this.graph.grafico_valor]
        if (_aux > _maxValue) {
          _maxValue = _aux
        }
      })
      return _maxValue
    },
    getMaxValueInAllJurisdicciones () {
      let _maxValue = 0
      this.data.values.forEach((jurisdiccionData) => {
        // if the value is the jurisdiction "nacional" and the graph should not include it, skip it
        if (!this.graph.include_nacional && jurisdiccionData.id_jurisdiccion === 'nacional') {
          return
        }
        if (jurisdiccionData[this.graph.grafico_valor] > _maxValue) {
          _maxValue = jurisdiccionData[this.graph.grafico_valor]
        }
      })
      return _maxValue
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 550px;
}
</style>
