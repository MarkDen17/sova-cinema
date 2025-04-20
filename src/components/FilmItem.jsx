import { useSelector } from "react-redux";
import { useFetching } from "../hooks/useFetching";
import FilmService from "../api/FilmService";

function FilmItem({ film, filmList, setFilmList, index }) {

  const user = useSelector(state => state.user.userData);
  const [fetchDeleteFilm, isDeleteLoading, error] = useFetching(async () => {
    const response = await FilmService.deleteFilm(film.id);
    if (response.status === 204) {
      setFilmList([...filmList.filter(item => item.id !== film.id)]);
    }
  })

  return (
    <li className="w-full flex gap-4 items-center film-item max-w-xl">
      <span>{index + 1}. </span>
      <span className="text-ellipsis overflow-hidden whitespace-nowrap">{film.title}</span>
      {user.role === 'admin' && <button className="ml-6 button ml-auto hover:bg-red-500 hover:text-neutral-100" draggable={false} onClick={fetchDeleteFilm} disabled={isDeleteLoading}>Удалить</button>}
      {!!error && <p className="error-text">{error}</p>}
    </li>

  )
}

export default FilmItem