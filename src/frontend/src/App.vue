<template>
  <div id="app">
    <AppLayout>
      <router-view />
    </AppLayout>
  </div>
</template>

<script>
import AppLayout from "@/layouts/AppLayout";

export default {
  name: "App",
  components: { AppLayout },
  /*data() {
    return {
      userData: false,
      totalPrice: 0,
    };
  },
  methods: {
    updateTotalPrice(price) {
      this.totalPrice = price;
    },
  },*/
  created() {
    this.$store.dispatch("init");
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";
</style>
