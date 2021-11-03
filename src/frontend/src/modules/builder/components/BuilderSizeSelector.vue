<template>
  <div class="content__diameter">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите размер</h2>

      <div class="sheet__content diameter">
        <SelectorItem
          v-for="size in sizes"
          :item="size"
          :key="size.id"
          :isChecked="size.isChecked"
          :inputName="'diameter'"
          :itemName="'diameter'"
          @changeSelectedItem="
            $emit('changeSelectedItem', {
              newValue: $event.target.value,
              itemName: 'sizes',
            })
          "
        >
          <span>{{ size.name }}</span>
        </SelectorItem>
      </div>
    </div>
  </div>
</template>

<script>
import SelectorItem from "@/common/components/SelectorItem";

export default {
  name: "BuilderSizeSelector",
  components: { SelectorItem },
  props: {
    sizes: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
