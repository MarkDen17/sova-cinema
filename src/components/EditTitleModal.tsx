import { useState, useEffect } from "react";
import { useEditTitleMutation } from "../features/api/apiSlice";

interface EditTitleModalProps {
  oldTitle: string;
  id: number;
  closeModal: () => void;
}

function EditTitleModal({ closeModal, oldTitle, id }: EditTitleModalProps) {
  const [title, setTitle] = useState(oldTitle);
  const [editTitle, { isLoading, isError }] = useEditTitleMutation();

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
    await editTitle({ id, newTitle: title }).unwrap();
    closeModal();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }
  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <h2>Изменить название фильма</h2>
      <input
        className="input mt-4 min-w-lg"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <div>
        <button className="mt-4 button" type="submit" disabled={isLoading}>
          Изменить
        </button>
      </div>
      <p className="error-text">{isError && "Произошла ошибка. Пожалуйста перезагрузите страницу"}</p>
    </form>
  );
}

export default EditTitleModal;
