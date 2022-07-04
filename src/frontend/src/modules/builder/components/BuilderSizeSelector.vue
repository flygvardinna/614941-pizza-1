<template>
  <div class="content__diameter">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите размер</h2>

      <div class="sheet__content diameter">
        <AppSelectorItem
          v-for="size in sizes"
          :key="size.id"
          :item="size"
          :input-name="'diameter'"
          :class="`diameter__input diameter__input--${size.value}`"
          @changeSelectedItem="
            changeSelectedItem({
              id: size.id,
              itemName: 'sizes',
            })
          "
        >
          <span>{{ size.name }}</span>
        </AppSelectorItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppSelectorItem from "@/common/components/AppSelectorItem";

export default {
  name: "BuilderSizeSelector",
  components: { AppSelectorItem },

  computed: {
    ...mapState("Builder", ["sizes"]),
  },

  methods: {
    ...mapActions("Builder", ["changeSelectedItem"]),
  },
};
</script>
