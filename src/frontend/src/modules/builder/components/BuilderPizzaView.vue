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
        <div :class="['pizza', getPizzaClassName()]">
          <div class="pizza__wrapper">
            <div
              v-for="ingredient in currentPizza.ingredients"
              :key="ingredient.name"
              class="pizza__filling"
              :class="[
                `pizza__filling--${ingredient.englishName}`,
                getIngredientClassName(ingredient.quantity),
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
import { mapState, mapActions, mapGetters } from "vuex";
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },
  computed: {
    ...mapState("Builder", ["pizzaName"]),
    ...mapGetters("Builder", ["currentPizza"]),
    // проблема в том, что это вычисляется до того как сфетчатся части пиццы
    // если в App менять created() на любой другой хук - после сохранения пицца появляется
    // компонент отрисовывается
    // но после обновления страницы снова проблема
    // возможно currentPizza не должно быть computed а должно быть методом и должно вызываться после загрузки данных
    // в vueWork тоже computed в DeskColumn
    // разберись как работает там
    // пока не могу понять, почему там это работает нормально
    pizzaClassName() {
      // если добавить && this.currentPizza.dough к условию - не помогает
      // добавление "dough", "sauces" в mapState - тоже нет
      // TODO пока пришлось переделать в метод из computed
      // позже спроси наставника
      // но так оставить нельзя, тк в консоли все равно ошибки
      const dough = this.currentPizza.dough.value === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.currentPizza.sauce.value}`;
    },
  },
  methods: {
    ...mapActions("Builder", ["setPizzaName", "changeIngredientQuantity"]),
    getIngredientClassName(quantity) {
      if (quantity < 2) {
        return;
      }
      return quantity === MAX_INGREDIENT_VALUE
        ? `pizza__filling--third`
        : `pizza__filling--second`;
    },
    getPizzaClassName() {
      const dough = this.currentPizza.dough.value === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.currentPizza.sauce.value}`;
    },
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

<style lang="scss" scoped></style>
