import { apiSlice, useLogoutMutation } from "../features/api/apiSlice";
import { initialUser, selectUser, setUser } from "../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../store/withTypes";

function Header() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [fetchLogout, { isLoading }] = useLogoutMutation();

  async function logout() {
    try {
      const response = await fetchLogout().unwrap();
      if (response.success === true) {
        dispatch(setUser(initialUser));
        dispatch(apiSlice.util.resetApiState());
      }
    } catch (error) {
      throw new Error("Logout failed");
    }
  }

  return (
    <header className="w-full h-18 flex items-center justify-end gap-10 px-30 py-2 left-0 bg-neutral-950/75">
      {user.isAuth && (
        <div className="flex gap-6 items-center">
          <span className="mr-8 text-2xl text-neutral-50">{user?.isAuth && user.username}</span>
          <button
            className="flex gap-2 text-slate-800 bg-neutral-50 select-none active:translate-y-px focus:outline-transparent focus-visible:outline-current"
            draggable={false}
            onClick={logout}
            disabled={isLoading}
          >
            Выйти
            <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
                stroke="var(--color-slate-800)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
