<template>
  <div id="app">
    <AppLayout :price="totalPrice" :userData="userData">
      <router-view @updateTotalPrice="updateTotalPrice" />
    </AppLayout>
  </div>
</template>

<script>
import AppLayout from "@/layouts/AppLayout";

export default {
  name: "App",
  components: { AppLayout },
  data() {
    return {
      userData: true,
      totalPrice: 0,
    };
  },
  methods: {
    updateTotalPrice(price) {
      this.totalPrice = price;
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";
</style>
