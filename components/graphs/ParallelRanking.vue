<template>
  <div v-if="graphReady">
    <h1>Hola</h1>
    <button @click="prepareChart">Do it</button>
    <VueEchart class="chart" :option="chartOptions" :autoresize="true" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartOptions: {
        color: ['#37BBED'],
        parallelAxis: [
          // { dim: 0, name: 'Price' },
          // { dim: 1, name: 'Net Weight' },
          // { dim: 2, name: 'Amount' },
          // {
          //   dim: 3,
          //   name: 'Score',
          //   type: 'category',
          //   data: ['Excellent', 'Good', 'OK', 'Bad']
          // }
        ],
        series: []
      },
      graphReady: false
    }
  },
  computed: {
    theData () {
      return this.$store.state.data.data
    },
    countData () {
      // get from data store the getter allGraphFetched
      return this.$store.getters['data/allGraphFetched']
    },
    theGraphs () {
      return this.$store.state.data.index
    },
    jurisdicciones () {
      return Object.keys(this.$store.state.map.list).filter(key => key !== 'nacional')
    },
    jurisdiccionesAll () {
      return this.$store.state.map.list
    }
  },
  watch: {
    countData (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.prepareChart()
      }
    }
  },
  methods: {
    prepareChart () {
      this.graphReady = false
      const _parallelAxis = [
        {
          dim: 0,
          name: 'Provincia',
          type: 'category',
          data: this.jurisdicciones.reverse(),
          minorTick: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { align: 'right', formatter: v => `${this.jurisdiccionesAll[v]}`, color: 'black', fontSize: 14, padding: [2, 4] }
        }
      ]
      const _auxParallelAxis = this.theGraphs.map((g, i) => {
        return {
          dim: i + 1,
          name: g.nombre_visualizacion,
          id_datos: g.id_datos,
          min: 0,
          max: 25,
          minorTick: { show: true, splitNumber: 1 }
        }
      })

      // console.log(this.theData)
      const _series = this.jurisdicciones.map((j, j2) => {
        return {
          name: j,
          type: 'parallel',
          lineStyle: {
            width: 4
          },
          data: [[j, ..._auxParallelAxis.map((c) => {
            // console.log(this.theData[c.id_datos].values)
            return this.theData[c.id_datos].values.find(x => x.id_jurisdiccion === j).ranking
          })]]
        }
      })
      this.$set(this.chartOptions, 'parallelAxis', _parallelAxis.concat(_auxParallelAxis))
      this.$set(this.chartOptions, 'series', _series)
      this.graphReady = true
    }
  }
}
</script>

<style lang="scss" scoped>
.chart{
  min-height: 800px;
}
</style>
