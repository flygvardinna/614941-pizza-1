<template>
  <div>
    <NotificationsContainer />
    <AppLayoutHeader />

    <main class="layout">
      <AppLayoutSidebar />
      <slot />
    </main>
  </div>
</template>

<script>
import NotificationsContainer from "@/common/components/NotificationsContainer";
import AppLayoutHeader from "@/layouts/AppLayoutHeader";
import AppLayoutSidebar from "@/layouts/AppLayoutSidebar";

export default {
  name: "AppLayoutDefault",

  components: {
    NotificationsContainer,
    AppLayoutHeader,
    AppLayoutSidebar,
  },
};
</script>
