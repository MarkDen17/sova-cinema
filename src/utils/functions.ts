export function isValidUsername(username: string) {
  return /^[a-zA-Z0-9_-]{3,16}$/.test(username); // От 3 до 16 символов
}

export function isValidPassword(password: string) {
  return /^([A-Za-z0-9]){4,16}$/.test(password);
  // Минимум 4 символов, хотя бы одна буква и одна цифра
}