// src/components/Modal.jsx
import { forwardRef } from 'react';

const Modal = forwardRef(({event}, ref) => {
  return (
    <dialog id="my_modal_1" className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">{event?.title}</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

Modal.displayName = 'Modal';

export default Modal;