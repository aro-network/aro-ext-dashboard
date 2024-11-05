export function validateEmail(email?: string) {
  if (!email) return null;
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) return true;
  return "Please input valid email";
}
