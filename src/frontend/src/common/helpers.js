export const normalizeDetail = (detail, item) => {
  return {
    ...item,
    value: detail[item.name],
  };
};
