import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { ActionModalContext } from "../../../context/ActionModals";
import { useHistory, Redirect } from "react-router-dom";
import { ModalContext } from "../../../context/Modal";

import {
  removeChannelSubThunk,
  deleteChannelThunk,
} from "../../../store/channels";
let month;
let day;
let year;

const months = {
  0: "January",
  1: "Febuary",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const AboutSubModal = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  console.log("HISTORY ", history);

  const channel = useSelector((state) => state.channel.channel);
  const user = useSelector((state) => state.session.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const { setActionModalType, setSubActionModalType } =
    useContext(ActionModalContext);
  const { setModalType } = useContext(ModalContext);

  const [isLoaded, setIsLoaded] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (channel) {
      const date = new Date(channel.createdAt);
      month = months[date.getMonth()];
      day = date.getDate();

      year = date.getFullYear();

      setIsLoaded(true);
    }
  }, [channel]);

  const handleRemoveSubscription = async () => {
    setIsLoaded(false);
    await dispatch(removeChannelSubThunk(channel.id));

    setModalType(null);
    history.push(`/workspaces/${workspace.id}/channels`);
  };

  const handleChannelDelete = () => {
    setIsLoaded(false);

    dispatch(deleteChannelThunk(channel.id))
      .then(() => {
        setModalType(null);
        setRedirect(true);
        history.push(`/workspaces/${workspace.id}/channels`);
      })
      .catch((e) => e.json())
      .then((res) => console.log(res))

      .catch((e) => console.log("ERROR ", e));
  };

  if (!isLoaded) return null;
  return (
    <div className="sub-modal-inner-content">
      {redirect && <Redirect to={`/workspaces/${workspace.id}`} />}
      <div className="sub-modal-item">
        <div className="sub-modal-item-title">
          <div className="sub-modal-title-content">Channel name</div>
          <div className="sub-modal-title-edit">
            <button
              onClick={() => {
                setActionModalType("editChannel");
                setSubActionModalType("channelName");
              }}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="sub-modal-item-content">{channel.name}</div>
      </div>
      <div className="sub-modal-item">
        <div className="sub-modal-item-title">
          <div className="sub-modal-title-content">Description</div>
          <div className="sub-modal-title-edit">
            <button
              onClick={() => {
                setActionModalType("editChannel");
                setSubActionModalType("channelDescription");
              }}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="sub-modal-item-content">{channel.description}</div>
      </div>
      <div
        className={`sub-modal-item ${
          !channel.currentUserSubscribed ? "last-item" : ""
        }`}
      >
        <div className="sub-modal-item-title">Created By</div>
        <div className="sub-modal-item-content date">
          {channel.ownerId.firstName} {channel.ownerId.lastName} on {month}{" "}
          {day}, {year}
        </div>
      </div>
      {channel.currentUserSubscribed && (
        <div
          className={`sub-modal-item ${
            channel.ownerId.id !== user.id ? "last-item" : ""
          }`}
        >
          <div
            className="sub-modal-item-title red-btn"
            onClick={handleRemoveSubscription}
          >
            Leave Channel
          </div>
        </div>
      )}
      {channel.ownerId.id === user.id && (
        <div className="sub-modal-item last-item">
          <div
            className="sub-modal-item-title red-btn"
            onClick={handleChannelDelete}
          >
            Delete channel
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSubModal;
