import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useContext } from "react";
import { ActionModalContext } from "../../../context/ActionModals";
import { removeChannelSubThunk } from "../../../store/channels";
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
  const channel = useSelector((state) => state.channel.channel);

  const { setActionModalType } = useContext(ActionModalContext);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (channel) {
      setIsLoaded(true);
      const date = new Date(channel.createdAt);
      month = months[date.getMonth()];
      day = date.getDay();
      year = date.getFullYear();
    }
  }, [channel]);

  const handleRemoveSubscription = async () => {
    await dispatch(removeChannelSubThunk(channel.id));
  };
  return (
    <div className="sub-modal-inner-content">
      <div className="sub-modal-item">
        <div className="sub-modal-item-title">
          <div className="sub-modal-title-content">Description</div>
          <div className="sub-modal-title-edit">
            <button
              onClick={() => {
                setActionModalType("editChannel");
              }}
            >
              Edit
            </button>
          </div>
        </div>
        <div classNAme="sub-modal-item-content">{channel.description}</div>
      </div>
      <div className="sub-modal-item">
        <div className="sub-modal-item-title">Created By</div>
        <div classNAme="sub-modal-item-content">
          {channel.ownerId} on {month} {day}, {year}
        </div>
      </div>
      <div className="sub-modal-action-btns">
        <button onClick={handleRemoveSubscription}>Leave Channel</button>
      </div>
    </div>
  );
};

export default AboutSubModal;
