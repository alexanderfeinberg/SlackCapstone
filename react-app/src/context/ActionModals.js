import React, { useContext, useRef, useState, useEffect } from "react";
import { ModalContext } from "./Modal";
import EditChannelModal from "../components/EditChannelModal";
import "./ActionModal.css";

export const ActionModalContext = React.createContext();

export const ActionModalProvider = ({ children }) => {
  const modalRef = useRef();
  const [value, setValue] = useState();
  const [actionModalType, setActionModalType] = useState(null);
  const [subActionModalType, setSubActionModalType] = useState(null);

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ActionModalContext.Provider
        value={{
          value,
          actionModalType,
          setActionModalType,
          subActionModalType,
          setSubActionModalType,
        }}
      >
        {children}
      </ActionModalContext.Provider>
      <div ref={modalRef}></div>
    </>
  );
};

export const SelectActionModal = () => {
  const { value, actionModalType, setActionModalType, subActionModalType } =
    useContext(ActionModalContext);

  const closeModal = () => {
    setActionModalType(null);
  };

  if (actionModalType === "editChannel") {
    return (
      <div id="action-modal">
        <EditChannelModal />
        <div id="action-modal-background" onClick={closeModal}></div>
      </div>
    );
  }
  return null;
};
