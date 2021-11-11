<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
        :value="pizzaName"
        @input="$emit('input', $event.target.value)"
      />
    </label>

    <AppDrop @drop="addIngredient">
      <div class="content__constructor">
        <div :class="['pizza', pizzaClassName]">
          <div class="pizza__wrapper">
            <div
              v-for="ingredient in ingredients"
              :key="ingredient.name"
              class="pizza__filling"
              :class="[
                `pizza__filling--${ingredient.englishName}`,
                ingredientClassName(ingredient.value),
              ]"
            ></div>
          </div>
        </div>
      </div>
    </AppDrop>

    <BuilderPriceCounter
      :price="price"
      :pizzaName="pizzaName"
      :ingredients="ingredients"
      @addToCart="$emit('addToCart')"
    />
  </div>
</template>

<script>
import { MAX_INGREDIENT_VALUE } from "@/common/constants";
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },
  model: {
    prop: "pizzaName",
    event: "input",
  },
  props: {
    dough: {
      type: String,
      required: true,
    },
    sauce: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    pizzaName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      value: "",
    };
  },
  computed: {
    pizzaClassName() {
      const dough = this.dough === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.sauce}`;
    },
  },
  methods: {
    ingredientClassName(value) {
      if (value < 2) {
        return;
      }
      return value === MAX_INGREDIENT_VALUE
        ? `pizza__filling--third`
        : `pizza__filling--second`;
    },
    addIngredient(ingredient) {
      if (ingredient.value !== MAX_INGREDIENT_VALUE) {
        ingredient.value++;
        this.$emit("changeIngredientValue", ingredient);
      } else {
        return;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
