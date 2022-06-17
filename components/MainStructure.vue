<template>
  <div class="py-6">
    <div class="container is-fluid">
      <div class="columns">
        <div class="column is-2">
          <ArgentinaMap />
        </div>
        <div class="column is-10">
          <div class="columns is-multiline">
            <div v-if="$fetchState.pending" class="column is-12 chart is-flex is-justify-content-center is-align-items-center">
              <i class="fas fa-spin fa-5x fa-sync" />
            </div>
            <div v-else-if="$fetchState.error" class="column is-12 chart is-flex is-justify-content-center is-align-items-center">
              <i class="fas fa-exclamation-triangle fa-5x fa-sync" /> Error!
            </div>
            <div v-for="(graph,i) in graphs" v-else :key="`graph-${i}`" class="column" :class="getColumns">
              <StatsContainer :graph="graph" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArgentinaMap from './ArgentinaMap.vue'

export default {
  name: 'MainStructure',
  components: {
    ArgentinaMap
  },
  fetchOnServer: false,
  async fetch () {
    try {
      // console.log(app)
      // fetch with axios
      const response = await this.$axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${this.googleSheetId}/values/index?key=${this.googleApiKey}`)
      const keys = response.data.values[0]
      const values = response.data.values.slice(1)
      const output = []
      values.forEach((entry) => {
        // eslint-disable-next-line prefer-const
        const graph = {}
        keys.forEach((k, i) => {
          if (k === 'cast_float') {
            graph[k] = entry[i].split(',')
          } else if (k === 'cast_int') {
            graph[k] = entry[i].split(',')
          } else if (k === 'include_nacional') {
            console.log(k)
            console.log(entry[i])
            // if entry[i] is "TRUE" save as boolean
            graph[k] = entry[i] === 'TRUE'
          } else {
            graph[k] = entry[i] !== '' ? entry[i] : null
          }
        })
        // create fake id with random number
        graph.id = `graph-${Math.floor(Math.random() * 1000000)}`
        graph.fetched = true
        output.push(graph)
      })
      this.$store.commit('data/setIndex', output)
      this.$store.commit('data/setIsLoading', false)
    } catch (err) {
      this.$buefy.dialog.alert(`Error al obtener los datos: ${err.message}`)
      return null
    }
  },
  computed: {
    getColumns () {
      return `is-${this.$store.state.system.columns}`
    },
    googleSheetId () {
      return process.env.googleSheetId
    },
    googleApiKey () {
      return process.env.googleApiKey
    },
    graphs () {
      return this.$store.state.data.index
    }
  }
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 600px;
}
</style>
