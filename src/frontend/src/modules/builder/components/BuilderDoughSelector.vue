<template>
  <div class="content__dough">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите тесто</h2>

      <div class="sheet__content dough">
        <SelectorItem
          v-for="item in dough"
          :item="item"
          :key="item.id"
          :isChecked="item.isChecked"
          :inputName="'dought'"
          :className="`dough__input dough__input--${item.value}`"
          @changeSelectedItem="
            changeSelectedItem({
              newValue: $event.target.value,
              itemName: 'dough',
            })
          "
        >
          <b>{{ item.name }}</b>
          <span>{{ item.description }}</span>
        </SelectorItem>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import SelectorItem from "@/common/components/SelectorItem";

export default {
  name: "BuilderDoughSelector",
  components: { SelectorItem },
  computed: {
    ...mapState("Builder", ["dough"]),
  },
  methods: {
    ...mapActions("Builder", ["changeSelectedItem"]),
  },
};
</script>

<style lang="scss" scoped></style>
