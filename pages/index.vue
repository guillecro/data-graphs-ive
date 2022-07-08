<template>
  <section class="top-left">
    <img src="@/assets/top-left.png" class="tl" alt="">
    <img src="@/assets/bottom-right.png" class="br" alt="">
    <MainStructure />
  </section>
</template>

<script>

export default {
  name: 'IndexPage'
}
</script>

<style lang="scss" scoped>
.top-left {
  // position:relative;
  .tl {
    position: fixed;
    top: -10px;
    left: 0;
    width: 300px;
    z-index: -1;
  }
  .br {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 70px;
    z-index: -1;
  }
}
</style>
