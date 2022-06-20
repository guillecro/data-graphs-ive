<template>
  <VueEchart v-if="graphReady" class="chart" :option="chartOptions" :autoresize="true" @click="handleChartClickEvent" />
</template>

<script>
export default {
  name: 'BarraHorizontal',
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
        // visualMap: {
        //   show: false,
        //   min: 0,
        //   max: 0,
        //   inRange: {
        //     colorAlpha: [0.1, 1]
        //   }
        // },
        // tooltip: {
        //   padding: [4, 10],
        //   borderWidth: 0,
        //   textStyle: {
        //     fontFamily: 'Encode Sans',
        //     fontSize: 12,
        //     color: '#FFF'
        //   },
        //   backgroundColor: '#9283BE',
        //   extraCssText: 'box-shadow: none;',
        //   formatter: (a) => {
        //     // console.log()
        //     return `<p class="has-text-centered has-text-weight-bold">${a.data.name}</p><p class="has-text-centered">${a.percent} %</p>`
        //   }
        // },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow'
        //   }
        // },
        tooltip: {
          trigger: 'axis',
          padding: [4, 10],
          textStyle: {
            fontFamily: 'Encode Sans',
            fontSize: 14,
            color: '#FFF'
          },
          backgroundColor: '#9283BE',
          borderWidth: 0,
          extraCssText: 'box-shadow: none;',
          formatter: (a) => {
            if (this.selected.length === 1 && this.selected.includes('nacional')) {
              return `<p class="has-text-centered has-text-weight-bold my-0">${a[0].name}</p><p class="has-text-centered my-0">${a[0].value} %</p>`
            } else if (this.proMode) {
              return `<p class="has-text-centered has-text-weight-bold">${a[0].name}</p><p class="has-text-centered">${a[0].value} %</p>`
            } else if (this.selected.includes(a[0].data.id_jurisdiccion)) {
              return `<p class="has-text-centered has-text-weight-bold">${a[0].name}</p><p class="has-text-centered">${a[0].value} %</p>`
            } else {
              return null
            }
          }
        },
        color: '#8D80B9',
        aria: {
          enabled: true,
          decal: {
            show: true
          }
        },
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            fontFamily: 'Encode Sans'
          }
        },
        yAxis: {
          type: 'category',
          data: [],
          axisLabel: {
            fontFamily: 'Encode Sans'
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
    prepareData () {
      const _theData = {
        yValues: [],
        xValues: []
      }
      let _copyData
      // No matter the mode, if it is just nacional, show every jurisdiccion
      if (this.selected.length === 1 && this.selected[0] === 'nacional') {
        // If the graph needs to include nacional, just put everything.
        if (this.graph.include_nacional) {
          _copyData = JSON.parse(JSON.stringify(this.data.values))
        } else {
          _copyData = JSON.parse(JSON.stringify(this.data.values.filter(jurisdiccionData => jurisdiccionData.id_jurisdiccion !== 'nacional')))
        }
      } else if (this.proMode) {
        _copyData = JSON.parse(JSON.stringify(this.data.values.filter(jurisdiccionData => this.selected.includes(jurisdiccionData.id_jurisdiccion))))
      } else if (!this.graph.include_nacional) {
        _copyData = JSON.parse(JSON.stringify(this.data.values.filter(jurisdiccionData => jurisdiccionData.id_jurisdiccion !== 'nacional')))
      } else {
        _copyData = JSON.parse(JSON.stringify(this.data.values))
      }
      // filter NaN or null
      _copyData = _copyData.filter((jurisdiccionData) => {
        return (!isNaN(jurisdiccionData[this.graph.grafico_valor]) && jurisdiccionData[this.graph.grafico_valor] !== null)
      })
      // sort the _copyData object by ascending value in key 'valor'
      _copyData.sort((a, b) => a[this.graph.grafico_valor] - b[this.graph.grafico_valor])
      _theData.yValues = _copyData.map(jurisdiccionData => jurisdiccionData.jurisdiccion)
      _copyData.forEach((jurisdiccionData) => {
        const _aux = {}
        _aux.value = jurisdiccionData[this.graph.grafico_valor]
        _aux.id_jurisdiccion = jurisdiccionData.id_jurisdiccion
        if (this.selected.length === 1 && this.selected.includes('nacional')) {
          _aux.itemStyle = {
            color: '#8D80B9',
            decal: {
              symbol: 'none'
            }
          }
        } else if (this.selected.includes(jurisdiccionData.id_jurisdiccion)) {
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
          _aux.itemStyle.decal.dashArrayY = [1, 2.5]
          _aux.itemStyle.decal.symbolSize = 1
          _aux.itemStyle.decal.rotation = Math.PI / 5
        }
        _theData.xValues.push(_aux)
      })
      return _theData
    },
    createSerie () {
      const serie = {
        // name: this.data.labels[this.graph.grafico_valor],
        type: 'bar',
        data: [],
        label: {
          show: true,
          position: 'right',
          textStyle: {
            fontFamily: 'Encode Sans',
            fontSize: 10
          }
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
      const theData = this.prepareData()
      serie.data = theData.xValues
      this.chartOptions.yAxis.data = theData.yValues
      this.chartOptions.series = [serie]
      this.graphReady = true
    },
    createSerieProMode () {
      const serie = {
        // name: this.data.labels[this.graph.grafico_valor],
        type: 'bar',
        data: [],
        label: {
          show: true,
          position: 'right'
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
      const theData = this.prepareData()
      serie.data = theData.xValues
      this.chartOptions.yAxis.data = theData.yValues
      this.chartOptions.series = [serie]
      this.graphReady = true
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 800px;
}
</style>
