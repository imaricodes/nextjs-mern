//LEARN: In this function the argument has the type string. Note the return type is also set to string. This is not mandatory, but it is good practice to set the return type as it helps to avoid errors.
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
