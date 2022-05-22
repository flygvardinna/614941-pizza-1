<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <div class="user">
      <picture>
        <source
          type="image/webp"
          srcset="
            @/assets/img/users/user5@2x.webp 1x,
            @/assets/img/users/user5@4x.webp 2x
          "
        />
        <img :src="user.avatar" :alt="user.name" width="72" height="72" />
      </picture>
      <div class="user__name">
        <span>{{ user.name }}</span>
      </div>
      <p class="user__phone">
        Контактный телефон: <span>{{ user.phone }}</span>
      </p>
    </div>

    <div v-for="address in addresses" :key="address.id" class="layout__address">
      <AddressesForm
        v-if="address.id === editableAddressId"
        :address="address"
      />

      <div v-else class="sheet address-form">
        <div class="address-form__header">
          <b>Адрес №{{ address.id }}. {{ address.name }}</b>
          <div class="address-form__edit">
            <button
              type="button"
              class="icon"
              @click="openFormToEdit(address.id)"
            >
              <span class="visually-hidden">Изменить адрес</span>
            </button>
          </div>
        </div>
        <p>{{ address.street }}, {{ address.building }}, {{ address.flat }}</p>
        <small>{{ address.comment }}</small>
      </div>
    </div>

    <div v-if="isNewAddressFormDisplayed" class="layout__address">
      <AddressesForm :address="newAddressData" :nextId="nextAddressId" />
    </div>

    <div class="layout__button">
      <button
        type="button"
        class="button button--border"
        @click="openNewAddressForm"
      >
        Добавить новый адрес
      </button>
    </div>
  </div>
</template>

<script>
import AddressesForm from "@/modules/addresses/components/AddressesForm";
import { mapActions, mapState } from "vuex";

// layout__content и прочее вынести в layout, чтобы там подключить стили
// src/assets/scss/layout/layout.scss а название для страницы можно в роутере передавать
// это доделай на этапе подключения стилей по компонентам

// позже разберись с <picture> и <source> вроде эти теги не нужны, достаточно только image но картинка с данных слишком мелкая
// некрасивая, и поэтому лучше выводить захарженную, чтоб было красиво

// все отлично, но проблема такая, что если начали изменять форму, а потом открыли другую, не сохранив эту
// то сохраненные данные в полях сохраняются
// после обновления страницы все становится как было, но все равно не хорошо
// ЭТО В ПОСЛЕДНЮЮ ОЧЕРЕДЬ, мб это норм вообще
export default {
  name: "Profile",
  components: {
    AddressesForm,
  },
  data: () => ({
    // возможно, это надо сделать через computed, как и в корзине
    isNewAddressFormDisplayed: false,
    editableAddressId: null,
    // это убрать
  }),
  // вместо вот этого {{ address.street }}, {{ address.building }}, {{ address.flat }}
  // сделай computed
  // учти кейсы, когда нет например квартиры (не все ж поля обязательные)
  computed: {
    ...mapState("Auth", ["user"]),
    ...mapState("Addresses", ["addresses"]),
    newAddressData() {
      return {
        id: null,
        name: "",
        street: "",
        building: "",
        flat: "",
        comment: "",
        userId: this.user.id,
      };
    },
    nextAddressId() {
      // если удалить последний и добавить новый, то выведется такой же номер, как у удаленного
      // но после обновления страницы номер будет = номер удаленного + id
      // несоответсвие но это мелкий косяк и наверное норм
      // но если много адресов подряд удалить то расхождение большое
      // выводи просто Новый адрес?
      return this.addresses.length > 0 ? [this.addresses.length - 1].id + 1 : 1;
    },
  },
  mounted() {
    this.fetchAddresses();
    console.log("addresses", this.addresses);
    console.log("empty address", this.newAddressData);
  },
  methods: {
    ...mapActions("Addresses", ["fetchAddresses"]),
    openFormToEdit(id) {
      this.isNewAddressFormDisplayed = false;
      this.editableAddressId = id;
    },
    openNewAddressForm() {
      this.editableAddressId = null;
      this.isNewAddressFormDisplayed = true;
    },
  },
};
</script>
