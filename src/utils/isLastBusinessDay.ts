export const isLastBusinessDay = (date = new Date()): boolean => {
  const day = date.getDay();
  if (day === 0 || day === 6) return false;

  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay.getMonth() !== date.getMonth() || [6, 0].includes(nextDay.getDay());
};
