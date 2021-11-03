<template>
  <div class="content__result">
    <p>Итого: {{ price }} ₽</p>
    <button type="button" class="button button--disabled" disabled>
      Готовьте!
    </button>
  </div>
</template>

<script>
export default {
  name: "BuilderPriceCounter",
  props: {
    price: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
