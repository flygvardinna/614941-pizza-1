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
