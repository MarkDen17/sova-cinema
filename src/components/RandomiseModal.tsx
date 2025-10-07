import { useEffect, useState } from "react";
import { Film } from './FilmsDashboard';
import { useDeleteFilmMutation } from '../features/api/apiSlice';
import MagicHat from "./MagicHat";

function randomiseItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface RandomiseModalProps {
  films: Film[],
  closeModal: () => void,
}

function RandomiseModal({ films, closeModal }: RandomiseModalProps) {
  const [randomisedFilm, setRandomisedFilm] = useState<Film | null>(null);
  const [deleteFilm, { isLoading, isError }] = useDeleteFilmMutation();
  const [randomizationType, setRandomizatonType] = useState("magicHat");

  function randomiseFilm() {
    if (films.length === 0) return;
    let newFilm = randomiseItem(films);
    if (films.length > 1) {
      while (newFilm === randomisedFilm) {
        newFilm = randomiseItem(films);
      }
    }
    setRandomisedFilm(newFilm);
  }

  async function acceptFilm() {
    if (randomisedFilm) {
      await deleteFilm({ id: randomisedFilm.id });
      closeModal();
    }
  }

  useEffect(() => {
    const removeScrollLock = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    }
    window.addEventListener('keydown', removeScrollLock)
    return () => {
      window.removeEventListener('keydown', removeScrollLock);
    }
  }, [])

  return (
    <div>
      {randomizationType === "magicHat" && <MagicHat randomisedFilm={randomisedFilm} />}
      <div className="min-w-lg flex justify-center gap-4 mt-4">
        {!randomisedFilm && <button className="button" onClick={randomiseFilm}>Доверится воле случая</button>}
        {randomisedFilm && <button className="button" onClick={acceptFilm} disabled={isLoading}>Да, смотрим!</button>}
        {randomisedFilm && <button className="button" onClick={randomiseFilm}>Не, ну ребят, давайте этот в другой раз</button>}
        {isError && <p className="error-text">{"Произошла ошибка"}</p>}
      </div>
      <div className='mt-6'>
        <label htmlFor="randomization-type">Тип визуализации: </label>
        <select id="randomization-type" value={randomizationType} onChange={(event) => { setRandomizatonType(event.target.value) }}>
          <option value="wheel">Колесо</option>
        </select>
      </div>
    </div>
  )
}

export default RandomiseModal