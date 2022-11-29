import React, { useContext, useRef, useState, useEffect } from "react";
import "./Modal.css";

export const EditFormContext = React.createContext();

export const EditFormProvider = ({ children }) => {
  const modalRef = useRef();
  const [value, setValue] = useState();
  const [editFormOpen, setEditFormOpen] = useState(false);

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <EditFormContext.Provider
        value={{
          value,
          editFormOpen,
          setEditFormOpen,
        }}
      >
        {children}
      </EditFormContext.Provider>
      <div ref={modalRef} />
    </>
  );
};
