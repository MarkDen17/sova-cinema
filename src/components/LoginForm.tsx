import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { PuffLoader } from "react-spinners";
import { useCheckLoginQuery, useLoginMutation } from "../features/api/apiSlice";
import { setUser } from "../features/user/userSlice";
import { isValidPassword, isValidUsername } from "../utils/functions";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [fetchLogin, { isLoading: isLoginLoading, error: loginError }] = useLoginMutation();
  const { data: checkLoginResponse, isLoading: isCheckLoading } = useCheckLoginQuery();

  useEffect(() => {
    if (checkLoginResponse?.success === true) {
      const user = checkLoginResponse.data;
      dispatch(setUser({ ...user }));
      navigate(location.state || "/");
    }
  }, [checkLoginResponse]);

  const validateInput = () => {
    if (!isValidUsername(username)) {
      setErrorText('Ошибка в имени пользователя. Только латинские буквы, цифры, "_", "-". От 3 до 16 символов.');
      return false;
    }

    if (!isValidPassword(password)) {
      setErrorText("Ошибка в пароле. Только латинские буквы и цифры. Минимум 4 символа");
      return false;
    }
    return true;
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorText("");
    if (!validateInput()) return;

    try {
      const response = await fetchLogin({ username, password }).unwrap();
      if (response.success === true) {
        const user = response.data;
        dispatch(setUser({ ...user }));
        navigate(location.state || "/");
      }
    } catch (error) {
      console.error(error)
    }
  }

  const isLoading = isCheckLoading || isLoginLoading;

  return (
    <div className="p-6 mb-auto bg-neutral-50 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="max-w-md w-screen min-w-sm flex flex-col gap-3 mt-4 mx-auto">
        <h2 className="text-3xl">Авторизация</h2>
        {isLoading ? (
          <div className="block mx-auto my-20">
            <PuffLoader size={100} />
          </div>
        ) : (
          <>
            <label className="label text-xl" htmlFor="name">
              Имя пользователя
            </label>
            <input
              className="input"
              type="text"
              id="name"
              maxLength={16}
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <label htmlFor="password" className="label text-xl">
              Пароль
            </label>
            <input
              className="input"
              type="password"
              id="password"
              maxLength={16}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button className="mt-4 text-xl button" type="submit" draggable={false} disabled={isLoading}>
              Войти
            </button>
            <small className="text-red-600">
              {loginError
                ? "data" in loginError && loginError.status === 401
                  ? "Неверное сочетание логина и пароля"
                  : "Произошла неизвестная ошибка"
                : null}
            </small>
            <small className="error-text">{errorText}</small>
          </>
        )}
      </form>
    </div>
  );
}

export default LoginForm;
