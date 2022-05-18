<template>
  <b-navbar
    type="is-primary"
  >
    <!-- <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img
          src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        >
      </b-navbar-item>
    </template> -->
    <template #start>
      <b-navbar-item>
        <i class="fas fa-chart-pie"></i>
      </b-navbar-item>
      <b-navbar-dropdown :label="selectedLabel">
        <b-navbar-item v-for="(state,index) in mapStates" :key="`nav-${index}`" @click="changeSelected(index)">
          {{ state }}
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template #end>
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
      return this.mapStates[this.selected]
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
    }
  }
}
</script>
