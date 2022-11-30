import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import "./LoginForm.css";

let data;

const AuthStructure = ({ type }) => {
  switch (type) {
    case "login":
      data = {
        redirect: {
          type: "login",
          text: "New to Transmit?",
          redirectText: "Create an account",
        },
        titleText: "Sign in to Transmit",
        redirectPath: "/sign-up",
        content: () => <LoginForm />,
      };
      break;
    case "signup":
      data = {
        redirect: {
          type: "signup",
          text: "Already using Transmit?",
          redirectText: "Sign in to an existing workspace",
        },
        titleText: "Join Transmit",
        redirectPath: "/login",
        content: () => <SignUpForm />,
      };
      break;
  }
  const user = useSelector((state) => state.session.user);

  if (user) {
    return <Redirect to="/workspaces/1" />;
  }

  return (
    <div className="login-container">
      <header className="login-header">
        <div className="left-col"></div>
        <div className="logo">
          <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" />
        </div>
        {type === "login" && (
          <div className="create-account-redirect">
            <div className="create-account-hook">{data.redirect.text}</div>
            <Link className="redirect" to={data.redirectPath}>
              {data.redirect.redirectText}
            </Link>
          </div>
        )}
      </header>
      <div className="login-content-container">
        <div className="login-content">
          <div className="login-title">
            <div className="login-title-text">{data.titleText}</div>
            <div className="login-title-subtext">
              We suggest using the{" "}
              <strong>email address you use at work.</strong>
            </div>
          </div>
          <div className="login-sub-content">{data.content()}</div>
        </div>
        {type === "signup" && (
          <div className="login-content-footer">
            <div className="login-redirect">
              <div className="create-account-hook">{data.redirect.text}</div>
              <Link className="redirect" to={data.redirectPath}>
                {data.redirect.redirectText}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthStructure;
