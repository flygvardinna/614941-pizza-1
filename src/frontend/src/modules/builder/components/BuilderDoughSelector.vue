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
          :itemName="'dough'"
          @changeSelectedItem="
            $emit('changeSelectedItem', {
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
import SelectorItem from "@/common/components/SelectorItem";

export default {
  name: "BuilderDoughSelector",
  components: { SelectorItem },
  props: {
    dough: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
