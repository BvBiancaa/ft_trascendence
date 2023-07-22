export const getDate = (input: string) => {
  const date = new Date(input);
  const month = date.toLocaleDateString("default", { month: "short" });
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${month} ${day} at ${hour}:${minutes}`;
};
