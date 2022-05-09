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
  created() {
    // разберись, зачем это
    window.onerror = function (msg, url, line, col, error) {
      console.error(error);
    };

    // Note: check auth
    /*if (this.$jwt.getToken()) {
      setAuth(this.$store);
    }*/

    this.$store.dispatch("init");
  },
};
</script>

<style lang="scss">
@import "~@/assets/scss/app";
</style>
