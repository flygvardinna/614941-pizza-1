<template>
  <label :class="className">
    <input
      :value="value"
      :checked="isChecked"
      :name="inputName"
      type="radio"
      class="visually-hidden"
      @change="$emit('changeSelectedItem', $event)"
    />
    <slot />
  </label>
</template>

<script>
export default {
  name: "RadioButton",
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
    itemName: {
      type: String,
      required: true,
    },
  },
  computed: {
    className() {
      if (this.itemName === "ingredients") {
        return `radio ingredients__input`;
      } else {
        return `${this.itemName}__input ${this.itemName}__input--${this.value}`;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
