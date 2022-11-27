import { useState, useEffect, useContext } from "react";
import { SelectModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import AboutSubModal from "./SubModal/AboutSubModal";
import MembersSubModal from "./SubModal/MembersSubModal";
import { ModalContext } from "../../context/Modal";

const ChannelInfoModal = ({ subModal }) => {
  const channel = useSelector((state) => state.channel.channel);
  const [isLoaded, setIsLoaded] = useState(false);
  const [localSubModal, setLocalSubModal] = useState(subModal);

  useEffect(() => {
    if (channel) {
      setIsLoaded(true);
    }
  }, [channel]);
  return (
    <div id="modal-content">
      <div className="modal-title">
        <h1>{channel.name}</h1>
      </div>
      <div className="modal-options">
        <div
          className={`modal-option-1 ${subModal === "about" ? "active" : ""}`}
          onClick={() => setLocalSubModal("about")}
        >
          About
        </div>
        <div
          className={`modal-option-1 ${subModal === "members" ? "active" : ""}`}
          onClick={() => setLocalSubModal("members")}
        >
          Members {channel.userCount}
        </div>
      </div>
      <div className="submodal-content">
        {localSubModal === "about" && <AboutSubModal />}
        {localSubModal === "members" && <MembersSubModal />}
      </div>
    </div>
  );
};

export default ChannelInfoModal;
