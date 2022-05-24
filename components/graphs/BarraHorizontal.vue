<template>
  <VueEchart v-if="graphReady" class="chart" :option="chartOptions" :autoresize="true" />
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        color: '#37BBED',
        grid: {
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: []
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
    prepareChart () {
      const serie = {
        name: this.data.labels[this.graph.grafico_valor],
        type: 'bar',
        data: [],
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
      let copyData
      if (this.selected.length === 1 && this.selected[0] === 'nacional') {
        // create a copy of this.data.values object
        copyData = JSON.parse(JSON.stringify(this.data.values.filter(d => d.id_jurisdiccion !== 'nacional')))
      } else {
        copyData = JSON.parse(JSON.stringify(this.data.values.filter(d => this.selected.includes(d.id_jurisdiccion))))
      }
      // sort the copyData object by ascending value in key 'valor'
      copyData.sort((a, b) => a[this.graph.grafico_valor] - b[this.graph.grafico_valor])
      serie.data = copyData.map(d => d[this.graph.grafico_valor])
      this.chartOptions.yAxis.data = copyData.map(d => d.jurisdiccion)
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
