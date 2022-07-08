<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">
        История заказов
      </h1>
    </div>

    <div
      v-if="isOrdersListEmpty"
      key="orders-empty"
      class="sheet order__empty"
      data-test="orders-empty"
    >
      <p>У вас пока нет заказов</p>
    </div>

    <div
      v-else
      key="orders-list"
      data-test="orders-list"
    >
      <section
        v-for="order in orders"
        :key="order.id"
        class="sheet order"
      >
        <OrdersItem
          :order="order"
          data-test="order-item"
        />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import OrdersItem from "@/modules/orders/components/OrdersItem";

export default {
  name: "OrdersView",
  components: {
    OrdersItem,
  },

  computed: {
    ...mapState("Cart", ["additionalItems"]),
    ...mapState("Orders", ["orders"]),

    isOrdersListEmpty() {
      return this.orders.length === 0;
    },
  },

  async mounted() {
    if (this.additionalItems.length === 0) {
      await this.fetchAdditionalItems();
    }

    await this.fetchOrders();
  },

  methods: {
    ...mapActions("Cart", ["fetchAdditionalItems"]),
    ...mapActions("Orders", ["fetchOrders"]),
  },
};
</script>
