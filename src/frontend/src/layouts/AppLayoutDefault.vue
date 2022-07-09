<template>
  <div>
    <NotificationsContainer />
    <AppLayoutHeader />
    <slot />
  </div>
</template>

<script>
import NotificationsContainer from "@/common/components/NotificationsContainer";
import AppLayoutHeader from "@/layouts/AppLayoutHeader";

export default {
  name: "AppLayoutDefault",

  components: {
    NotificationsContainer,
    AppLayoutHeader,
  },
};
</script>
