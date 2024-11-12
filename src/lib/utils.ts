export function strToSearchParams(str: string) {
  return str.toLowerCase().replaceAll(" ", "_");
}
