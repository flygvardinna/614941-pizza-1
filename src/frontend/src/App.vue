<template>
  <div id="app">
    <IndexHome />
  </div>
</template>

<script>
import IndexHome from "@/views/Index";

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
