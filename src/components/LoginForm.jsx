import { useState } from "react";
import { PuffLoader } from "react-spinners";
import UserServise from "../api/UserService";
import { useUser } from "../context/UserContext";
import { useFetching } from "../hooks/useFetching";
import { isValidPassword, isValidUsername } from "../utils/functions";

function LoginForm({ isCheckLoading }) {

  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [fetchLogin, fetchLoading, fetchingError] = useFetching(async () => {
    const responce = await UserServise.login(username, password);
    const user = responce.data;
    setUser({
      isAuth: true,
      id: user.id,
      name: user.username,
      role: user.role
    })
  })

  const isLoading = fetchLoading || isCheckLoading;

  const validateInput = () => {
    if (!isValidUsername(username)) {
      setErrorText('Ошибка в имени пользователя. Только латинские буквы, цифры, "_", "-". От 3 до 16 символов.')
      return false;
    }

    if (!isValidPassword(password)) {
      setErrorText('Ошибка в пароле. Только латинские буквы и цифры. Минимум 4 символа')
      return false;
    }
    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorText("");
    if (!validateInput()) return;
    fetchLogin()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-screen min-w-sm flex flex-col gap-3 mt-4 mx-auto">
      <h2 className="text-3xl">Авторизация</h2>
      {isLoading ?
        <div className="block mx-auto mt-20">
          <PuffLoader size={100} />
        </div>
        :
        <>
          <label className="label text-xl" htmlFor="name" >Имя пользователя</label>
          <input className="input" type="text" id="name" maxLength={16} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <label htmlFor="password" className="label text-xl">Пароль</label>
          <input className="input" type="password" id="password" maxLength={16} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <button className="mt-4 text-xl button" type="submit" draggable={false} disabled={isLoading}>Войти</button>
          <small className="text-red-600">{fetchingError}</small>
          <small className="error-text">{errorText}</small>
        </>
      }

    </form>
  )
}

export default LoginForm