<template>
  <div class="popup">
    <a class="close" data-test="close-button" @click="$emit('close')">
      <span class="visually-hidden">Закрыть попап</span>
    </a>
    <div class="popup__title">
      <h2 class="title">Спасибо за заказ</h2>
    </div>
    <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
    <div class="popup__button">
      <a class="button" data-test="popup-button" @click="$emit('close')"
        >Отлично, я жду!</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "CartOrderPopup",
};
</script>
