<template>
  <div class="content__pizza">
    <label class="input">
      <span class="visually-hidden">Название пиццы</span>
      <input
        type="text"
        name="pizza_name"
        placeholder="Введите название пиццы"
        required
        :value="pizzaName"
        @input="setPizzaName($event.target.value)"
      />
    </label>

    <AppDrop data-test="pizza__wrapper" @drop="addIngredient($event)">
      <div class="content__constructor">
        <div :class="['pizza', pizzaClassName]">
          <div class="pizza__wrapper">
            <transition-group name="ingredient">
              <div
                v-for="ingredient in selectedIngredients"
                :key="ingredient.id"
              >
                <div
                  class="pizza__filling"
                  :class="`pizza__filling--${ingredient.value}`"
                />
                <transition name="ingredient-second">
                  <div
                    v-if="ingredient.quantity >= 2"
                    class="pizza__filling pizza__filling--second"
                    :class="`pizza__filling--${ingredient.value}`"
                  />
                </transition>
                <transition name="ingredient-third">
                  <div
                    v-if="ingredient.quantity === 3"
                    class="pizza__filling pizza__filling--third"
                    :class="`pizza__filling--${ingredient.value}`"
                  />
                </transition>
              </div>
            </transition-group>
          </div>
        </div>
      </div>
    </AppDrop>

    <BuilderPriceCounter />
  </div>
</template>

<script>
import { MAX_INGREDIENT_VALUE } from "@/common/constants";
import { mapState, mapGetters, mapActions } from "vuex";
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },

  computed: {
    ...mapState("Builder", ["pizzaName"]),

    ...mapGetters("Builder", [
      "isPizzaDataLoading",
      "selectedDough",
      "selectedSauce",
      "selectedIngredients",
    ]),

    pizzaClassName() {
      if (this.isPizzaDataLoading) {
        return "";
      }

      const dough = this.selectedDough.value === "large" ? "big" : "small";
      const sauce = this.selectedSauce.value;

      return `pizza--foundation--${dough}-${sauce}`;
    },
  },

  methods: {
    ...mapActions("Builder", ["setPizzaName", "changeIngredientQuantity"]),

    addIngredient(ingredient) {
      if (ingredient.quantity !== MAX_INGREDIENT_VALUE) {
        this.changeIngredientQuantity({
          ...ingredient,
          quantity: ingredient.quantity + 1,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.ingredient-enter-active,
.ingredient-second-enter-active,
.ingredient-third-enter-active,
.ingredient-leave-active,
.ingredient-second-leave-active,
.ingredient-third-leave-active {
  transition: all 0.5s;
}

.ingredient-enter,
.ingredient-second-enter,
.ingredient-third-enter,
.ingredient-leave-to,
.ingredient-second-leave-to,
.ingredient-third-leave-to {
  opacity: 0;
}

.ingredient-second-enter {
  transform: rotate(15deg);
}

.ingredient-third-enter {
  transform: rotate(-15deg);
}
</style>
