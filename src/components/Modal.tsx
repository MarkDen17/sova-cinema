import { ReactNode, Ref } from "react"

interface ModalProps {
  children: ReactNode,
  ref: Ref<HTMLDialogElement> | undefined,
  closeModal: () => void;
}

function Modal({ children, ref, closeModal }: ModalProps) {
  return (
    <dialog className="modal mx-auto focus-visible:outline-transparent" ref={ref}>
      <button onClick={closeModal} className="block ml-auto mt-2 mr-2 button" type="button">закрыть</button>
      <div className="modal__content">
        {children}
      </div>
    </dialog>
  )
}

export default Modal