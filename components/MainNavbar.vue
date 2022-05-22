<template>
  <b-navbar
    type="is-primary"
  >
    <template #brand>
      <b-navbar-item>
        <i class="fas fa-chart-pie" />
      </b-navbar-item>
    </template>
    <template #start>
      <b-navbar-dropdown :label="selectedLabel" :collapsible="true">
        <b-navbar-item v-for="(state,index) in mapStates" :key="`nav-${index}`" :active="selected.includes(index)" @click="changeSelected(index)">
          {{ state }}
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template #end>
      <b-navbar-dropdown :label="'Columnas'" :collapsible="true">
        <b-navbar-item @click="changeColumns(12)">
          Ancho completo
        </b-navbar-item>
        <b-navbar-item @click="changeColumns(6)">
          Dos Columnas
        </b-navbar-item>
        <b-navbar-item @click="changeColumns(4)">
          Tres columnas
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item v-if="isLoading">
        Cargando! <i class="fas fa-spin fa-sync" />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: 'MainNavbar',
  computed: {
    selected () {
      return this.$store.state.map.selected
    },
    selectedLabel () {
      if (this.selected.length === 0) {
        return 'Seleccionar'
      } else if (this.selected.length === 1) {
        return this.mapStates[this.selected[0]]
      } else {
        return `${this.selected.length} seleccionados`
      }
    },
    mapStates () {
      return this.$store.state.map.list
    },
    isLoading () {
      return this.$store.state.data.isLoading
    }
  },
  methods: {
    changeSelected (state) {
      this.$store.commit('map/setSelected', state)
    },
    changeColumns (columns) {
      this.$store.commit('system/setColumns', columns)
    }
  }
}
</script>
