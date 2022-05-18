<template>
  <div class="box">
    <div v-if="$fetchState.pending">
      <i class="fas fa-spin fa-sync" /> Cargando...
    </div>
    <div v-else-if="$fetchState.error">
      <i class="fas fa-exclamation-triangle" /> Error!
    </div>
    <div v-else>
      {{ theData }}
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
      theData: []
    }
  },
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
          data[k] = entry[i] !== '' ? entry[i] : null
        })
        theValues.push(data)
      })
      this.theData = {
        keys,
        labels: theLabels,
        values: theValues
      }
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
  }
}
</script>
