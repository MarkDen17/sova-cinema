import { useEffect } from 'react';
import CookieConsent from "react-cookie-consent";
import UserService from './api/UserService.ts';
import FilmsDashboard from './components/FilmsDashboard.tsx';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import LoginForm from './components/LoginForm.tsx';
import { selectUser, setUser } from './features/user/userSlice.ts';
import { useAppDispatch, useAppSelector } from './hooks/hooks.ts';
import { useFetching } from './hooks/useFetching.ts';

function App() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch()
  const [fetchCheckAuth, isCheckLoading] = useFetching(async (signal: AbortSignal) => {
    const response = await UserService.checkAuth(signal);
    if (response.success === true) {
      const user = response.data;
      dispatch(setUser(user));
    }
  })

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetchCheckAuth(signal);
    return () => {
      controller.abort("fetch aborted due to useEffect cleanup");
    }
  }, [])

  return (
    <>
      <div className='w-full min-h-full flex flex-col justify-center'>
        <Header />
        <main className='max-w-6xl mx-auto mb-8 flex flex-col gap-4 justify-center items-center self-center main'>
          <h1 className='text-neutral-50 mb-auto mt-6 bg-neutral-900/10'>Добро пожаловать <br /> в <br /> Совиный Кинотеатр</h1>
          <div className='p-6 mb-auto bg-neutral-50 rounded-xl shadow-md'>
            {!user.isAuth && <LoginForm isCheckLoading={isCheckLoading} />}
            {user.isAuth && <FilmsDashboard />}
            <CookieConsent buttonText={"Я понял и согласен"} buttonStyle={{ backgroundColor: "#f9f9f9" }}>Мы используем куки чтобы это приложение работало</CookieConsent>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App