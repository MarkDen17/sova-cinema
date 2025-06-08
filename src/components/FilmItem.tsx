import { useDeleteFilmMutation } from "../features/api/apiSlice";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../store/withTypes";
import { Film } from "./FilmsDashboard";

interface FilmItemProps {
  film: Film;
  index: number;
}

function FilmItem({ film, index }: FilmItemProps) {
  const user = useAppSelector(selectUser);
  const [deleteFilm, { isLoading, isError, }] = useDeleteFilmMutation();

  async function handleClick() {
    try {
      deleteFilm({ id: film.id })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <li className="w-full flex gap-4 items-center film-item max-w-xl">
      <span>{index + 1}. </span>
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">{film.title}</span>
      {user.role === "admin" && (
        <button
          className="ml-6 button ml-auto hover:bg-red-500 hover:text-neutral-100"
          draggable={false}
          onClick={handleClick}
          disabled={isLoading}
        >
          Удалить
        </button>
      )}
      {isError && <p className="error-text">{"Произошла ошибка"}</p>}
    </li>
  );
}

export default FilmItem;
