import { ReactElement, useEffect, useRef, useState } from "react";
import { PuffLoader } from "react-spinners";
import FilmService from '../api/FilmService';
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../store/withTypes";
import { useFetching } from "../hooks/useFetching";
import AddFilmModal from "./AddFilmModal";
import FilmItem from "./FilmItem";
import Modal from "./Modal";
import RandomiseModal from "./RandomiseModal";

export interface Film {
  id: number,
  title: string,
}

function FilmsDashboard() {
  const user = useAppSelector(selectUser);
  const [filmList, setFilmList] = useState<Film[] | []>([]);
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const modalref = useRef<HTMLDialogElement | null>(null);
  const [fetchFilms, isFilmsLoading, filmsLoadingError] = useFetching(async (signal: AbortSignal) => {
    const response = await FilmService.getAllFilms(signal);
    const data = response.data;
    setFilmList(data);
  })

  const controller = new AbortController();
  const signal = controller.signal;

  useEffect(() => {
    if (user.isAuth !== true) return;
    const controller = new AbortController();
    const signal = controller.signal;
    fetchFilms(signal);
    return () => {
      controller.abort("fetch aborted due to useEffect cleanup");
    }
  }, [])

  function closeModal() {
    setModalContent(null);
    document.documentElement.classList.remove('scroll-lock');
    modalref.current?.close();
  }

  function openAddFilmModal() {
    setModalContent(<AddFilmModal films={filmList} setFilmList={setFilmList} closeModal={closeModal}></AddFilmModal>);
    document.documentElement.classList.add('scroll-lock');
    modalref.current?.showModal();
  }

  function openRandomiseFilmModal() {
    setModalContent(<RandomiseModal films={filmList} setFilmList={setFilmList} closeModal={closeModal}></RandomiseModal>);
    document.documentElement.classList.add('scroll-lock');
    modalref.current?.showModal();
  }

  return (
    <div className='p-6 mb-auto bg-neutral-50 rounded-xl shadow-md'>
      <div className="my-8 mx-auto">
        <p>{filmsLoadingError}</p>
        <div className="flex gap-4 justify-center" >
          <button className="button" draggable={false} onClick={openAddFilmModal}>Добавить фильм</button>
          {user.role === 'admin' && <button className="button" onClick={openRandomiseFilmModal}>Выбрать фильм</button>}
          <button className="button" draggable={false} disabled={isFilmsLoading} onClick={() => fetchFilms(signal)}>Обновить список</button>
        </div>
        <ol className="flex flex-col items-start gap-4 mt-16 list-none">
          {isFilmsLoading ?
            <div className="block mx-auto self-center"><PuffLoader size={100} /></div>
            :
            filmList.length > 0 ?
              filmList.map((film, index) => <FilmItem key={film.id} index={index} film={film} filmList={filmList} setFilmList={setFilmList} />)
              :
              <p className="w-full text-center text">Список пуст и это очень грустно :-\ Добавь скорее фильм</p>
          }
        </ol>
        <Modal ref={modalref} closeModal={closeModal}>{modalContent}</Modal>
      </div>
    </div>
  )
}

export default FilmsDashboard 