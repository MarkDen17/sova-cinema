import { LOGIN_URL, LOGOUT_URL } from "../utils/constansts";
import { UserState } from "../features/user/userSlice";

interface LoginResponse {
  success: boolean,
  data: UserState
}

interface LogoutResponse {
  success: boolean,
  message: string
}

interface CheckAuthResponse {
  success: boolean,
  data: UserState
}

export default class UserService {
  static async login(username: string, password: string): Promise<LoginResponse> {
    const json = JSON.stringify({
      username,
      password
    })

    const responce = await fetch(LOGIN_URL, {
      method: 'POST',
      credentials: 'include',
      body: json,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (responce.ok !== true) {
      throw new Error(`Запрос завершился с ошибкой: ${responce.status} ${responce.statusText}`);
    }
    return await responce.json();

  }

  static async logout(): Promise<LogoutResponse> {
    const response = await fetch(LOGOUT_URL, {
      credentials: 'include',
    });

    if (response.ok !== true) {
      const error = await response.json();
      throw new Error(error.errorText);
    }
    return await response.json();
  }

  static async checkAuth(signal: AbortSignal): Promise<CheckAuthResponse> {
    const response = await fetch(LOGIN_URL, {
      method: 'GET',
      credentials: 'include',
      signal: signal || null
    });
    return await response.json();
  }
}