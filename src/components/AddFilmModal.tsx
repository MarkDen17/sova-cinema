import { useEffect, useState } from "react";
import FilmService from "../api/FilmService";
import { useFetching } from "../hooks/useFetching";
import { Film } from "./FilmsDashboard";

interface AddFilmModalProps {
  films: Film[],
  setFilmList: React.Dispatch<React.SetStateAction<Film[]>>,
  closeModal: () => void,
}

function AddFilmModal({ closeModal, films, setFilmList }: AddFilmModalProps) {
  const [title, setTitle] = useState("");
  const [addFilm, isAddFilmLoading, addFilmError] = useFetching(async () => {
    const response = await FilmService.postFilm(title);
    if (response.success === true) {
      const newFilm = {
        id: response.data.id,
        title: response.data.title,
      }
      setFilmList([...films, newFilm]);
      closeModal()
    }
  })

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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await addFilm();
  }

  return (
    <form onSubmit={(event) => {
      handleSubmit(event)
    }}>
      <h2>Добавьте фильм</h2>
      <input className="input mt-4 min-w-lg" type="text" placeholder="Название фильма" autoFocus maxLength={50} value={title} onChange={(event) => setTitle(event.target.value)} />
      <div><button className="mt-4 button" type="submit" disabled={isAddFilmLoading}>Добавить</button></div>
      <p className="error-text">{addFilmError}</p>
    </form>
  )
}

export default AddFilmModal