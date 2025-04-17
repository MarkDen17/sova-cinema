import { LOGIN_URL, LOGOUT_URL } from "../utils/constansts";

export default class UserService {
  static async login(username, password) {
    const json = JSON.stringify({
      username,
      password
    })

    const responce = await fetch(LOGIN_URL, {
      method: 'POST',
      credentials: 'include',
      body: json,
    })

    if (responce.ok !== true) throw new Error(`Запрос завершился с ошибкой: ${responce.status} ${responce.statusText}`);
    if (responce.ok === true) {
      return await responce.json();
    }
  }

  static async logout() {
    const response = await fetch(LOGOUT_URL, {
      credentials: 'include',
    });

    if (response.ok !== true) {
      const error = await response.json();
      throw new Error(error.errorText);
    }
    return await response.json();
  }

  static async checkAuth(signal) {
    const response = await fetch(LOGIN_URL, {
      method: 'GET',
      credentials: 'include',
      signal: signal || null
    });
    return await response.json();
  }
}