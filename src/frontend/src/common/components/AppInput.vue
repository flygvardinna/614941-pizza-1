<template>
  <div class="text-field">
    <input
      ref="input"
      :value="value"
      :type="type"
      :name="name"
      class="text-field__input"
      :class="{ 'text-field__input--error': showError }"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    />
    <span v-if="showError" class="text-field__text">
      {{ errorText }}
    </span>
  </div>
</template>

<script>
export default {
  name: "AppInput",

  model: {
    prop: "value",
    event: "input",
  },

  props: {
    value: {
      type: [String, Number],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "text",
    },

    placeholder: {
      type: String,
      default: "",
    },

    errorText: {
      type: String,
      default: "",
    },

    required: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    showError() {
      return !!this.errorText;
    },
  },
};
</script>
