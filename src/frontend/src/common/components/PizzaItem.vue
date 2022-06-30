<template>
  <div class="product">
    <img
      src="@/assets/img/product.svg"
      class="product__img"
      width="56"
      height="56"
      :alt="pizza.name"
    />
    <div class="product__text">
      <h2>{{ pizza.name }}</h2>
      <ul>
        <li>{{ sizeAndDoughDescription }}</li>
        <li>Соус: {{ sauceName }}</li>
        <li>Начинка: {{ ingredientsList }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getItemById } from "@/common/helpers";

export default {
  name: "PizzaItem",

  props: {
    pizza: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState("Builder", ["dough", "sauces", "sizes", "ingredients"]),

    sizeAndDoughDescription() {
      const size = getItemById(this.sizes, this.pizza.sizeId).name;
      const dough = getItemById(this.dough, this.pizza.doughId).name;
      const doughName = dough === "Толстое" ? "толстом" : "тонком";

      return `${size}, на ${doughName} тесте`;
    },

    sauceName() {
      return getItemById(this.sauces, this.pizza.sauceId).name.toLowerCase();
    },

    ingredientsList() {
      const names = this.pizza.ingredients.map((ingredient) => {
        return getItemById(this.ingredients, ingredient.ingredientId).name;
      });
      return names.map((name) => name.toLowerCase()).join(", ");
    },
  },
};
</script>

<style lang="scss" scoped></style>
