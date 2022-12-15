import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const WorkspaceName = ({ props }) => {
  const history = useHistory();
  const { companyName, setCompanyName } = props;
  const [errors, setErrors] = useState("");

  useEffect(() => {
    if (companyName.length > 150) {
      setErrors(["Company name must be between 1 and 150 characters."]);
      return;
    }
    setErrors([]);
  }, [companyName]);

  const nextBtnHandler = () => {
    history.push("/setup-channels");
    return;
  };
  return (
    <div className="workspace-name-container">
      <div className="step-count">Step 1/2</div>
      <div className="action-title-container">
        <div className="action-title">
          <h3>What’s the name of your company or team?</h3>
        </div>
      </div>
      <div className="action-subtitle">
        <div className="action-subtitle-text"></div>This will be the name of
        your Slack workspace — choose something that your team will recognize.
      </div>
      <div className="company-name-input">
        <input
          type="text"
          placeholder="Ex: Acme Marketing or Acme Co"
          value={companyName}
          onChange={(e) => {
            setCompanyName(e.target.value);
          }}
        ></input>
      </div>
      <div className="company-name-submit">
        <button
          disabled={companyName.length < 1 ? true : false}
          onClick={nextBtnHandler}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WorkspaceName;
