<template>
  <AppRadioButton
    :value="item.value"
    :is-checked="item.isChecked"
    :input-name="inputName"
    @change="$emit('changeSelectedItem')"
  >
    <slot />
  </AppRadioButton>
</template>

<script>
import AppRadioButton from "./AppRadioButton.vue";

export default {
  name: "AppSelectorItem",
  components: { AppRadioButton },

  props: {
    item: {
      type: Object,
      required: true,
    },

    inputName: {
      type: String,
      required: true,
    },
  },
};
</script>
