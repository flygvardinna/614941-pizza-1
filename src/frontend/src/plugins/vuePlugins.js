import Vue from "vue";
import JWTService from "@/services/jwt.service";
import Notifier from "@/plugins/notifier";
import store from "@/store";
import { createResources } from "@/common/helpers";

const plugins = {
  install(Vue) {
    Vue.mixin({
      computed: {
        $jwt: () => JWTService,
        $notifier: () => new Notifier(store),
        $api() {
          return createResources(this.$notifier);
        },
      },
    });
  },
};

Vue.use(plugins);

// про это спрашивали в чате
// а как предлагается показывать ошибки сервера, например при логине?
// подключать notifier из учебного проекта или на свое усмотрение?
// ДА МОЖНО ВЗЯТЬ ИЗ УЧЕБНОГО ПРОЕКТА
// за основу можешь взять пример из учебного проекта, но можно и свое решение реализовать
// НО ПОХОДУ ЕГО НАДО МОДИФИЦИРОВАТЬ МНЕ ПРЯМ В ТАКОМ ВИДЕ НЕ НУЖЕН
// оставить только error? мне кроме вывода ошибок вроде ничего не надо
// про этот плагин в 4 модуле
// тогда нужен еще компонент нотификаций чтоб их выводить
// https://up.htmlacademy.ru/vue/1/module/4/item/17
// https://github.com/htmlacademy-vue/VueWork/compare/v3...v4
