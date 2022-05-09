<template>
  <div class="cart__form">
    <div class="cart-form">
      <label class="cart-form__select">
        <span class="cart-form__label">Получение заказа:</span>

        <select
          name="test"
          class="select"
          @change="onAddressSelectChanged($event)"
        >
          <option value="1">Заберу сам</option>
          <option value="2">Новый адрес</option>
          <option v-if="user" value="3">Дом</option>
        </select>
      </label>

      <label class="input input--big-label">
        <span>Контактный телефон:</span>
        <input type="text" name="tel" placeholder="+7 999-999-99-99" />
      </label>

      <div v-if="isAddressFormDisplayed" class="cart-form__address">
        <span class="cart-form__label">Новый адрес:</span>

        <div class="cart-form__input">
          <label class="input">
            <span>Улица*</span>
            <input
              type="text"
              name="street"
              :value="street"
              :readonly="isAddressReadonly"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Дом*</span>
            <input
              type="text"
              name="house"
              :value="house"
              :readonly="isAddressReadonly"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Квартира</span>
            <input
              type="text"
              name="apartment"
              :value="apartment"
              :readonly="isAddressReadonly"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CartOrderForm",
  data: () => ({
    isAddressFormDisplayed: false,
    isAddressReadonly: false,
    street: "",
    house: "",
    apartment: "",
  }),
  computed: {
    ...mapState("Auth", ["user"]),
    /*isAddressFormDisplayed() {
      return ;
    },*/
  },
  methods: {
    onAddressSelectChanged(event) {
      switch (event.target.value) {
        case "1":
          this.isAddressFormDisplayed = false;
          // ЗАМЕЧАНИЕ вот эти флаги лучше сделать компьютедами,
          // завязанными на значение текущего выбранного варианта доставки
          // пока не поняла, как должно вычисляться значение. Хранить вариант доставки в state?
          // сделаю позже, когда буду делать адреса - может станет понятно
          break;
        case "2":
          this.isAddressFormDisplayed = true;
          this.isAddressReadonly = false;
          this.street = "";
          this.house = "";
          this.apartment = "";
          break;
        default:
          this.isAddressFormDisplayed = true;
          this.isAddressReadonly = true;
          this.street = "Пушкина";
          this.house = "5";
          this.apartment = "42";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
