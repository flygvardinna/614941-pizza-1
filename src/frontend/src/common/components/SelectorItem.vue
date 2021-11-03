<template>
  <RadioButton
    :value="item.value"
    :isChecked="item.isChecked"
    :inputName="`${inputName}`"
    :itemName="`${itemName}`"
    @changeSelectedItem="$emit('changeSelectedItem', $event)"
  >
    <slot />
  </RadioButton>
</template>

<script>
import RadioButton from "./RadioButton.vue";

export default {
  name: "SelectorItem",
  components: { RadioButton },
  props: {
    item: {
      type: Object,
      required: true,
    },
    inputName: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
