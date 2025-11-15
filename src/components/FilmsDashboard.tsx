import { ReactElement, useMemo, useRef, useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";
import { useGetFilmsQuery } from "../features/api/apiSlice";
import { selectUser } from "../features/user/userSlice";
import { useAppSelector } from "../store/withTypes";
import AddFilmModal from "./AddFilmModal";
import EditTitleModal from "./EditTitleModal";
import FilmItem from "./FilmItem";
import Modal from "./Modal";
import RandomiseModal from "./RandomiseModal";
import { AnimatePresence, motion } from "motion/react";

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
  const [initialLoad, setInitialLoad] = useState(true);

  const filmList = useMemo(() => (getFilmsResponse ? getFilmsResponse.data : []), [getFilmsResponse]);

  // Отслеживаем завершение начальной загрузки
  useEffect(() => {
    if (!isLoading && filmList.length > 0 && initialLoad) {
      setInitialLoad(false);
    }
  }, [isLoading, filmList.length, initialLoad]);

  // Сбрасываем флаг при ошибке
  useEffect(() => {
    if (isError) {
      setInitialLoad(false);
    }
  }, [isError]);

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

  function openEditTitleModal(oldTitle: string, id: number) {
    setModalContent(<EditTitleModal closeModal={closeModal} oldTitle={oldTitle} id={id}></EditTitleModal>);
    document.documentElement.classList.add("scroll-lock");
    modalref.current?.showModal();
  }

  return (
    <motion.div
      className="p-6 mb-auto bg-neutral-50 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="my-8 mx-auto">
        {isError && (
          <motion.p className="error-text my-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            "Произошла ошибка. Пожалуйста перезагрузите страницу"
          </motion.p>
        )}
        <div className="flex gap-4 justify-center">
          <button className="button" draggable={false} onClick={openAddFilmModal}>
            Добавить фильм
          </button>
          {user.role === "admin" && (
            <button className="button" onClick={openRandomiseFilmModal} disabled={!filmList || filmList.length === 0}>
              Выбрать фильм
            </button>
          )}
          <button className="button" draggable={false} disabled={isLoading} onClick={refetch}>
            Обновить список
          </button>
        </div>
        <motion.ol layout className="flex flex-col items-start gap-4 mt-16 list-none">
          <AnimatePresence mode="popLayout">
            {isLoading && (
              <motion.div
                className="block mx-auto self-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PuffLoader size={100} />
              </motion.div>
            )}

            {!isLoading && !isError && filmList.length === 0 && (
              <motion.p
                className="w-full text-center text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                Список пуст и это очень грустно :-\ Добавь скорее фильм
              </motion.p>
            )}

            {!isLoading &&
              filmList.length > 0 &&
              filmList.map((film, index) => (
                <FilmItem key={film.id} index={index} film={film} openEditTitleModal={openEditTitleModal} animateEntry={!initialLoad} />
              ))}
          </AnimatePresence>
        </motion.ol>

        <Modal ref={modalref} closeModal={closeModal}>
          {modalContent}
        </Modal>
      </div>
    </motion.div>
  );
}

export default FilmsDashboard;
