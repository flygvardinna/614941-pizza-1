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
        <li>{{ getSizeAndDoughDescription(pizza) }}</li>
        <li>Соус: {{ getSauceName(pizza.sauceId) }}</li>
        <li>Начинка: {{ getIngredientsList(pizza.ingredients) }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  },
  mounted() {
    console.log("this pizza", this.pizza);
    // пиццы приходят, все ок
  },
  methods: {
    getSizeAndDoughDescription({ sizeId, doughId }) {
      const size = this.getPizzaPartById(this.sizes, sizeId).name;
      const dough = this.getPizzaPartById(this.dough, doughId).name;
      const doughName = dough === "Толстое" ? "толстом" : "тонком";

      return `${size}, на ${doughName} тесте`;
    },
    getSauceName(sauceId) {
      return this.getPizzaPartById(this.sauces, sauceId).name.toLowerCase();
    },
    // ингредиенты тоже меняются местами при каждой новой загрузке?
    // разные id и порядок в массиве. Нужно ли что-то с этим сделать?
    getIngredientsList(ingredients) {
      const names = ingredients.map((ingredient) => {
        return this.getPizzaPartById(this.ingredients, ingredient.ingredientId)
          .name;
      });
      return names.map((name) => name.toLowerCase()).join(", ");
    },
    getPizzaPartById(list, id) {
      return list.find((item) => item.id === id);
    },
    // также был вариант в чате от настнавника
    // Попробуйте создать объект мапу, где id будет ключ, а значение будет название
    // И вот так обращаться там где надо использовать название IngrainedMap[ingradientId]
  },
  // или это в хелперы вынести?
  // использую в builder store то же самое из хелперс - так что лучше и тут брать оттуда?
  // этот компонент нужно заюзать в корзине и в истории заказов
  // так как дублируется разметка и одинаковая логика (методы получения описания пиццы)

  // в корзине у меня хранятся size, sauce итд целиком, а не id
  // а в истории заказов уже только id
  // все-таки надо добавлять id (в CurrentPizza тогда тоже хранить id)
  // но это ломает логику там, где еще CurrentPizza используется
  // подумай короче
};
</script>

<style lang="scss" scoped></style>
