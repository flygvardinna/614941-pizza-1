<template>
  <div class="content__result">
    <p>Итого: {{ price }} ₽</p>
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
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "BuilderPriceCounter",

  computed: {
    ...mapState("Builder", ["pizzaName"]),

    ...mapGetters("Builder", [
      "isPizzaDataLoading",
      "pizzaPrice",
      "currentPizza",
      "selectedIngredients",
    ]),

    isBtnDisabled() {
      return this.selectedIngredients.length === 0 || !this.pizzaName.trim();
    },

    price() {
      return this.isPizzaDataLoading ? 0 : this.pizzaPrice;
    },
  },

  methods: {
    ...mapActions("Builder", ["resetBuilderState", "fetchPizzaParts"]),
    ...mapActions("Cart", ["addItem"]),

    async addToCart() {
      this.addItem(this.currentPizza);
      this.resetBuilderState();
      await this.fetchPizzaParts();
    },
  },
};
</script>
