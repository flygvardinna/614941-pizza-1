<template>
  <div class="content__result">
    <p>Итого: {{ price }} ₽</p>
    <button
      type="button"
      class="button"
      :class="{ 'button--disabled': isBtnDisabled }"
      :disabled="isBtnDisabled"
      @click="$emit('addToCart')"
    >
      Готовьте!
    </button>
  </div>
</template>

<script>
export default {
  name: "BuilderPriceCounter",
  props: {
    price: {
      type: Number,
      required: true,
    },
    pizzaName: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isBtnDisabled() {
      return !this.ingredients.length || !this.pizzaName;
    },
  },
};
</script>

<style lang="scss" scoped></style>
