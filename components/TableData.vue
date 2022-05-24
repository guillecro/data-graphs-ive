<template>
  <b-table
    :data="dataTable"
    :columns="columns"
    :default-sort="defaultSort"
    :default-sort-direction="defaultSortDirection"
    :row-class="colorRow"
    narrowed
    hoverable
  >
    <template #footer>
      Total nacional: {{ totalNacional[graph.grafico_valor] }}
    </template>
  </b-table>
</template>

<script>
export default {
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
  // data () {
  //   return {
  //     something: true
  //   }
  // },
  computed: {
    selected () {
      return this.$store.state.map.selected
    },
    defaultSort () {
      if (this.graph.table_default_sort) {
        return this.graph.table_default_sort.split(',')
      } else {
        return []
      }
    },
    defaultSortDirection () {
      if (this.graph.table_default_sort) {
        if (this.graph.table_default_sort_direction) {
          return this.graph.table_default_sort_direction
        } else {
          return 'asc'
        }
      } else {
        return ''
      }
    },
    columns () {
      const columnLabels = this.graph.table_columns.split(',')
      const columns = columnLabels.map((label, i) => {
        return {
          field: label,
          label: this.data.labels[label],
          numeric: this.graph.cast_int.includes(label) || this.graph.cast_float.includes(label),
          centered: this.graph.cast_int.includes(label) || this.graph.cast_float.includes(label),
          sortable: this.graph.table_sortable.includes(label)
        }
      })
      return columns
    },
    dataTable () {
      return this.data.values.filter(d => d.id_jurisdiccion !== 'nacional')
    },
    totalNacional () {
      return this.data.values.find(d => d.id_jurisdiccion === 'nacional')
    }
  },
  methods: {
    colorRow (row, index) {
      if (this.selected.includes(row.id_jurisdiccion)) {
        return 'is-info'
      }
      return ''
    }
  }
}
</script>
