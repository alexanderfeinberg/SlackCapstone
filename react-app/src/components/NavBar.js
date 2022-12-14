import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import LogoutButton from "./auth/LogoutButton";

import "./NavBar.css";

const NavBar = () => {
  const user = useSelector((state) => state.session.user);
  return (
    <nav>
      <div className="nav-container resize-body">
        <div className="left-links">
          <div className="logo-text">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png" />
            <div className="logo-a-btn">
              <NavLink to="/" exact={true} className="home-logo">
                Transmit
              </NavLink>
            </div>
          </div>
          <div>
            <a
              href="https://github.com/alexanderfeinberg/SlackCapstone"
              target="_blank"
            >
              Github
            </a>
          </div>
          <div>
            <a
              href="https://www.linkedin.com/in/alex-feinberg/"
              target="_blank"
            >
              Linkedin
            </a>
          </div>
        </div>
        <div className="right-links">
          <NavLink className="login-auth" to="/login" exact={true}>
            Sign in
          </NavLink>
          <NavLink className="signup-auth" to="/sign-up">
            Try for free
          </NavLink>

          {user && <LogoutButton />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
