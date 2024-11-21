export function validateEmail(email?: string) {
  if (!email) return null;
  const re = /\S+@\S+\.\S+/;
  if (re.test(email)) return true;
  return "Please enter a vaild email !";
}

export function validatePassword(password?: string) {
  if (!password) return null;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (re.test(password)) return true;
  return "Please enter a vaild password (@$!%*?&,number,a-z,A-Z,>=8) !";
}

export function validateConfirmPassword(confirmPassword?: string, password?: string) {
  if (confirmPassword === password) return true;
  return "Not Matched";
}

export function validateReferralCode(code?: string) {
  if (!code) return null;
  if (code.length != 6) return "Please enter a vaild referral code !";
  return true;
}

export function validateVerifyCode(code?: string) {
  if (!code) return null;
  if (code.length != 6) return "Please enter a vaild verify code !";
  return true;
}
