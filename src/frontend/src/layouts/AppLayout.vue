<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script>
const defaultLayout = "AppLayoutDefault";

// здесь все-таки переделать как-то придется, чтоб на странице логина не было хедера
// значит Default будет страницей без хедера а Main - с ним
// или как-то еще
export default {
  name: "AppLayout",
  computed: {
    layout() {
      const layout = this.$route.meta.layout || defaultLayout;
      return () => import(`@/layouts/${layout}.vue`);
    },
  },
};
</script>
