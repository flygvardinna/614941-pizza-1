import JwtService from "@/services/jwt.service";
/*import taskStatuses from '@/common/enums/taskStatuses';
import timeStatuses from '@/common/enums/timeStatuses';
import { DAY_IN_MILLISEC } from '@/common/constants';*/
import axios from "@/plugins/axios";
import { Dough, Sauce, Size, Ingredient } from "@/common/constants";

class BaseApiService {
  constructor(notifier) {
    if (!axios.$notifier) {
      axios.$notifier = notifier;
    }
  }
}

// сделай авторизацию - сперва хватит метода whoAmI?
// мне пока надо только чтоб работали страницы профиля и истории заказов
export class AuthApiService extends BaseApiService {
  constructor(notifier) {
    super(notifier);
  }
  setAuthHeader() {
    const token = JwtService.getToken();
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }

  async login(params) {
    const { data } = await axios.post("login", params);
    return data;
  }

  async logout() {
    const { data } = await axios.delete("logout");
    return data;
  }

  async getMe() {
    const { data } = await axios.get("whoAmI");
    return data;
  }
}

export class ReadOnlyApiService extends BaseApiService {
  #resource;
  constructor(resource, notifier) {
    super(notifier);
    this.#resource = resource;
  }

  async query() {
    const { data } = await axios.get(this.#resource);
    return data;
  }

  async get(id) {
    const { data } = await axios.get(`${this.#resource}/${id}`);
    return data;
  }
}

export class CrudApiService extends ReadOnlyApiService {
  #resource;
  constructor(resource, notifier) {
    super(resource, notifier);
    this.#resource = resource;
  }

  async post(entity) {
    const { data } = await axios.post(this.#resource, entity);
    return data;
  }

  async put(entity) {
    const { data } = await axios.put(`${this.#resource}/${entity.id}`, entity);
    return data;
  }

  async delete(id) {
    const { data } = await axios.delete(`${this.#resource}/${id}`);
    return data;
  }
}

// тут переделать, захардкодить ресурсы
// ресурсы - это урлы, на которые шлем
// пока можно их все в список ресурсов не вносить, по мере надобности
// сделай внутри builder отдельные методы fetchDough итд c захардкоженными ресурсами (урлами) и Dough итд
export class BuilderApiService extends CrudApiService {
  _normalizeDetail(detail, item) {
    return {
      ...item,
      value: detail[item.name],
      // логично чтоб value тоже называлось englishName как в ингредиенте
      // или чтоб везде называлось value а число будет называться quantity как раз
      // englishName выглядит логичнее раз есть уже поле name
      isChecked: item.id === 1,
    };
  }

  _normalizeSize(item) {
    return {
      ...item,
      value: Size[item.name],
      isChecked: item.multiplier === 1,
    };
  }

  _normalizeIngredient(item) {
    return {
      ...item,
      englishName: Ingredient[item.name],
      quantity: 0,
    };
  }

  // тут разделила query на 2 для Detail и Ingredient
  // похоже надо отдельный fetch для каждой штуки
  // тк теперь еще и размеры сортировать
  async fetchDetail(resource, detail) {
    const { data } = await axios.get(resource);
    // console.log("data", data);
    // const data = await super.query(config);
    // не могу придумать как использовать super.query если у меня в resource должен быть разный урл каждый раз
    // но это не обязательно - использовать так же, как в учебном проекте
    return data.map((item) => this._normalizeDetail(detail, item));
  }
  // тут подумай еще, может тогда и нет смысла в общем fetchDetail?

  // тут можно переимновать константы в Sauces и Sizes и передавать одну строку
  // а потом делать capitalize и брать константу в апи
  // эти строки тоже лучше вынести в список констант - "dough" итд

  // см как в vueWork
  // просто сделать модификацию метода query? чтоб везде было одинаково с .query без .fetchSmth для всех модулей
  async fetchDough() {
    const { data } = await axios.get("dough");
    // console.log("dough", data);
    return data.map((item) => this._normalizeDetail(Dough, item));
    // тут тоже NormalizeDough?
  }

  async fetchSauces() {
    const { data } = await axios.get("sauces");
    // console.log("sauces", data);
    return data.map((item) => this._normalizeDetail(Sauce, item));
    // тут тоже NormalizeSauce?
  }

  async fetchSizes() {
    const { data } = await axios.get("sizes");
    // console.log("sizes", data);
    return data
      .map((item) => this._normalizeSize(item))
      .sort((a, b) => a.multiplier - b.multiplier);
    // console.log("sizes", data);
    // data.sort((a, b) => a.multiplier - b.multiplier);
    // return data;
    // тут непонятно почему консоль лог срабатывает раньше чем нормалайз и value и isChecked
    // на момент отрисовки отсутствуют
    // вынос .sort после .map не помог - ХЗ что происходит вообще
    // пока не придумала делать эту доп. сортировку все работало правильно((
    // ИСПРАВИЛА ТЕМ ЧТО ДЕЛАЮ RETURN СРАЗУ (но все равно надо понять, почему работало так - криво)
  }

  async fetchIngredients() {
    const { data } = await axios.get("ingredients");
    //console.log("ingredients", data);
    return data.map((item) => this._normalizeIngredient(item));
  }
}
