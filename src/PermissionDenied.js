import { useEffect, useState } from "react";

export default ({ isOpen, setIsOpen }) => {
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    }
  }, [isOpen, setIsOpen]);

  return (
    <div className={`permission-modal-overlay ${isOpen ? "visible" : ""}`}>
      <div className="modal">
        <div>רק אליאור יכול לערוך את זה</div>
        <div className="emoji">{"🤷‍♂️"}</div>
      </div>
    </div>
  );
};
