export function validateEmail(email?: string) {
  if (!email) return null;
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) return true;
  return "Please enter a vaild email !";
}

export function validateReferralCode(code?: string) {
  if (!code) return null;
  if (code.length != 6) return "Please enter a vaild email !";
  return true;
}
