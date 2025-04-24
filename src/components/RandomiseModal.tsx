import hatImage from '@/assets/images/hat-min.png';
import { useEffect, useState } from "react";
import FilmService from "../api/FilmService";
import { useFetching } from "../hooks/useFetching";
import { Film } from './FilmsDashboard';

function randomiseItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface RandomiseModalProps {
  films: Film[],
  setFilmList: React.Dispatch<React.SetStateAction<Film[]>>,
  closeModal: () => void,
}

function RandomiseModal({ films, setFilmList, closeModal }: RandomiseModalProps) {
  const [randomisedFilm, setRandomisedFilm] = useState<Film | null>(null);
  const [fetchDeleteFilm, isDeleteLoading, error] = useFetching(async () => {
    if (randomisedFilm === null) return;
    const response = await FilmService.deleteFilm(randomisedFilm.id);
    if (response && response.ok === true) {
      setFilmList([...films.filter(item => item.id !== randomisedFilm.id)]);
    }
  })

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
    await fetchDeleteFilm();
    closeModal();
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
      <div className="relative modal-image-container">
        {randomisedFilm && <div key={randomisedFilm.id} className="text-neutral-900 animate-film absolute top-0 w-full text-3xl text-center text-ellipsis overflow-hidden">{randomisedFilm.title}</div>}
        <img loading="lazy" className="mt-10 modal-image" draggable="false" src={hatImage} width={798} height={409} alt="" />
      </div>
      <div className="min-w-lg flex justify-center gap-4 mt-4">
        {!randomisedFilm && <button className="button" onClick={randomiseFilm}>Доверится воле случая</button>}
        {randomisedFilm && <button className="button" onClick={acceptFilm} disabled={isDeleteLoading}>Да, смотрим!</button>}
        {randomisedFilm && <button className="button" onClick={randomiseFilm}>Не, ну ребят, давайте этот в другой раз</button>}
        {!!error && <p className="error-text">{error}</p>}
      </div>
    </div>
  )
}

export default RandomiseModal