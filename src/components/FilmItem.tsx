import { useDeleteFilmMutation } from "../features/api/apiSlice";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../store/withTypes";
import { Film } from "./FilmsDashboard";

interface FilmItemProps {
  film: Film;
  index: number;
  openEditTitleModal: (oldTitle: string, id: number) => void;
}

function FilmItem({ film, index, openEditTitleModal }: FilmItemProps) {
  const user = useAppSelector(selectUser);
  const [deleteFilm, { isLoading, isError }] = useDeleteFilmMutation();

  async function handleClick() {
    try {
      deleteFilm({ id: film.id });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <li className="w-full flex gap-4 items-center film-item max-w-xl">
      <span>{index + 1}. </span>
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">{film.title}</span>
      {(user.role === "admin" || user.id === film.user_id) && (
        <div className="film-item__actions flex items-center gap-3 ml-auto">
          <button
            className="button aspect-square flex justify-center items-center p-2"
            onClick={() => openEditTitleModal(film.title, film.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className="button hover:bg-red-500 hover:text-neutral-100"
            draggable={false}
            onClick={handleClick}
            disabled={isLoading}
          >
            Удалить
          </button>
        </div>
      )}
      {isError && <p className="error-text">{"Произошла ошибка"}</p>}
    </li>
  );
}

export default FilmItem;
