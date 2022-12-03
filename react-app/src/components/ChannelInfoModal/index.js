import { useState, useEffect, useContext } from "react";
import { SelectModal } from "../../context/Modal";
import { useSelector } from "react-redux";
import AboutSubModal from "./SubModal/AboutSubModal";
import MembersSubModal from "./SubModal/MembersSubModal";
import { ModalContext } from "../../context/Modal";
import "./ChannelInfoModal.css";

const ChannelInfoModal = ({ subModal }) => {
  const channel = useSelector((state) => state.channel.channel);
  const [isLoaded, setIsLoaded] = useState(false);
  const [localSubModal, setLocalSubModal] = useState(subModal);

  useEffect(() => {
    console.log("CHANNEL INFO RE RENDER");
    if (channel) {
      setIsLoaded(true);
    } else if (!channel) setIsLoaded(false);
  }, []);

  if (!isLoaded) return null;
  return (
    <div id="modal-content" className="info-modal">
      <div className="modal-header">
        <div className="modal-title">
          <div className="modal-title-icon">
            <i class="fa-solid fa-hashtag"></i>
          </div>
          <div className="modal-title-text">{channel.name}</div>
        </div>
        <div className="modal-options">
          <div
            className={`modal-option-1 ${
              localSubModal === "about" ? "active" : ""
            }`}
            onClick={() => setLocalSubModal("about")}
          >
            About
          </div>
          <div
            className={`modal-option-1 ${
              localSubModal === "members" ? "active" : ""
            }`}
            onClick={() => setLocalSubModal("members")}
          >
            Members {channel.userCount}
          </div>
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
