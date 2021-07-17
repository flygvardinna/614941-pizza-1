<template>
  <div id="app">
    <IndexHome />
  </div>
</template>

<script>
import IndexHome from "@/views/index";

export default {
  name: "App",
  components: {
    IndexHome,
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";
</style>
