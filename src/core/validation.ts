const nameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/u;
const loginRegex = /^(?!^\d+$)[a-zA-Z0-9_-]{3,20}$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[\s\S]{8,40}$/;
const phoneRegex = /^\+?\d{10,15}$/;
const fullNameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]* [A-ZА-ЯЁ][a-zа-яё-]*$/u;

export function validateName(name: string): boolean {
  return nameRegex.test(name);
}

export function validateLogin(login: string): boolean {
  return loginRegex.test(login);
}

export function validateEmail(email: string): boolean {
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return passwordRegex.test(password);
}

export function validatePhone(phone: string): boolean {
  return phoneRegex.test(phone);
}

export function validateMessage(message: string): boolean {
  return message.trim().length > 0;
}

export function validateFullName(fullName: string): boolean {
  return fullNameRegex.test(fullName.trim());
}


export function on_change_input_checker (
  target: HTMLInputElement,
  checker: CallableFunction,
  is_message: boolean = false): boolean {
  let value = target.value;
  if (!checker(value)) {
    if (!is_message) target.classList.add("invalid");
    return false;
  } else {
    if (!is_message) target.classList.remove("invalid");
    return true;
  }
}
