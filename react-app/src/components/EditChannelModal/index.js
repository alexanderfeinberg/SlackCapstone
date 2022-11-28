import { useEffect, useState, useContext } from "react";
import { editChannelThunk } from "../../store/channels";
import { useDispatch, useSelector } from "react-redux";
import { ActionModalContext } from "../../context/ActionModals";
let data;

const EditChannelModal = ({ actionType }) => {
  switch (actionType) {
    case "channelName":
      data = {
        title: "Rename this channel",
        divClass: "channelName",
        subTitle: "Channel name",
        maxLength: 80,
        placdeholder: "name",
      };
    case "channelDescription":
      data = {
        title: "Edit description",
        divClass: "channelDescription",
        placeholder: "description",
      };
  }

  const dispatch = useDispatch();

  const [editContent, setEditContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const { setActionModalType } = useContext(ActionModalContext);

  const channel = useSelector((state) => state.channel.channel);

  useEffect(() => {
    if (channel) {
      setEditContent(channel[data.placeholder]);
      setIsLoaded(true);
    }
  }, [channel]);

  const closeActionModalHandler = () => {
    setActionModalType(null);
  };

  const submitHandler = async () => {
    const editedChannel = {
      name: data.placeholder === "name" ? editContent : channel.name,
      description:
        data.placeholder === "description" ? editContent : channel.description,
    };
    await dispatch(editChannelThunk(channel.id, editedChannel));
    setActionModalType(null);
  };

  if (!isLoaded) return null;
  return (
    <div id="action-modal-content">
      <div className="action-modal-title">
        <h1>{data.title}</h1>
      </div>
      {data.subTitle && (
        <div className="action-modal-subtitle">{data.subTitle}</div>
      )}
      <div className="action-edit-input">
        <input
          type="text"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        ></input>
      </div>
      <div className="action-modal-btns">
        <div className="action-modal-cancel-btn">
          <button onClick={closeActionModalHandler}>Cancel</button>
        </div>
        <div className="action-modal-submit-btn">
          <button onClick={submitHandler}>Save changes</button>
        </div>
      </div>
    </div>
  );
};

export default EditChannelModal;
