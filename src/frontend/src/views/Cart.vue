<template>
  <div>
    <form class="layout-form" @submit.prevent="makeNewOrder($event)">
      <main class="content cart">
        <div class="container">
          <div class="cart__title">
            <h1 class="title title--big">Корзина</h1>
          </div>

          <div v-if="isCartEmpty" class="sheet cart__empty">
            <p>В корзине нет ни одного товара</p>
          </div>

          <div v-else>
            <CartProductList />

            <CartAdditionalList />

            <CartOrderForm
              :addressId="addressId"
              @setAddress="setAddress($event)"
            />
          </div>
        </div>
      </main>

      <CartFooter v-if="!isCartEmpty" />
    </form>
    <div class="popup" v-if="isOrderPopupDisplayed">
      <a class="close" @click="closePopup">
        <span class="visually-hidden">Закрыть попап</span>
      </a>
      <div class="popup__title">
        <h2 class="title">Спасибо за заказ</h2>
      </div>
      <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
      <div class="popup__button">
        <a class="button" @click="closePopup">Отлично, я жду!</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CartProductList from "@/modules/cart/components/CartProductList";
import CartAdditionalList from "@/modules/cart/components/CartAdditionalList";
import CartOrderForm from "@/modules/cart/components/CartOrderForm";
import CartFooter from "@/modules/cart/components/CartFooter";
import { formatMisc, formatPizzas } from "@/common/helpers";
/*import { cleanPizzas, cleanMisc } from "@/common/helpers";*/

export default {
  name: "Cart",
  components: {
    CartProductList,
    CartAdditionalList,
    CartOrderForm,
    CartFooter,
  },
  data: () => ({
    isOrderPopupDisplayed: false,
    address: null,
    addressId: null,
    phone: "",
  }),
  computed: {
    ...mapState("Cart", ["pizzaItems", "additionalItems"]),
    ...mapState("Auth", ["user"]),
    isCartEmpty() {
      return this.pizzaItems.length === 0;
    },
  },
  mounted() {
    // при перезагрузке страницы корзины где-то происходит reset и все обнуляется - убрать!
    if (this.additionalItems.length === 0) {
      this.fetchAdditionalItems();
    }
    this.addressId = this.$route.params.addressId;
    console.log("cart pizza items", this.pizzaItems);
    console.log("cart additional items", this.additionalItems);
  },
  // проверь, точно ли нужно updated. Зачем?
  updated() {
    if (this.pizzaItems.length === 0) {
      this.fetchAdditionalItems();
      // тут уже забыла, почему если пицц нет мы заново фетчим additional?
    }
    // выглядит избыточно, что 2 раза это - подумай
  },
  methods: {
    ...mapActions("Builder", ["resetBuilderState", "fetchPizzaParts"]),
    ...mapActions("Cart", ["resetCartState", "fetchAdditionalItems"]),
    ...mapActions("Orders", ["createOrder"]),
    async makeNewOrder() {
      //console.log(event);
      //event.preventDefault();
      const order = {
        userId: this.user ? this.user.id : null,
        phone: this.phone,
        // но в форме можно ввести другой телефон
        // разберись с этим - что-то писали в чате про телефон
        address: this.address,
        pizzas: formatPizzas(this.pizzaItems),
        // но теперь тут надо убрать лишнее - это id пиццы перед отправкой на сервер
        // pizzas: this.pizzaItems,
        // misc тоже переделать? чтобы было единообразно с пиццами? и сразу добавлялись id
        misc: formatMisc(this.additionalItems),
      };

      console.log("order that im going to send", order);

      await this.createOrder(order);
      this.isOrderPopupDisplayed = true;
      // то, что новый адрес появляется в личном кабинете - это отлично, так и должно быть
      // следи, чтоб так и осталось
    },
    closePopup() {
      this.isOrderPopupDisplayed = false;
      this.resetBuilderState();
      this.resetCartState();

      if (this.user) {
        this.$router.push({ name: "Orders" });
      } else {
        this.fetchPizzaParts();
        // это нужно для того, чтоб если перейдем на главную там все было
        // в Orders тоже вызывается этот метод - на случай если после авторизации сразу зашли в историю заказов
        this.$router.push({ name: "IndexHome" });
      }
    },
    setAddress(event) {
      const { phone, address } = event;
      this.phone = phone;
      this.address = address;
    },
  },
};
</script>
