import React, { useContext, useRef, useState, useEffect } from "react";
import { ModalContext } from "./Modal";
import "./ActionModal.css";

export const ActionModalContext = React.createContext();

export const ActionModalProvider = ({ children }) => {
  const modalRef = useRef();
  const [value, setValue] = useState();
  consst[(actionModalType, setActionModalType)] = useState(null);

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ActionModalProvider
        value={{ value, actionModalType, setActionModalType }}
      >
        {children}
      </ActionModalProvider>
      <div ref={modalRef}></div>
    </>
  );
};

export const SelectActionModal = () => {
  const { value, actionModalType, setActionModalType } =
    useContext(ModalContext);

  const closeModal = () => {
    setActionModalType(null);
  };

  if (actionModalType === "editChannelDescription") {
    return (
      <div id="action-modal">
        <div id="action-modal-background"></div>
      </div>
    );
  }
};
