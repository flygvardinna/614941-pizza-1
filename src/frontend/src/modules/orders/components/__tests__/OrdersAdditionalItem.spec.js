import { shallowMount } from "@vue/test-utils";
import OrdersAdditionalItem from "@/modules/orders/components/OrdersAdditionalItem";

describe("OrdersAdditionalItem", () => {
  const propsData = {
    item: {
      id: 1,
      name: "Cola-Cola 0,5 литра",
      image: "/public/img/cola.svg",
      price: 56,
      quantity: 1,
    },
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(OrdersAdditionalItem, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ propsData });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders out additional item description", () => {
    createComponent({ propsData });
    expect(wrapper.html()).toContain(propsData.item.name);
    expect(wrapper.html()).toContain(propsData.item.price);
    expect(wrapper.html()).toContain(propsData.item.quantity);
  });

  it("renders out additional item image", () => {
    createComponent({ propsData });
    const image = wrapper.find("img");
    expect(image.attributes("src")).toBe(propsData.item.image);
    expect(image.attributes("alt")).toBe(propsData.item.name);
  });
});
