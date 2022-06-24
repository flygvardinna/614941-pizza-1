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
              v-for="ingredient in selectedIngredients"
              :key="ingredient.name"
            >
              <div
                class="pizza__filling"
                :class="[`pizza__filling--${ingredient.englishName}`]"
              ></div>
              <div
                v-if="ingredient.quantity >= 2"
                class="pizza__filling pizza__filling--second"
                :class="[`pizza__filling--${ingredient.englishName}`]"
              ></div>
              <div
                v-if="ingredient.quantity === 3"
                class="pizza__filling pizza__filling--third"
                :class="[`pizza__filling--${ingredient.englishName}`]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </AppDrop>

    <BuilderPriceCounter />
  </div>
</template>

<script>
import { MAX_INGREDIENT_VALUE } from "@/common/constants";
import { mapState, mapActions } from "vuex";
import AppDrop from "@/common/components/AppDrop";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";
import { findSelectedItem } from "@/common/helpers";

export default {
  name: "BuilderPizzaView",
  components: { AppDrop, BuilderPriceCounter },
  /*data() {
    return {
      //pizzaClassName: "",
      currentPizza: {},
    };
  },*/
  computed: {
    ...mapState("Builder", ["pizzaName", "dough", "sauces", "ingredients"]),
    //...mapGetters("Builder", ["currentPizza"]),
    // проблема в том, что это вычисляется до того как сфетчатся части пиццы
    // если в App менять created() на любой другой хук - после сохранения пицца появляется
    // компонент отрисовывается
    // но после обновления страницы снова проблема
    // возможно currentPizza не должно быть computed а должно быть методом и должно вызываться после загрузки данных
    // в vueWork тоже computed в DeskColumn
    // разберись как работает там
    // пока не могу понять, почему там это работает нормально
    /*pizzaClassName() {
      // если использовать computed то пицца не отрисовывается при рендеринге
      // только с методом норм
      // если добавить && this.currentPizza.dough к условию - не помогает
      // добавление "dough", "sauces" в mapState - тоже нет
      // TODO пока пришлось переделать в метод из computed
      // позже спроси наставника
      // но так оставить нельзя, тк в консоли все равно ошибки

      const dough = this.currentPizza.dough.value === "large" ? "big" : "small";
      return `pizza--foundation--${dough}-${this.currentPizza.sauce.value}`;
    },*/
    selectedIngredients() {
      return this.ingredients.filter((item) => item.quantity > 0);
    },
  },
  /*mounted() {
    //this.pizzaClassName = this.getPizzaClassName();
    this.currentPizza = this.getCurrentPizza();
    // не решает мою проблему все равно
  },*/
  // РАЗБЕРИСЬ НАДО ЛИ ПОДКЛЮЧАТЬ СТИЛИ В КОМПОНЕНТЫ - в идеале наверное да
  methods: {
    ...mapActions("Builder", [
      "getCurrentPizza",
      "setPizzaName",
      "changeIngredientQuantity",
    ]),
    getPizzaClassName() {
      // в currentPizza теперь лежит id! поэтому не найдет dough.value
      // пусть пока так
      const dough =
        findSelectedItem(this.dough).value === "large" ? "big" : "small";
      const sauce = findSelectedItem(this.sauces).value;
      return `pizza--foundation--${dough}-${sauce}`;
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
