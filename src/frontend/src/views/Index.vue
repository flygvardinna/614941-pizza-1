<template>
  <div>
    <div class="content">
      <form action="#" method="post">
        <div class="content__wrapper">
          <h1 class="title title--big">Конструктор пиццы</h1>

          <BuilderDoughSelector
            :dough="dough"
            @changeSelectedItem="changeSelectedItem"
          />

          <BuilderSizeSelector
            :sizes="sizes"
            @changeSelectedItem="changeSelectedItem"
          />

          <BuilderIngredientsSelector
            :sauces="sauces"
            :ingredients="ingredients"
            @changeSelectedItem="changeSelectedItem"
            @changeIngredientValue="changeIngredientValue"
          />

          <BuilderPizzaView
            v-model="pizzaName"
            :dough="selectedDough.value"
            :sauce="selectedSauce.value"
            :ingredients="selectedIngredients"
            :price="pizzaPrice"
            @addToCart="addToCart"
            @addIngredient="addIngredient"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import pizza from "@/static/pizza.json";
import {
  normalizeDetail,
  normalizeIngredients,
  getCartItems,
  setCartItems,
} from "@/common/helpers";
import {
  MAX_INGREDIENT_VALUE,
  Dough,
  Sauce,
  Size,
  Ingredient,
} from "@/common/constants";
import BuilderDoughSelector from "@/modules/builder/components/BuilderDoughSelector";
import BuilderSizeSelector from "@/modules/builder/components/BuilderSizeSelector";
import BuilderIngredientsSelector from "@/modules/builder/components/BuilderIngredientsSelector";
import BuilderPizzaView from "@/modules/builder/components/BuilderPizzaView";

export default {
  name: "IndexHome",
  components: {
    BuilderDoughSelector,
    BuilderSizeSelector,
    BuilderIngredientsSelector,
    BuilderPizzaView,
  },
  data() {
    return {
      dough: pizza.dough.map((item) => normalizeDetail(Dough, item)),
      sauces: pizza.sauces.map((item) => normalizeDetail(Sauce, item)),
      sizes: pizza.sizes.map((item) => normalizeDetail(Size, item)),
      ingredients: pizza.ingredients.map((item) =>
        normalizeIngredients(Ingredient, item)
      ),
      pizzaName: "",
      cartItems: [],
    };
  },
  computed: {
    selectedDough() {
      return this.findSelectedItem(this.dough);
    },
    selectedSauce() {
      return this.findSelectedItem(this.sauces);
    },
    selectedSize() {
      return this.findSelectedItem(this.sizes);
    },
    selectedIngredients() {
      return this.ingredients.filter((item) => item.value > 0);
    },
    pizzaPrice() {
      const ingredientsPrices = this.selectedIngredients.map(
        (item) => item.price * item.value
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      return (
        (this.selectedDough.price + this.selectedSauce.price + ingredientsSum) *
        this.selectedSize.multiplier
      );
    },
    totalPrice() {
      const pizzaPrices = this.cartItems.map((item) => item.price);
      return pizzaPrices.length ? pizzaPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },
  mounted() {
    this.cartItems = getCartItems();
    this.$emit("updateTotalPrice", this.totalPrice);
  },
  methods: {
    addToCart() {
      const newPizza = {
        dough: this.selectedDough,
        sauce: this.selectedSauce,
        size: this.selectedSize,
        ingredients: this.selectedIngredients,
        name: this.pizzaName,
        price: this.pizzaPrice,
      };
      this.cartItems = [...this.cartItems, newPizza];
      setCartItems(this.cartItems);
      this.$emit("updateTotalPrice", this.totalPrice);
      this.pizzaName = "";
    },
    findSelectedItem(items) {
      return items.find((item) => item.isChecked);
    },
    changeSelectedItem({ newValue, itemName }) {
      this[itemName].find((el) => el.isChecked).isChecked = false;
      this[itemName].find((el) => el.value === newValue).isChecked = true;
    },
    changeIngredientValue({ name, value }) {
      this.ingredients.find((item) => item.name === name).value = value;
    },
    addIngredient(ingredient) {
      if (ingredient.value !== MAX_INGREDIENT_VALUE) {
        this.changeIngredientValue({
          name: ingredient.name,
          value: ingredient.value + 1,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/mixins/mixins.scss";
@import "~@/assets/scss/layout/content.scss";
@import "~@/assets/scss/layout/sheet.scss";
@import "~@/assets/scss/blocks/diameter.scss";
@import "~@/assets/scss/blocks/dough.scss";
@import "~@/assets/scss/blocks/filling.scss";
@import "~@/assets/scss/blocks/ingredients.scss";
@import "~@/assets/scss/blocks/pizza.scss";
</style>
