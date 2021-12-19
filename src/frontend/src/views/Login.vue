<template>
  <div class="sign-form">
    <a class="close close--white" @click="closeDialog">
      <span class="visually-hidden">Закрыть форму авторизации</span>
    </a>
    <div class="sign-form__title">
      <h1 class="title title--small">Авторизуйтесь на сайте</h1>
    </div>
    <form action="test.html" method="post">
      <div class="sign-form__input">
        <label class="input">
          <span>E-mail</span>
          <input type="email" name="email" placeholder="example@mail.ru" />
        </label>
      </div>

      <div class="sign-form__input">
        <label class="input">
          <span>Пароль</span>
          <input type="password" name="pass" placeholder="***********" />
        </label>
      </div>
      <button type="submit" class="button">Авторизоваться</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  methods: {
    closeDialog() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/scss/mixins/mixins.scss";
@import "~@/assets/scss/layout/sign-form.scss";
</style>
