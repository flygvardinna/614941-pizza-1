<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
        :value="pizzaName"
        @input="setPizzaName($event.target.value)"
      />
    </label>

    <AppDrop @drop="addIngredient($event)">
      <div class="content__constructor">
        <div :class="['pizza', pizzaClassName]">
          <div class="pizza__wrapper">
            <div
              v-for="ingredient in selectedIngredients"
              :key="ingredient.name"
              class="pizza__filling"
              :class="[
                `pizza__filling--${ingredient.englishName}`,
                getIngredientClassName(ingredient.value),
              ]"
            ></div>
          </div>
        </div>
      </div>
    </AppDrop>

    <BuilderPriceCounter />
  </div>
</template>

<script>
import { MAX_INGREDIENT_VALUE } from "@/common/constants";
import { mapActions, mapGetters, mapState } from "vuex";
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },
  computed: {
    ...mapState("Builder", [
      "selectedDough",
      "selectedSauce",
      "selectedIngredients",
      "pizzaName",
    ]),
    ...mapGetters("Builder", [
      "selectedDough",
      "selectedSauce",
      "selectedIngredients",
    ]),
    pizzaClassName() {
      const dough = this.selectedDough.value === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.selectedSauce.value}`;
    },
  },
  methods: {
    ...mapActions("Builder", ["setPizzaName", "changeIngredientValue"]),
    getIngredientClassName(value) {
      if (value < 2) {
        return;
      }
      return value === MAX_INGREDIENT_VALUE
        ? `pizza__filling--third`
        : `pizza__filling--second`;
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

<style lang="scss" scoped></style>
