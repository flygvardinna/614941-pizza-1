<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">История заказов</h1>
    </div>

    <section v-for="order in orders" :key="order.id" class="sheet order">
      <OrdersItem :order="order" />
    </section>
  </div>
</template>

<script>
// v-for="item in order.orderMisc"
import { mapActions, mapState } from "vuex";
import OrdersItem from "@/modules/orders/components/OrdersItem";
// нормально ли тут вставлять Sidebar или надо чтоб был помимо AppLayoutDefault компонент с сайдбаром?
// там можно в роутах подписать, чтоб для двуъ этих страниц грузился лэйаут с сайдбаром
// this.$route.meta.layout
// но там надо подумать, как туда будет передаваться инфа про доступные ссылки

export default {
  name: "Orders",
  components: {
    OrdersItem,
  },
  computed: {
    ...mapState("Cart", ["additionalItems"]),
    ...mapState("Orders", ["orders"]),
  },
  async mounted() {
    // постоянно разлогинивает на истории заказов - разберись!
    // уже разобралась? я там очищала локал сторидж вместе с токеном

    // тут подумай как лучше сделать
    // но вроде надо так, потому что после оформления заказа очищается state
    // либо эти items не хранить в корзине вообще
    // но вообще кажется что они должны быть в корзине все-таки

    await this.fetchPizzaParts();
    // это на случай если после авторизации сразу зашли в историю заказов
    // иначе не будет там данных о компонентах для getPizzaPartById

    if (this.additionalItems.length === 0) {
      await this.fetchAdditionalItems();
    }

    // разбить страницу Orders на модули!

    await this.fetchOrders();
    console.log("orders page", this.orders);
  },
  methods: {
    ...mapActions("Builder", ["fetchPizzaParts"]),
    ...mapActions("Cart", ["fetchAdditionalItems"]),
    ...mapActions("Orders", ["fetchOrders"]),
  },
};
</script>
