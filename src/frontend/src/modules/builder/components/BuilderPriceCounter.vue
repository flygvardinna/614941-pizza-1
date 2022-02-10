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
  /*props: {
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
  },*/
  computed: {
    ...mapState("Builder", ["pizzaName", "pizzaPrice"]),
    ...mapGetters("Builder", ["selectedIngredients"]),
    isBtnDisabled() {
      return !this.selectedIngredients.length || !this.pizzaName;
    },
  },
  methods: {
    ...mapActions("Builder", ["addToCart"]),
  },
};
</script>

<style lang="scss" scoped></style>
