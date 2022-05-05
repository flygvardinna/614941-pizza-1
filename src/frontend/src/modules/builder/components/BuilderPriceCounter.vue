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
    ...mapGetters("Builder", ["currentPizza", "pizzaPrice"]),
    isBtnDisabled() {
      return !this.currentPizza.ingredients.length || !this.pizzaName;
    },
  },
  methods: {
    ...mapActions("Builder", ["resetBuilderState", "fetchPizzaParts"]),
    ...mapActions("Cart", ["addItem"]),
    addToCart() {
      this.addItem();
      this.resetBuilderState();
      this.fetchPizzaParts();
      void this.$router.push({ name: "IndexHome" });
    },
  },
};
</script>

<style lang="scss" scoped></style>
