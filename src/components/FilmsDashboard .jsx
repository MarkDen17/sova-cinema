import { useRef, useState, useEffect } from "react";
import { useFetching } from "../hooks/useFetching";
import FilmItem from "./FilmItem";
import { PuffLoader } from "react-spinners";
import FilmService from '../api/FilmService';
import Modal from "./Modal";
import AddFilmModal from "./AddFilmModal";
import RandomiseModal from "./RandomiseModal";
import { useSelector } from "react-redux";

// const fetchedFilmList = [
//   { id: 1, title: 'matrix 1' },
//   { id: 2, title: 'matrix 2' },
//   { id: 3, title: 'matrix 3. The best' },
// ];

function FilmsDashboard() {
  const user = useSelector(state => state.user.userData);
  const [filmList, setFilmList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const modalref = useRef();
  const [fetchFilms, isFilmsLoading, filmsLoadingError] = useFetching(async (signal) => {
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
    modalref.current.close();
  }

  function openAddFilmModal() {
    setModalContent(<AddFilmModal films={filmList} setFilmList={setFilmList} closeModal={closeModal}></AddFilmModal>);
    document.documentElement.classList.add('scroll-lock');
    modalref.current.showModal();
  }

  function openRandomiseFilmModal() {
    setModalContent(<RandomiseModal films={filmList} setFilmList={setFilmList} closeModal={closeModal}></RandomiseModal>);
    document.documentElement.classList.add('scroll-lock');
    modalref.current.showModal();
  }

  return (
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
  )
}

export default FilmsDashboard 