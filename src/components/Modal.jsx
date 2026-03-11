import "../styles/Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FocusTrap } from "focus-trap-react";
import { useEffect, useState } from "react";

function Modal({ children, onClose }) {
  const [className, setClassName] = useState("modal-content");
  useEffect(() => {
    const handleClose = (event) => {
      if (event.type === "keydown" && event.key === "Escape") onClose();
      if (event.type === "click" && event.target.dataset.modalBg !== undefined)
        onClose();
    };
    document.addEventListener("keydown", handleClose);
    document.addEventListener("click", handleClose);

    setClassName("modal-content modal-loaded")

    return () => {
      document.removeEventListener("keydown", handleClose);
      document.removeEventListener("click", handleClose);
    };

  }, []);
  return (
    <FocusTrap>
      <div data-modal-bg className="modal-bg">
        <div className={className}>
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
