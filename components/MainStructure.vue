<template>
  <div class="section ">
    <div class="columns">
      <div class="column">
        <ArgentinaMap />
      </div>
      <div class="column" v-if="$fetchState.pending">
        <div class="box">
          Loading...
        </div>
      </div>
      <div class="column" v-else>
        <div v-for="(graph,i) in graphs" :key="`graph-${i}`">
          <StatsContainer :graph="graph" />
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
          graph[k] = entry[i] !== '' ? entry[i] : null
        })
        output.push(graph)
      })
      this.$store.commit('data/setIndex', output)
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
    },
    graphs () {
      return this.$store.state.data.index
    }
  }
}
</script>
