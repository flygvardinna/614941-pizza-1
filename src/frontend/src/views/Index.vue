<template>
  <div class="content">
    <router-view />
    <form action="#" method="post">
      <div class="content__wrapper">
        <h1 class="title title--big">Конструктор пиццы</h1>

        <BuilderDoughSelector />

        <BuilderSizeSelector />

        <BuilderIngredientsSelector />

        <BuilderPizzaView />
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
  mounted() {
    // для очистки стора
    //localStorage.clear();
    console.log("cart items", this.cartItems);
  },
  computed: {
    ...mapState("Cart", ["cartItems"]),
  },
  /*data() {
    return {
      pizzaName: "",
      dough: pizza.dough.map((item) => normalizeDetail(Dough, item)),
      sauces: pizza.sauces.map((item) => normalizeDetail(Sauce, item)),
      sizes: pizza.sizes.map((item) => normalizeDetail(Size, item)),
      ingredients: pizza.ingredients.map((item) =>
        normalizeIngredients(Ingredient, item)
      ),
      pizzaName: "",
      cartItems: [],
    };
  },*/
  /*computed: {
    ...mapState("Builder", [
      "selectedDough",
      "selectedSauce",
      "selectedSize",
      "selectedIngredients",
      //"pizzaName",
    ]),
    /*selectedDough() {
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
  },*/
  /*mounted() {
    this.cartItems = getCartItems();
    this.$emit("updateTotalPrice", this.totalPrice);
  },*/
  /*methods: {
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
  },*/
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
