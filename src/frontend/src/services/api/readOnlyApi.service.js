import BaseApiService from "@/services/api/baseApi.service";
import axios from "@/plugins/axios";

export default class ReadOnlyApiService extends BaseApiService {
  #resource;
  constructor(resource, notifier) {
    super(notifier);
    this.#resource = resource;
  }

  async query() {
    const { data } = await axios.get(this.#resource);
    return data;
  }
}
