import { useState, useEffect } from "react";
import { useFetching } from "../hooks/useFetching";
import FilmService from "../api/FilmService";

function AddFilmModal({ closeModal, films, setFilmList }) {
  const [title, setTitle] = useState("");
  const [addFilm, isAddFilmLoading, addFilmError] = useFetching(async () => {
    const responce = await FilmService.postFilm(title);
    if (responce.success === true) {
      const newFilm = {
        id: responce.data.id,
        title: responce.data.title,
      }
      setFilmList([...films, newFilm]);
      closeModal()
    }
  })

  useEffect(() => {
    const removeScrollLock = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    }
    window.addEventListener('keydown', removeScrollLock)
    return () => {
      window.removeEventListener('keydown', removeScrollLock);
    }
  }, [])

  async function handleSubmit(event) {
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