<template>
  <div>
    <form action="#" method="post" class="layout-form">
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

            <CartOrderForm />
          </div>
        </div>
      </main>

      <CartFooter
        v-if="!isCartEmpty"
        @moreBtnClicked="goToBuilderPage"
        @submitBtnClicked="showDialog($event)"
      />
    </form>
    <div class="popup" v-if="isOrderPopupDisplayed">
      <a class="close" @click="finishOrder">
        <span class="visually-hidden">Закрыть попап</span>
      </a>
      <div class="popup__title">
        <h2 class="title">Спасибо за заказ</h2>
      </div>
      <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
      <div class="popup__button">
        <a class="button" @click="finishOrder">Отлично, я жду!</a>
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
  }),
  computed: {
    ...mapState("Cart", ["pizzaItems", "additionalItems"]),
    ...mapState("Auth", ["user"]),
    isCartEmpty() {
      return this.pizzaItems.length === 0;
    },
  },
  mounted() {
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
    goToBuilderPage() {
      this.$router.push({ name: "IndexHome" });
    },
    showDialog(event) {
      event.preventDefault();
      this.isOrderPopupDisplayed = true;
    },
    finishOrder() {
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
    },
  },
};
</script>
