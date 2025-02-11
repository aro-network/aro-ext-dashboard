export function validateEmail(email?: string) {
  if (!email) return null;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (re.test(email)) return true;
  return "Please enter a vaild email !";
}

export function validatePassword(password?: string) {
  if (!password) return null;
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
  if (re.test(password)) return true;
  return "Your password must be at least 8 characters long and include: at least one uppercase letter, one lowercase letter, and one number. Special characters (@$!%*?&) are allowed.";
}

export function validateConfirmPassword(
  confirmPassword?: string,
  password?: string
) {
  if (!confirmPassword || !password) return null;
  if (confirmPassword === password) return true;
  return "Passwords do not match!";
}

export function validateReferralCode(code?: string) {
  if (!code) return null;
  if (code.trim().length != 6) return "Invalid referral code!";
  return true;
}

export function validateVerifyCode(code?: string) {
  if (!code) return null;
  if (code.trim().length != 6) return "Invalid verification code";
  return true;
}
