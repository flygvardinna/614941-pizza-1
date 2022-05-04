<template>
  <div class="content__result">
    <p>Итого: {{ pizzaPrice }} ₽</p>
    <button
      type="button"
      class="button"
      :disabled="isBtnDisabled"
      @click="addToCart"
    >
      Готовьте!
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "BuilderPriceCounter",
  computed: {
    ...mapState("Builder", ["pizzaName"]),
    //...mapGetters("Builder", ["pizzaPrice", "selectedIngredients"]),
    ...mapGetters("Builder", ["currentPizza", "pizzaPrice"]),
    isBtnDisabled() {
      return !this.currentPizza.ingredients.length || !this.pizzaName;
    },
  },
  methods: {
    ...mapActions("Cart", ["addToCart"]),
  },
};
</script>

<style lang="scss" scoped></style>
