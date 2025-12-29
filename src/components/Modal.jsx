import "../styles/Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FocusTrap } from "focus-trap-react";
import { useEffect } from "react";

function Modal({ children, onClose }) {
  useEffect(() => {
    const handleClose = (event) => {
      if (event.type === "keydown" && event.key === "Escape") onClose();
      if (event.type === "click" && event.target.dataset.modalBg !== undefined)
        onClose();
    };
    document.addEventListener("keydown", handleClose);
    document.addEventListener("click", handleClose);

    return () => {
      document.removeEventListener("keydown", handleClose);
      document.removeEventListener("click", handleClose);
    };
  }, []);
  return (
    <FocusTrap>
      <div data-modal-bg className="modal-bg">
        <div className="modal-content">
          <button className="close-modal" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
          </button>
          {children}
        </div>
      </div>
    </FocusTrap>
  );
}

export default Modal;
