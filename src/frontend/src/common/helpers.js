export const normalizeDetail = (detail, item) => {
  return {
    ...item,
    value: detail[item.name],
    isChecked: item.id === 1,
  };
};

export const normalizeIngredients = (list, item) => {
  return {
    ...item,
    englishName: list[item.name],
    value: 0,
  };
};

export const getCartItems = () => {
  const items = localStorage.getItem("items");
  if (items) {
    return JSON.parse(items);
  }
  return [];
};

export const setCartItems = (items) => {
  localStorage.setItem("items", JSON.stringify(items));
};

export const capitalize = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const findSelectedItem = (items) => {
  return items.find((item) => item.isChecked);
};
