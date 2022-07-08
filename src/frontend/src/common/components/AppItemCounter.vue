<template>
  <div class="counter">
    <button
      type="button"
      class="counter__button counter__button--minus"
      :disabled="isMinusBtnDisabled"
      @click="$emit('changeItemValue', value - 1)"
    >
      <span class="visually-hidden">Меньше</span>
    </button>
    <input
      :value="value"
      type="text"
      name="counter"
      class="counter__input"
    />
    <button
      type="button"
      :class="[
        'counter__button counter__button--plus',
        isOrangeBtn ? 'counter__button--orange' : '',
      ]"
      :disabled="isPlusBtnDisabled"
      @click="$emit('changeItemValue', value + 1)"
    >
      <span class="visually-hidden">Больше</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "AppItemCounter",

  props: {
    value: {
      type: Number,
      required: true,
    },

    minValue: {
      type: Number,
      required: true,
    },

    maxValue: {
      type: Number,
      required: true,
    },

    isOrangeBtn: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isMinusBtnDisabled() {
      return this.value === this.minValue;
    },

    isPlusBtnDisabled() {
      return this.value === this.maxValue;
    },
  },
};
</script>
