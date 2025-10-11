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
            title="Редактировать"
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
            className="button aspect-square flex justify-center items-center p-2 hover:bg-red-500 hover:text-neutral-100"
            draggable={false}
            onClick={handleClick}
            disabled={isLoading}
            title="Удалить"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 128 128"
              width="24"
              height="24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M49 1c-1.66 0-3 1.34-3 3s1.34 3 3 3h30c1.66 0 3-1.34 3-3s-1.34-3-3-3H49zM24 15c-7.17 0-13 5.83-13 13s5.83 13 13 13h77v63c0 9.37-7.63 17-17 17H44c-9.37 0-17-7.63-17-17V52c0-1.66-1.34-3-3-3s-3 1.34-3 3v52c0 12.68 10.32 23 23 23h40c12.68 0 23-10.32 23-23V40.64c5.72-1.36 10-6.5 10-12.64 0-7.17-5.83-13-13-13H24zm0 6h80c3.86 0 7 3.14 7 7s-3.14 7-7 7H24c-3.86 0-7-3.14-7-7s3.14-7 7-7zm26 34c-1.66 0-3 1.34-3 3v46c0 1.66 1.34 3 3 3s3-1.34 3-3V58c0-1.66-1.34-3-3-3zm28 0c-1.66 0-3 1.34-3 3v46c0 1.66 1.34 3 3 3s3-1.34 3-3V58c0-1.66-1.34-3-3-3z" />
            </svg>
          </button>
        </div>
      )}
      {isError && <p className="error-text">{"Произошла ошибка"}</p>}
    </li>
  );
}

export default FilmItem;
