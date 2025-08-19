import { ReactElement, useMemo, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import { useGetFilmsQuery } from "../features/api/apiSlice";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../store/withTypes";
import AddFilmModal from "./AddFilmModal";
import FilmItem from "./FilmItem";
import Modal from "./Modal";
import RandomiseModal from "./RandomiseModal";

export interface Film {
  id: number;
  title: string;
  user_id: number;
}

function FilmsDashboard() {
  const user = useAppSelector(selectUser);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const modalref = useRef<HTMLDialogElement | null>(null);
  const { data: getFilmsResponse, isLoading, isError, refetch } = useGetFilmsQuery();

  const filmList = useMemo(() => (getFilmsResponse ? getFilmsResponse.data : []), [getFilmsResponse]);

  function closeModal() {
    setModalContent(null);
    document.documentElement.classList.remove("scroll-lock");
    modalref.current?.close();
  }

  function openAddFilmModal() {
    setModalContent(<AddFilmModal closeModal={closeModal}></AddFilmModal>);
    document.documentElement.classList.add("scroll-lock");
    modalref.current?.showModal();
  }

  function openRandomiseFilmModal() {
    setModalContent(<RandomiseModal films={filmList} closeModal={closeModal}></RandomiseModal>);
    document.documentElement.classList.add("scroll-lock");
    modalref.current?.showModal();
  }

  return (
    <div className="p-6 mb-auto bg-neutral-50 rounded-xl shadow-md">
      <div className="my-8 mx-auto">
        {isError && <p className="error-text my-4">"Произошла ошибка. Пожалуйста перезагрузите страницу"</p>}
        <div className="flex gap-4 justify-center">
          <button className="button" draggable={false} onClick={openAddFilmModal}>
            Добавить фильм
          </button>
          {user.role === "admin" && (
            <button className="button" onClick={openRandomiseFilmModal}>
              Выбрать фильм
            </button>
          )}
          <button className="button" draggable={false} disabled={isLoading} onClick={refetch}>
            Обновить список
          </button>
        </div>
        <ol className="flex flex-col items-start gap-4 mt-16 list-none">
          {isLoading && (
            <div className="block mx-auto self-center">
              <PuffLoader size={100} />
            </div>
          )}
          {!isLoading && !isError && filmList.length === 0 && (
            <p className="w-full text-center text">Список пуст и это очень грустно :-\ Добавь скорее фильм</p>
          )}
          {!isLoading &&
            filmList.length > 0 &&
            filmList.map((film, index) => <FilmItem key={film.id} index={index} film={film} />)}
        </ol>
        <Modal ref={modalref} closeModal={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </div>
  );
}

export default FilmsDashboard;
