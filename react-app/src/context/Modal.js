import React, { useContext, useRef, useState, useEffect } from "react";
import "./Modal.css";
import ChannelInfoModal from "../components/ChannelInfoModal";
import ReactDOM from "react";

export const ModalContext = React.createContext();

export const ModalProvider = ({ children }) => {
  const modalRef = useRef();
  const [value, setValue] = useState();
  const [modalType, setModalType] = useState(null);
  const [subModalType, setSubModalType] = useState(null);

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider
        value={{
          value,
          modalType,
          setModalType,
          subModalType,
          setSubModalType,
        }}
      >
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
};

export const SelectModal = () => {
  const { value, modalType, setModalType, subModalType } =
    useContext(ModalContext);
  //   if (!value) return null;

  const closeModal = () => {
    setModalType(null);
  };

  if (modalType === "channelInfo") {
    console.log("MDOAL TYPE");
    return (
      <div id="modal">
        <ChannelInfoModal subModal={subModalType} />
        <div id="modal-background" onClick={closeModal}></div>
      </div>
    );
  } else if (modalType === "createChannel") {
    return (
      <div className="modal">
        <div className="modal-background" onClick={closeModal}></div>
      </div>
    );
  }
  return null;
};
