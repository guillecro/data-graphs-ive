<template>
  <VueEchart v-if="graphReady" class="chart" :option="chartOptions" :autoresize="true" />
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
        visualMap: {
          show: false,
          min: 0,
          max: 0,
          inRange: {
            colorAlpha: [0.1, 1]
          }
        },
        tooltip: {
          padding: [4, 10],
          borderWidth: 0,
          textStyle: {
            fontFamily: 'Encode Sans',
            fontSize: 12,
            color: '#FFF'
          },
          backgroundColor: '#9283BE',
          extraCssText: 'box-shadow: none;',
          formatter: (a) => {
            // console.log()
            return `<p class="has-text-centered has-text-weight-bold">${a.data.name}</p><p class="has-text-centered">${a.percent} %</p>`
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
        type: 'pie',
        colorBy: 'data',
        radius: ['40%', '70%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
          color: '#37BBED'
        },
        data: []
      }
      let maxValue = 0
      if (this.selected.length === 1 && this.selected[0] === 'nacional') {
        this.data.values.forEach((v) => {
          if (v.id_jurisdiccion === 'nacional') {
            return
          }
          const _aux = {}
          _aux.value = v[this.graph.grafico_valor]
          if (v[this.graph.grafico_valor] > maxValue) {
            maxValue = v[this.graph.grafico_valor]
          }
          _aux.name = v.jurisdiccion
          serie.data.push(_aux)
        })
        serie.data = serie.data.sort((a, b) => {
          return b.value - a.value
        })
      } else {
        this.data.values.forEach((v) => {
          if (v.id_jurisdiccion === 'nacional') {
            return
          }
          if (!this.selected.includes(v.id_jurisdiccion)) {
            return
          }
          const _aux = {}
          _aux.value = v[this.graph.grafico_valor]
          if (v[this.graph.grafico_valor] > maxValue) {
            maxValue = v[this.graph.grafico_valor]
          }
          _aux.name = v.jurisdiccion
          serie.data.push(_aux)
        })
        serie.data = serie.data.sort((a, b) => {
          return b.value - a.value
        })
        // maxValue = this.data.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor]
        // const _aux = {
        //   value: this.data.values.find(v => v.id_jurisdiccion === this.selected)[this.graph.grafico_valor],
        //   name: this.data.values.find(v => v.id_jurisdiccion === this.selected).jurisdiccion
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
  min-height: 550px;
}
</style>
