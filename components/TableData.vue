<template>
  <!-- <b-table
    :data="dataTable"
    :columns="columns"
    :default-sort="defaultSort"
    :default-sort-direction="defaultSortDirection"
    :row-class="colorRow"
    narrowed
    hoverable
  > -->
  <b-table
    :data="dataTable"
    :default-sort="defaultSort"
    :default-sort-direction="defaultSortDirection"
    :row-class="colorRow"
    narrowed
    hoverable
    fullwidth
  >
    <b-table-column
      v-for="column in columns"
      :key="`${graph.id}-${column.field}`"
      :field="column.field"
      :label="column.label"
      :numeric="column.numeric"
      :centered="column.centered"
      :sortable="column.sortable"
    >
      <template v-slot:header="{ column }">
        <b-tooltip v-if="getLabelInfo(column.field)" :label="getLabelInfo(column.field)" append-to-body dashed position="is-top">
          {{ column.label }}
        </b-tooltip>
        <span v-else>{{ column.label }}</span>
      </template>
      <template #default="props">
        {{ isNumericAndCanBeShown(column, props.row) ? formatNumber(column, props.row) : null }}
        {{ isText(column) ? props.row[column.field] : null }}
        <b-tooltip
          v-if="column.numeric && dataDoesntApply(column, props.row)"
          multilined
          label="Dato que no corresponde presentar debido a la naturaleza de las cosas o del cálculo"
        >
          <span class="has-text-grey has-text-weight-bold">///</span>
        </b-tooltip>
        <b-tooltip
          v-if="column.numeric && dataUnavailable(column, props.row)"
          multilined
          label="Dato no disponible a la fecha de presentación de los resultados"
        >
          <span class="has-text-grey has-text-weight-bold">···</span>
        </b-tooltip>
      </template>
    </b-table-column>
    <!-- <template #footer>
      Total nacional: {{ totalNacional[graph.grafico_valor] }}
    </template> -->
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
        const theColumn = {
          field: label,
          label: this.data.labels[label],
          numeric: this.graph.cast_int.includes(label) || this.graph.cast_float.includes(label),
          centered: this.graph.cast_int.includes(label) || this.graph.cast_float.includes(label),
          sortable: this.graph.table_sortable.includes(label)
        }
        // if (theColumn.sortable && theColumn.numeric) {
        //   theColumn.customSort = (a, b, isAsc) => {
        //     // equal items sort equally
        //     if (a === b) {
        //         return 0
        //     } else if
        //     if (isAsc) {
        //       return a[label] - b[label]
        //     } else {
        //       return b[label] - a[label]
        //     }
        //   }
        // }
        return theColumn
      })
      return columns
    },
    dataTable () {
      if (!this.columns) {
        return []
      }
      const copyData = JSON.parse(JSON.stringify(this.data.values))
      copyData.forEach((jurisdiccionData) => {
        for (const [key, value] of Object.entries(jurisdiccionData)) {
          const dataColumn = this.columns.find(c => c.field === key)
          if (dataColumn && dataColumn.numeric) {
            if (isNaN(value)) {
              jurisdiccionData[key] = null
            }
          }
        }
      })
      return copyData
      // remove any object that one of the values contains a null, '...', '///' or 'N/A'
      // return this.data.values.filter(d => d.id_jurisdiccion !== 'nacional')
    },
    totalNacional () {
      return this.data.values.find(d => d.id_jurisdiccion === 'nacional')
    }
  },
  methods: {
    getLabelInfo (field) {
      return this.data.labelsInfo[field]
    },
    colorRow (row, index) {
      if (this.selected.includes(row.id_jurisdiccion)) {
        return 'is-info'
      }
      return ''
    },
    formatNumber (column, data) {
      if (this.graph.cast_int.includes(column.field)) {
        return data[column.field].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(',', '.')
      } if (this.graph.cast_float.includes(column.field)) {
        const _aux = data[column.field].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        // split decimal
        const _aux2 = _aux.split('.')
        if (_aux2.length > 1) {
          return _aux2[0] + ',' + _aux2[1]
        } else {
          return _aux + ',00'
        }
      }
    },
    isNumericAndCanBeShown (column, data) {
      if (!column.numeric || isNaN(data[column.field]) || data[column.field] === null) {
        return false
      } else {
        return true
      }
    },
    isText (column, data) {
      if (!column.numeric) {
        return true
      } else {
        return false
      }
    },
    dataDoesntApply (column, data) {
      const _jurisdiccionData = this.data.values.find(jurisdiccionData => data.id_jurisdiccion === jurisdiccionData.id_jurisdiccion)
      if (!_jurisdiccionData) {
        return false
      }
      if (_jurisdiccionData[column.field] === '///') {
        return true
      }
    },
    dataUnavailable (column, data) {
      // console.log(data.id_jurisdiccion)
      const _jurisdiccionData = this.data.values.find(jurisdiccionData => data.id_jurisdiccion === jurisdiccionData.id_jurisdiccion)
      // console.log(_jurisdiccionData)
      if (!_jurisdiccionData) {
        return false
      }
      if (_jurisdiccionData[column.field] === '...') {
        return true
      }
    }
  }
}
</script>
