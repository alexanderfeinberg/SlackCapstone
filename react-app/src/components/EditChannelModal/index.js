import { useEffect, useState, useContext } from "react";
import { editChannelThunk } from "../../store/channels";
import { useDispatch, useSelector } from "react-redux";
import { ActionModalContext } from "../../context/ActionModals";
let data;

const EditChannelModal = () => {
  const { setActionModalType, subActionModalType } =
    useContext(ActionModalContext);
  console.log("SUB ACTION TYPE ", subActionModalType);
  switch (subActionModalType) {
    case "channelName":
      console.log("HEREEE");
      data = {
        title: "Rename this channel",
        divClass: "channelName",
        subTitle: "Channel name",
        maxLength: 80,
        placeholder: "name",
      };
      break;

    case "channelDescription":
      console.log("subActionModalType");
      data = {
        title: "Edit description",
        divClass: "channelDescription",
        placeholder: "description",
      };
      break;
  }

  console.log("DATA ", data);

  const dispatch = useDispatch();

  const [editContent, setEditContent] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const channel = useSelector((state) => state.channel.channel);

  useEffect(() => {
    if (channel) {
      console.log(editContent);
      setEditContent(channel[data.placeholder]);

      setIsLoaded(true);
      console.log(editContent);
    }
  }, [channel, subActionModalType]);

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
