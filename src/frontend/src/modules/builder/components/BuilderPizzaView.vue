<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
      />
    </label>

    <AppDrop @drop="moveIngredient($event)">
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

    <BuilderPriceCounter :price="price" />
  </div>
</template>

<script>
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },
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
    price: {
      type: Number,
      required: true,
    },
  },
  computed: {
    pizzaClassName() {
      const dough = this.dough === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.sauce}`;
    },
  },
  methods: {
    ingredientClassName(value) {
      if (value <= 1) {
        return;
        // неоптимально, перепридумай
      }
      return value === 2 ? `pizza__filling--second` : `pizza__filling--third`;
    },
    moveIngredient(ingredient) {
      console.log("go");
      this.$emit("updateIngredients", ingredient);
    },
  },
};
</script>

<style lang="scss" scoped></style>
