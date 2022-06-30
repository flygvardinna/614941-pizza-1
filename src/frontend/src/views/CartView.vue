<template>
  <div>
    <form class="layout-form" @submit.prevent="makeNewOrder">
      <main class="content cart">
        <div class="container">
          <div class="cart__title">
            <h1 class="title title--big">Корзина</h1>
          </div>

          <div v-if="isCartEmpty" key="cart-empty" class="sheet cart__empty">
            <p>В корзине нет ни одного товара</p>
          </div>

          <div v-else key="cart-items">
            <CartProductList />

            <CartAdditionalList />

            <CartOrderForm
              :reorder-address-id="addressId"
              :validations="validations"
              @setAddress="setAddress"
            />
          </div>
        </div>
      </main>

      <CartFooter v-if="!isCartEmpty" />
    </form>

    <CartOrderPopup v-if="isOrderPopupDisplayed" @close="closePopup" />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import CartProductList from "@/modules/cart/components/CartProductList";
import CartAdditionalList from "@/modules/cart/components/CartAdditionalList";
import CartOrderForm from "@/modules/cart/components/CartOrderForm";
import CartOrderPopup from "@/modules/cart/components/CartOrderPopup";
import CartFooter from "@/modules/cart/components/CartFooter";
import { validator } from "@/common/mixins";

export default {
  name: "Cart",
  components: {
    CartProductList,
    CartAdditionalList,
    CartOrderForm,
    CartOrderPopup,
    CartFooter,
  },

  mixins: [validator],

  data() {
    return {
      isOrderPopupDisplayed: false,
      address: null,
      addressId: null,
      phone: "",
      validations: {
        street: {
          error: "",
          rules: ["required"],
        },
        building: {
          error: "",
          rules: ["required"],
        },
      },
    };
  },

  computed: {
    ...mapState("Cart", ["pizzaItems", "additionalItems"]),
    ...mapState("Auth", ["user"]),

    isCartEmpty() {
      return this.pizzaItems.length === 0;
    },
  },

  watch: {
    isCartEmpty(val) {
      if (val) {
        this.resetCartState();
        this.fetchAdditionalItems();
      }
    },
  },

  async mounted() {
    this.addressId = this.$route.params.addressId;
  },

  methods: {
    ...mapActions("Builder", ["resetBuilderState", "fetchPizzaParts"]),
    ...mapActions("Cart", ["resetCartState", "fetchAdditionalItems"]),
    ...mapActions("Orders", ["createOrder"]),

    async makeNewOrder() {
      if (
        this.address !== null &&
        this.address.id === null &&
        !this.$validateFields(
          { street: this.address.street, building: this.address.building },
          this.validations
        )
      ) {
        return;
      }

      const order = {
        userId: this.user ? this.user.id : null,
        phone: this.phone,
        address: this.address,
        pizzas: this.normalizePizzas(),
        misc: this.normalizeMisc(),
      };

      await this.createOrder(order);
      this.isOrderPopupDisplayed = true;
    },

    normalizePizzas() {
      return this.pizzaItems.map((pizza) => {
        return {
          name: pizza.name,
          quantity: pizza.quantity,
          doughId: pizza.doughId,
          sauceId: pizza.sauceId,
          sizeId: pizza.sizeId,
          ingredients: pizza.ingredients.map((ingredient) => {
            return {
              ingredientId: ingredient.ingredientId,
              quantity: ingredient.quantity,
            };
          }),
        };
      });
    },

    normalizeMisc() {
      return this.additionalItems.map((item) => {
        return {
          miscId: item.id,
          quantity: item.quantity,
        };
      });
    },

    async closePopup() {
      this.isOrderPopupDisplayed = false;
      this.resetBuilderState();
      this.resetCartState();

      await this.fetchPizzaParts();
      await this.$router.push({ name: this.user ? "Orders" : "IndexHome" });
    },

    setAddress({ phone, address }) {
      this.phone = phone;
      this.address = address;
    },
  },
};
</script>
