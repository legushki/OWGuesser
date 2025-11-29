import "../styles/Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

function Modal({ children, isOpen, onClose }) {
  return (
    <div className="modal-bg">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
