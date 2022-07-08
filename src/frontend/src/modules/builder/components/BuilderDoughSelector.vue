<template>
  <div class="content__dough">
    <div class="sheet">
      <h2 class="title title--small sheet__title">
        Выберите тесто
      </h2>

      <div class="sheet__content dough">
        <AppSelectorItem
          v-for="item in dough"
          :key="item.id"
          :item="item"
          :input-name="'dough'"
          :class="`dough__input dough__input--${item.value}`"
          @changeSelectedItem="
            changeSelectedItem({
              id: item.id,
              itemName: 'dough',
            })
          "
        >
          <b>{{ item.name }}</b>
          <span>{{ item.description }}</span>
        </AppSelectorItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import AppSelectorItem from "@/common/components/AppSelectorItem";

export default {
  name: "BuilderDoughSelector",
  components: { AppSelectorItem },

  computed: {
    ...mapState("Builder", ["dough"]),
  },

  methods: {
    ...mapActions("Builder", ["changeSelectedItem"]),
  },
};
</script>
