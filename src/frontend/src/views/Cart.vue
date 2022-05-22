<template>
  <div>
    <form class="layout-form" @submit="makeNewOrder($event)">
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

            <CartOrderForm @setAddress="setAddress($event)" />
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
    address: {},
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
    //localStorage.clear();
    if (this.additionalItems.length === 0) {
      this.fetchAdditionalItems();
    }
  },
  updated() {
    if (this.pizzaItems.length === 0) {
      this.fetchAdditionalItems();
    }
  },
  methods: {
    ...mapActions("Builder", ["resetBuilderState", "fetchPizzaParts"]),
    ...mapActions("Cart", [
      "resetCartState",
      "fetchAdditionalItems",
      "setCartItems",
    ]),
    ...mapActions("Orders", ["createOrder"]),
    async makeNewOrder() {
      //console.log(event);
      //event.preventDefault();
      await this.createOrder({
        phone: this.phone,
        address: this.address,
      });

      this.isOrderPopupDisplayed = true;
    },
    closePopup() {
      this.isOrderPopupDisplayed = false;
      if (this.user) {
        this.$router.push({ name: "Orders" });
      } else {
        this.$router.push({ name: "IndexHome" });
      }
      this.resetBuilderState();
      this.resetCartState();
      this.fetchPizzaParts();
      localStorage.clear();
      // здесь заменить на localStorage.removeItem как в jwt-сервисе,
      // а иначе будет вместе с товарами удалять токен авторизации
      // или это вообще исчезнет после подключения api
    },
    setAddress(event) {
      const { phone, address } = event;
      this.phone = phone;
      this.address = address;
    },
  },
};
</script>
