<template>
  <div class="app-layout-default">
    <AppLayoutHeader :price="price" :userData="userData" />
    <slot />
  </div>
</template>

<script>
import AppLayoutHeader from "@/layouts/AppLayoutHeader";

export default {
  name: "AppLayoutDefault",
  components: {
    AppLayoutHeader,
  },
  props: {
    price: {
      type: Number,
      required: true,
    },
    userData: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
