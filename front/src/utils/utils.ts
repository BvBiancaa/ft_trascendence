export const getDate = (input: string) => {
  const date = new Date(input);
  const month = date.toLocaleDateString("default", { month: "short" });
  const day = date.getDate();
  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${month} ${day} at ${hour}:${minutes}`;
};
