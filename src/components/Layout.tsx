import CookieConsent from "react-cookie-consent"
import { Outlet } from "react-router"
import Footer from "./Footer"
import Header from "./Header"

function Layout() {

  return (
    <>
      <div className='w-full min-h-full flex flex-col justify-center'>
        <Header />
        <main className='max-w-6xl mx-auto mb-8 flex flex-col gap-4 justify-center items-center self-center main'>
          <h1 className='text-neutral-50 mb-auto mt-6 bg-neutral-900/10'>Добро пожаловать <br /> в <br /> Совиный Кинотеатр</h1>
          <Outlet />
        </main>
        <Footer />
        <CookieConsent buttonText={"Я понял и согласен"} buttonStyle={{ backgroundColor: "#f9f9f9" }}>Мы используем куки чтобы это приложение работало</CookieConsent>
      </div>
    </>
  )
}

export default Layout