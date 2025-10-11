import { useEffect, useState } from "react";
import { Film } from './FilmsDashboard';
import { useDeleteFilmMutation } from '../features/api/apiSlice';
import MagicHat from "./MagicHat";
import Wheel from "./Wheel";

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
  const [randomizationType, setRandomizatonType] = useState("wheel");
  const [isAnimating, setIsAnimating] = useState(false);

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
      {randomizationType === "wheel" && <Wheel randomisedFilm={randomisedFilm} films={films} isAnimating={isAnimating} setIsAnimating={setIsAnimating} />}
      {randomizationType === "magicHat" && <MagicHat randomisedFilm={randomisedFilm} />}
      <div className="min-w-lg flex justify-center gap-4 mt-4">
        {!randomisedFilm && <button className="button" onClick={randomiseFilm} disabled={isAnimating}>Доверится воле случая</button>}
        {randomisedFilm && <button className="button" onClick={acceptFilm} disabled={isLoading || isAnimating}>Да, смотрим!</button>}
        {randomisedFilm && <button className="button" onClick={randomiseFilm} disabled={isAnimating}>Не, ну ребят, давайте этот в другой раз</button>}
        {isError && <p className="error-text">{"Произошла ошибка"}</p>}
      </div>
      <div className='mt-6'>
        <label htmlFor="randomization-type">Тип визуализации: </label>
        <select id="randomization-type" value={randomizationType} onChange={(event) => { setRandomizatonType(event.target.value) }}>
          <option value="wheel">Колесо</option>
          <option value="magicHat">Волшебная шляпа</option>
        </select>
      </div>
    </div>
  )
}

export default RandomiseModal