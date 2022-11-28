import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createChannelThunk } from "../../store/channels";
import { ModalContext } from "../../context/Modal";

const AddChannelModal = () => {
  const { setModalType } = useContext(ModalContext);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const workspace = useSelector((state) => state.workspace.workspace);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("WORKSPACE ID", workspace.id);
    const newChannel = {
      name,
      description,
    };

    dispatch(createChannelThunk(workspace.id, newChannel)).catch((e) =>
      console.log("ERROR ", e, e.status)
    );
    // setModalType(null);
  };

  useEffect(() => {
    if (workspace) {
      setIsLoaded(true);
    }
  }, [workspace]);

  if (!isLoaded) return null;

  return (
    <div id="modal-content">
      <div className="modal-title header">
        <h1>Create a channel</h1>
      </div>
      <div className="modal-content-items">
        <form onSubmit={handleSubmit}>
          <div className="modal-content-item">
            <div className="modal-content-item-header">Name</div>
            <div className="modal-content-item-input">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="modal-content-item">
            <div className="modal-content-item-header">Description</div>
            <div className="modal-content-item-input">
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="submit-btn">
            <button type="submit">Create channel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChannelModal;
