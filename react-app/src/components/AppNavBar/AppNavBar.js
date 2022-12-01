import LogoutButton from "../auth/LogoutButton";
import "./AppNavBar.css";

const AppNavBar = () => {
  return (
    <div className="app-nav">
      <div className="app-nav-container">
        <div className="app-nav-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png" />
        </div>
        <div className="logout-btn">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default AppNavBar;
