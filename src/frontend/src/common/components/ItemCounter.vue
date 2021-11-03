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
    <input :value="counter" type="text" name="counter" class="counter__input" />
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
      return this.counter === 0;
    },
    isPlusBtnDisabled() {
      return this.counter === 3;
      // замени на константы мин и макс везде
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
