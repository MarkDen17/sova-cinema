import { createContext, useContext, useState } from "react";

const UserContext = createContext();

const initialUser = {
  isAuth: false,
  id: null,
  name: null,
  role: null
}

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUser);


  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      {children}
    </UserContext.Provider>
  )
}

