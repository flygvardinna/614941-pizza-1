<template>
  <div>
    <AppLayout :price="totalPrice" />
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
            @drop="updateIngredients(ingredient)"
          />

          <BuilderPizzaView
            :dough="selectedItems.dough.value"
            :sauce="selectedItems.sauce.value"
            :ingredients="selectedItems.ingredients"
            :price="pizzaPrice"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import pizza from "@/static/pizza.json";
import { normalizeDetail, normalizeIngredients } from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/constants";
import AppLayout from "@/layouts/AppLayout";
import BuilderDoughSelector from "@/modules/builder/components/BuilderDoughSelector";
import BuilderSizeSelector from "@/modules/builder/components/BuilderSizeSelector";
import BuilderIngredientsSelector from "@/modules/builder/components/BuilderIngredientsSelector";
import BuilderPizzaView from "@/modules/builder/components/BuilderPizzaView";

export default {
  name: "IndexHome",
  components: {
    AppLayout,
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
    };
  },
  computed: {
    selectedItems() {
      return {
        dough: this.findSelectedItem(this.dough),
        sauce: this.findSelectedItem(this.sauces),
        size: this.findSelectedItem(this.sizes),
        ingredients: this.getSelectedIngredients(),
      };
    },
    pizzaPrice() {
      const ingredientsPrices = this.selectedItems.ingredients.map(
        (item) => item.price * item.value
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      return (
        (this.selectedItems.dough.price +
          this.selectedItems.sauce.price +
          ingredientsSum) *
        this.selectedItems.size.multiplier
      );
    },
    totalPrice() {
      return 0;
    },
  },
  methods: {
    findSelectedItem(items) {
      return items.find((item) => item.isChecked);
    },
    getSelectedIngredients() {
      return this.ingredients.filter((item) => item.value > 0);
    },
    changeSelectedItem({ newValue, itemName }) {
      const items = this[itemName].slice();
      items.find((el) => el.isChecked).isChecked = false;
      items.find((el) => el.value === newValue).isChecked = true;
      this[itemName] = items;
    },
    // упразднить? у радио кнопок итак есть checked по умолчанию?
    changeIngredientValue({ name, value }) {
      console.log(name, value);
      const ingredients = this.ingredients.slice();
      const index = ingredients.findIndex((item) => item.name === name);
      if (~index) {
        // тут -1 если не найден в массиве
        ingredients[index].value = value;
      } else {
        ingredients.push({ name, value });
      }
      this.ingredients = ingredients;
      console.log(this.ingredients);
    },
    updateIngredients(ingredient) {
      console.log("pli");
      if (ingredient.value !== 3) {
        const ingredients = this.ingredients.slice();
        const index = ingredients.findIndex(
          (item) => item.name === ingredient.name
        );
        ingredients[index].value = ingredient.value++;
        this.ingredients = ingredients;
        console.log(this.ingredients);
      } else {
        return;
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
