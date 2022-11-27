import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import configureStore from "./store";
import { ModalProvider, SelectModal } from "./context/Modal";
import { SelectActionModal, ActionModalProvider } from "./context/ActionModals";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ActionModalProvider>
        <ModalProvider>
          <SelectModal />

          <SelectActionModal />
          <App />
        </ModalProvider>
      </ActionModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
