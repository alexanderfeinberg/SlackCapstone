import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChannelThunk } from "../../store/channels";
import { useHistory } from "react-router-dom";
import { ModalContext } from "../../context/Modal";
import "./AddChannelModal.css";
import Errors from "../Errors/Errors";

const AddChannelModal = () => {
  const history = useHistory();

  const { setModalType } = useContext(ModalContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState([]);

  const workspace = useSelector((state) => state.workspace.workspace);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("WORKSPACE ID", workspace.id);
    const newChannel = {
      name,
      description,
    };

    let newChannelResp;

    try {
      newChannelResp = await dispatch(
        createChannelThunk(workspace.id, newChannel)
      );
    } catch (e) {
      const errorData = await e.json();
      console.log("CAUGHT ERR ", errorData);
      setErrors(errorData.errors);
      return;
    }
    setModalType(null);
    history.push(
      `/workspaces/${workspace.id}/channels/${newChannelResp.Channel.id}`
    );
  };

  useEffect(() => {
    if (workspace) {
      setIsLoaded(true);
    }
  }, [workspace]);

  useEffect(() => {
    if (!name) {
      setErrors(["Don't forget to name your channel!"]);
    } else if (name) {
      setErrors([]);
    }
  }, [name, description]);

  if (!isLoaded) return null;

  return (
    <div id="modal-content" className="info-modal">
      <div className="modal-sub-content">
        <div className="modal-title">Create a channel</div>
        <div className="modal-subtitle">
          Channels are where your team communicates
        </div>
        <div className="modal-content-items">
          {/* <div className="errors">
            {errors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div> */}
          {errors.length > 0 && <Errors errors={errors} />}
          <form onSubmit={handleSubmit}>
            <div className="modal-content-item">
              <div className="modal-content-item-header">Name</div>
              <div
                id="create-channel-name-input"
                className={`action-edit-input action-modal-name`}
              >
                <i class="fa-solid fa-hashtag"></i>
                <input
                  type="text"
                  value={name}
                  placeholder="e.g. Marketing"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="modal-content-item">
              <div className="modal-content-item-header">
                Description
                <div className="modal-content-item-header-support">
                  (optional)
                </div>
              </div>
              <div className="modal-content-item-input">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="submit-btn">
              <button type="submit" disabled={errors.length ? true : false}>
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddChannelModal;
