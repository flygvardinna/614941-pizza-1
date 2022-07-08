import { shallowMount } from "@vue/test-utils";
import AppPicture from "@/common/components/AppPicture";

describe("AppPicture", () => {
  const propsData = {
    src: "/public/img/users/user.jpg",
    alt: "Иван Иванов",
    width: 32,
    height: "32",
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppPicture, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out image with src equal to prop src", () => {
    createComponent({ propsData });
    expect(wrapper.find("img").attributes("src")).toBe(propsData.src);
  });

  it("image alt is equal to prop alt", () => {
    createComponent({ propsData });
    expect(wrapper.find("img").attributes("alt")).toBe(propsData.alt);
  });

  it("image width is equal to prop width when prop type is string", () => {
    createComponent({ propsData });
    expect(wrapper.find("img").attributes("width")).toBe("32");
  });

  it("image height is equal to prop height when prop type is number", () => {
    createComponent({ propsData });
    expect(wrapper.find("img").attributes("height")).toBe(propsData.height);
  });
});
