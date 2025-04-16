export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }

  // Basic email format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  // Check for consecutive dots
  if (email.includes("..")) {
    return "Email cannot contain consecutive dots";
  }

  // Check for spaces
  if (email.includes(" ")) {
    return "Email cannot contain spaces";
  }

  // Check for valid domain
  const domain = email.split("@")[1];
  if (!domain || domain.length < 2) {
    return "Invalid email domain";
  }

  // Check for valid TLD (top-level domain)
  const tld = domain.split(".").pop();
  if (!tld || tld.length < 2) {
    return "Invalid email domain extension";
  }

  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character";
  }
  return null;
};
