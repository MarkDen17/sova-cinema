import Cookies from "js-cookie";
import { useState } from "react";

interface CookieTermProps {
  setIsCookieAccepted: React.Dispatch<React.SetStateAction<boolean>>
}

function CookieTerm({ setIsCookieAccepted }: CookieTermProps) {
  const [isTechCookieAccepted, setIsTechCookieAccepted] = useState(false);

  function setCookies() {
    if (isTechCookieAccepted) {
      Cookies.set("TechCookieAccepted", "true", { expires: 365 });
    }
    setIsCookieAccepted(true)
  }

  return (
    <div className="fixed bottom-2 left-2 max-w-lg p-8 bg-neutral-50 rounded-xl border">
      <h2 className="text-xl ">Одну секундочку</h2>
      <p className="mt-6 pb-3 border-b text-justify">
        Мы используем <a href="https://ru.wikipedia.org/wiki/Cookie">cookie</a> на нашем сайте. Чтобы продолжить им
        пользоваться пожалуйста дайте свое согласие.
      </p>
      <div className="flex gap-2 pt-2 items-start">
        <label htmlFor="sessional" className="">
          <input
            id="sessional"
            type="checkbox"
            className="hidden"
            checked={isTechCookieAccepted}
            onChange={(event) => {
              setIsTechCookieAccepted(event.target.checked);
            }}
          />
          <span className="checkbox"></span>
        </label>
        <p className="text-justify">
          Технические (Обязательные). Их мы ипользуем их для создания механизма авторизации. Без них функционал сайта не
          работает
        </p>
      </div>
      <button className="button w-full mt-4 font-bold" disabled={!isTechCookieAccepted} onClick={setCookies}>
        Принять
      </button>
    </div>
  );
}

export default CookieTerm;
