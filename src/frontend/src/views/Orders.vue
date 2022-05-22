<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">История заказов</h1>
    </div>

    <section v-for="order in orders" :key="order.id" class="sheet order">
      <div class="order__wrapper">
        <div class="order__number">
          <b>Заказ #{{ order.id }}</b>
        </div>

        <div class="order__sum">
          <span>Сумма заказа: {{ calculateOrderPrice(order) }} ₽</span>
        </div>

        <div class="order__button">
          <button
            type="button"
            class="button button--border"
            @click="deleteOrder(order.id)"
          >
            Удалить
          </button>
        </div>
        <div class="order__button">
          <button type="button" class="button" @click="addOrderToCart(order)">
            Повторить
          </button>
        </div>
      </div>

      <ul class="order__list">
        <li
          v-for="pizza in order.orderPizzas"
          :key="pizza.id"
          class="order__item"
        >
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

          <p class="order__price">
            {{ pizza.quantity }}х{{ getPizzaPrice(pizza) }} ₽
          </p>
        </li>
      </ul>

      <ul class="order__additional">
        <li v-for="misc in order.orderMisc" :key="misc.id">
          <img
            :src="getMiscItemById(misc.miscId).image"
            width="20"
            height="30"
            :alt="getMiscItemById(misc.miscId).name"
          />
          <p>
            <span>{{ getMiscItemById(misc.miscId).name }}</span>
            <b
              >{{ misc.quantity }}х{{ getMiscItemById(misc.miscId).price }} ₽</b
            >
          </p>
        </li>
      </ul>

      <p class="order__address">
        Адрес доставки: Тест (или если адрес новый - писать целиком)
      </p>
    </section>
  </div>
</template>

<script>
// v-for="item in order.orderMisc"
import { mapActions, mapState } from "vuex";
// нормально ли тут вставлять Sidebar или надо чтоб был помимо AppLayoutDefault компонент с сайдбаром?
// там можно в роутах подписать, чтоб для двуъ этих страниц грузился лэйаут с сайдбаром
// this.$route.meta.layout
// но там надо подумать, как туда будет передаваться инфа про доступные ссылки

export default {
  name: "Orders",
  computed: {
    ...mapState("Builder", ["dough", "sauces", "sizes", "ingredients"]),
    ...mapState("Cart", ["additionalItems"]),
    ...mapState("Orders", ["orders"]),
  },
  async mounted() {
    // тут подумай как лучше сделать
    // но вроде надо так, потому что после оформления заказа очищается state
    // либо эти items не хранить в корзине вообще
    // но вообще кажется что они должны быть в корзине все-таки
    if (this.additionalItems.length === 0) {
      await this.fetchAdditionalItems();
    }
    await this.fetchOrders();
    console.log("orders page", this.orders);
  },
  methods: {
    ...mapActions("Cart", ["fetchAdditionalItems"]),
    ...mapActions("Orders", ["fetchOrders", "deleteOrder"]),
    // дублируется с списком в корзине (подумай, как все это оптимизировать)
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
    // также был вариант в чате от настнавника
    // Попробуйте создать объект мапу, где id будет ключ, а значение будет название
    // И вот так обращаться там где надо использовать название IngrainedMap[ingradientId]
    getPizzaPrice({ doughId, sizeId, sauceId, ingredients }) {
      // сейчас по 2 раза массивы перебираю, отдельно чтоб вытащить имя и цену
      // или все-таки нормализировать и добавлять это все к свойствам пиццы
      // или будет 2 раза?
      // и бесяче, что как будто дублируем расчет из блока builder но объединить в одмн метод нельзя
      // либо там тоже сохранять только id и этим универсальным методом потом считать
      // хотя это неудобно
      const doughPrice = this.getPizzaPartById(this.dough, doughId).price;
      const saucePrice = this.getPizzaPartById(this.sauces, sauceId).price;
      const ingredientsPrices = ingredients.map(
        (ingredient) =>
          this.getPizzaPartById(this.ingredients, ingredient.ingredientId)
            .price * ingredient.quantity
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      const multiplier = this.getPizzaPartById(this.sizes, sizeId).multiplier;

      return (doughPrice + saucePrice + ingredientsSum) * multiplier;
    },
    calculateOrderPrice(order) {
      const pizzasSum = order.orderPizzas
        .map((pizza) => {
          return this.getPizzaPrice(pizza) * pizza.quantity;
        })
        .reduce((a, b) => a + b, 0);

      const miscSum = order.orderMisc
        .map((misc) => {
          return this.getMiscItemById(misc.miscId).price * misc.quantity;
        })
        .reduce((a, b) => a + b, 0);

      return pizzasSum + miscSum;
    },
    // или это в хелперы вынести?
    getPizzaPartById(list, id) {
      return list.find((item) => item.id === id);
    },
    getMiscItemById(miscId) {
      return this.additionalItems.find((item) => item.id === miscId);
    },
    addOrderToCart(order) {
      // при нажатии на кнопку «Повторить» — все данные заказа добавляются в корзину, происходит переход на страницу корзины
      // непонятно, если корзина была непустая, очищать ее или добавлять к текущим товарам товары заказа
      // логичнее так, но спроси наставника
      console.log("going to cart", order);
      // проблема, после удаления заказа, если обновить страницу - разлогинивает
      // WTF - разберись
    },
  },
};
</script>
