<template>
  <label>
    <input
      :value="value"
      :checked="isChecked"
      :name="inputName"
      type="radio"
      class="visually-hidden"
      @change="$emit('change')"
    />
    <slot />
  </label>
</template>

<script>
export default {
  name: "AppRadioButton",

  props: {
    value: {
      type: String,
      required: true,
    },

    isChecked: {
      type: Boolean,
      required: true,
    },

    inputName: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
