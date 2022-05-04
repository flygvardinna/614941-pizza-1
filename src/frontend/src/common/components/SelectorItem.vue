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
    // это value тоже хранить в сторе?
    // видимо, нет - в vuework это остается в компонентах
    // в сторе храним только основные данные, пицца итд
    item: {
      type: Object,
      required: true,
    },
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
