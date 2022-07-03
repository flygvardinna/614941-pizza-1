import BaseApiService from "@/services/api/baseApi.service";
import axios from "@/plugins/axios";
import { Dough, Sauce, Size, Ingredient } from "@/common/constants";

export default class BuilderApiService extends BaseApiService {
  #normalizeDetail = (detail, item) => {
    return {
      ...item,
      value: detail[item.name],
      isChecked: item.id === 1,
    };
  };

  #normalizeSize = (item) => {
    return {
      ...item,
      value: Size[item.name],
      isChecked: item.multiplier === 1,
    };
  };

  #normalizeIngredient = (item) => {
    return {
      ...item,
      value: Ingredient[item.name],
      quantity: 0,
    };
  };

  async fetchDough() {
    const { data } = await axios.get("dough");

    return data.map((item) => this.#normalizeDetail(Dough, item));
  }

  async fetchSauces() {
    const { data } = await axios.get("sauces");

    return data.map((item) => this.#normalizeDetail(Sauce, item));
  }

  async fetchSizes() {
    const { data } = await axios.get("sizes");
    return data
      .map((item) => this.#normalizeSize(item))
      .sort((a, b) => a.multiplier - b.multiplier);
  }

  async fetchIngredients() {
    const { data } = await axios.get("ingredients");

    return data.map((item) => this.#normalizeIngredient(item));
  }
}
