<template>
  <VueEchart v-if="graphReady" class="chart" :option="chartOptions" :autoresize="true" @click="handleChartClickEvent" />
</template>

<script>
export default {
  name: 'MultiserieJurisdiccion',
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
        animation: true,
        animationDuration: 7000,
        animationEasing: 'linear',
        // animationDurationUpdate: 800,
        // animationEasingUpdate: 'linear',
        // animationDelay: 800,
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontFamily: 'Encode Sans',
            fontSize: 10
            // color: '#FFF'
          },
          backgroundColor: '#f5f5f5',
          borderWidth: 0,
          extraCssText: 'box-shadow: none;'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   padding: [4, 10],
        //   textStyle: {
        //     fontFamily: 'Encode Sans',
        //     fontSize: 14,
        //     color: '#FFF'
        //   },
        //   backgroundColor: '#9283BE',
        //   borderWidth: 0,
        //   extraCssText: 'box-shadow: none;',
        //   formatter: (a) => {
        //     if (this.selected.length === 1 && this.selected.includes('nacional')) {
        //       return `<p class="has-text-centered has-text-weight-bold my-0">${a[0].name}</p><p class="has-text-centered my-0">${a[0].value} %</p>`
        //     } else if (this.proMode) {
        //       return `<p class="has-text-centered has-text-weight-bold">${a[0].name}</p><p class="has-text-centered">${a[0].value} %</p>`
        //     } else if (this.selected.includes(a[0].data.id_jurisdiccion)) {
        //       return `<p class="has-text-centered has-text-weight-bold">${a[0].name}</p><p class="has-text-centered">${a[0].value} %</p>`
        //     } else {
        //       return null
        //     }
        //   }
        // },
        // color: '#8D80B9',
        // aria: {
        //   enabled: true,
        //   decal: {
        //     show: true
        //   }
        // },
        // grid: {
        //   containLabel: true
        // },
        xAxis: {
          type: 'category',
          axisLabel: {
            fontFamily: 'Encode Sans'
          }
        },
        yAxis: {
          type: 'value',
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
    mapStates () {
      return this.$store.state.map.list
    },
    yLabel () {
      if (this.selected[0] === 'nacional') {
        return 'Nacional'
      } else if (this.selected.length === 1 && this.selected[0] !== 'nacional') {
        return this.mapStates[this.selected[0]]
      } else {
        return 'Nacional'
      }
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
        series: [],
        xValues: [],
        seriesNames: []
      }
      _theData.xValues = this.graph.grafico_x.split(',')
      let _copyData
      // No matter the mode, if it is just nacional, show every jurisdiccion
      if ((this.selected.length === 1 && this.selected[0] === 'nacional') || this.selected.length > 1) {
        // If the graph needs to include nacional, just put everything.
        _copyData = JSON.parse(JSON.stringify(this.data.values.filter(jurisdiccionData => jurisdiccionData.id_jurisdiccion === 'nacional')))
      } else {
        _copyData = JSON.parse(JSON.stringify(this.data.values.filter(jurisdiccionData => this.selected.includes(jurisdiccionData.id_jurisdiccion))))
      }
      const seriesNames = this.graph.grafico_y.split(',')
      _theData.seriesNames = seriesNames
      const series = seriesNames.map((serieName, index) => {
        const _aux = _copyData.find(s => s.serie === serieName)
        const serieValues = _theData.xValues.map(c => _aux[c])
        return {
          name: _aux.serie,
          type: 'line',
          data: serieValues
          // color: this.graph.serie_color[index]
        }
      })
      _theData.series = series
      // filter NaN or null
      // _copyData = _copyData.filter((jurisdiccionData) => {
      //   return (!isNaN(jurisdiccionData[this.graph.grafico_valor]) && jurisdiccionData[this.graph.grafico_valor] !== null)
      // })
      return _theData
    },
    createSerie () {
      // const serie = {
      //   // name: this.data.labels[this.graph.grafico_valor],
      //   type: 'bar',
      //   data: [],
      //   label: {
      //     show: true,
      //     position: 'right',
      //     textStyle: {
      //       fontFamily: 'Encode Sans',
      //       fontSize: 10
      //     }
      //   },
      //   showBackground: true,
      //   backgroundStyle: {
      //     color: 'rgba(180, 180, 180, 0.2)'
      //   }
      // }
      const theData = this.prepareData()
      // return theData
      this.chartOptions.color = this.graph.serie_color.split(',')
      this.chartOptions.xAxis.data = theData.xValues
      // this.chartOptions.yAxis.name = this.yLabel
      this.chartOptions.title = {
        text: this.yLabel,
        left: 'center',
        textStyle: {
          fontFamily: 'Encode Sans',
          fontSize: 14,
          color: '#8D80B9'
        }
      }
      this.chartOptions.legend = {
        show: true,
        top: 'bottom',
        left: 'center',
        textStyle: {
          fontFamily: 'Encode Sans',
          fontSize: 10
        }
      }
      this.chartOptions.series = theData.series
      this.graphReady = true
    },
    createSerieProMode () {
      return 'sasa'
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 800px;
}
</style>
