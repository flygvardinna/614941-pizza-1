<template>
  <div class="counter counter--orange ingredients__counter">
    <button
      type="button"
      class="counter__button counter__button--minus"
      :disabled="isMinusBtnDisabled"
      @click="removeIngredient"
    >
      <span class="visually-hidden">Меньше</span>
    </button>
    <input :value="value" type="text" name="counter" class="counter__input" />
    <button
      type="button"
      class="counter__button counter__button--plus"
      :disabled="isPlusBtnDisabled"
      @click="addIngredient"
    >
      <span class="visually-hidden">Больше</span>
    </button>
  </div>
</template>

<script>
import { MIN_INGREDIENT_VALUE, MAX_INGREDIENT_VALUE } from "@/common/constants";

export default {
  name: "ItemCounter",
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data: function () {
    return {
      counter: this.value,
    };
  },
  computed: {
    isMinusBtnDisabled() {
      return this.value === MIN_INGREDIENT_VALUE;
    },
    isPlusBtnDisabled() {
      return this.value === MAX_INGREDIENT_VALUE;
    },
  },
  watch: {
    value(newValue) {
      this.counter = newValue;
    },
  },
  methods: {
    addIngredient() {
      this.counter++;
      this.$emit("changeIngredientValue", this.counter);
    },
    removeIngredient() {
      this.counter--;
      this.$emit("changeIngredientValue", this.counter);
    },
  },
};
</script>

<style lang="scss" scoped></style>
