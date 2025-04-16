export const validateEmail = (email: string) => {
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

  return "";
};
