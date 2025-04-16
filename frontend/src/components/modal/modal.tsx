import React from "react";
import "./modal.css";

type ModalProps = {
  header?: string;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ header, children }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      {header && <div className="modal-header">{header}</div>}
      <div className="modal-body">{children}</div>
    </div>
  </div>
);
