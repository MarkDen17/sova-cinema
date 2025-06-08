import { useEffect, useState } from "react";
import { useAddFilmMutation } from "../features/api/apiSlice";

interface AddFilmModalProps {
  closeModal: () => void;
}

function AddFilmModal({ closeModal }: AddFilmModalProps) {
  const [title, setTitle] = useState("");
  const [addFilm, { isError, isLoading }] = useAddFilmMutation();

  useEffect(() => {
    const removeScrollLock = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", removeScrollLock);
    return () => {
      window.removeEventListener("keydown", removeScrollLock);
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await addFilm({ title }).unwrap();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <h2>Добавьте фильм</h2>
      <input
        className="input mt-4 min-w-lg"
        type="text"
        placeholder="Название фильма"
        autoFocus
        maxLength={50}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <div>
        <button className="mt-4 button" type="submit" disabled={isLoading}>
          Добавить
        </button>
      </div>
      <p className="error-text">{isError && "Произошла ошибка. Пожалуйста перезагрузите страницу"}</p>
    </form>
  );
}

export default AddFilmModal;
