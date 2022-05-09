<template>
  <RadioButton
    :class="className"
    :value="item.value"
    :isChecked="item.isChecked"
    :inputName="`${inputName}`"
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
    // кажется тут везде можно избавиться от inputName оно ни для чего не нужно
    // но сделай потом, когда все будет готово, чтоб ничего не сломать
    inputName: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
