import { useEffect, useState, useContext } from "react";
import { editChannelThunk } from "../../store/channels";
import { useDispatch, useSelector } from "react-redux";
import { ActionModalContext } from "../../context/ActionModals";
import "./EditChannelModal.css";
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
  const [errors, setErrors] = useState([]);

  const channel = useSelector((state) => state.channel.channel);

  useEffect(() => {
    if (channel) {
      console.log(editContent);
      setEditContent(channel[data.placeholder]);

      setIsLoaded(true);
      console.log(editContent);
    }
  }, [channel, subActionModalType]);

  useEffect(() => setErrors([]), [editContent]);

  const closeActionModalHandler = () => {
    setActionModalType(null);
  };

  const submitHandler = async () => {
    const editedChannel = {
      name: data.placeholder === "name" ? editContent : channel.name,
      description:
        data.placeholder === "description" ? editContent : channel.description,
    };
    try {
      await dispatch(editChannelThunk(channel.id, editedChannel));
    } catch (e) {
      const errData = await e.json();
      console.log(errData);
      setErrors(errData.errors);
      return;
    }
    setActionModalType(null);
  };

  if (!isLoaded) return null;
  return (
    <div id="action-modal-content">
      <div className="action-modal-title">
        <div className="action-modal-title-text">{data.title}</div>
      </div>
      <div className="errors">
        {errors.map((err, indx) => (
          <div key={indx}>{err}</div>
        ))}
      </div>
      {data.subTitle && (
        <div className="action-modal-subtitle">{data.subTitle}</div>
      )}
      <div className={`action-edit-input action-modal-${data.placeholder}`}>
        {data.subTitle && <i class="fa-solid fa-hashtag"></i>}
        {!data.subTitle && (
          <textarea
            value={editContent}
            placeholder="Add a description"
            onChange={(e) => setEditContent(e.target.value)}
          ></textarea>
        )}

        {data.subTitle && (
          <input
            type="text"
            value={editContent}
            placeholder={`${
              data.subTitle ? "# e.g. marketing" : "Add a description"
            }`}
            onChange={(e) => setEditContent(e.target.value)}
          ></input>
        )}
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
