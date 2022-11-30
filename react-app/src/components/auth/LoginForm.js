import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";
import "./LoginForm.css";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const user = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const [redirect, setRedirect] = useState(false);

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    }
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    setErrors([]);
  }, [email, password]);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-container">
      {redirect && <Redirect to="/sign-up" />}
      <header className="login-header">
        <div className="left-col"></div>
        <div className="logo">
          <img src="https://cdn.mos.cms.futurecdn.net/SDDw7CnuoUGax6x9mTo7dd.jpg" />
        </div>
        <div className="create-account-redirect">
          <div className="create-account-hook">New to Transmit?</div>
          <div className="redirect" onClick={() => setRedirect(true)}>
            Create an account
          </div>
        </div>
      </header>
      <div className="login-content-container">
        <div className="login-content">
          <div className="login-title">
            <div className="login-title-text">Sign in to Transmit</div>
            <div className="login-title-subtext">
              We suggest using the{" "}
              <strong>email address you use at work.</strong>
            </div>
          </div>
          <div className="login-sub-content">
            <form onSubmit={onLogin}>
              <div className="errors">
                {errors.map((error, ind) => (
                  <div key={ind}>{error}</div>
                ))}
              </div>
              <div className="login-email-input">
                <label for="email">Email</label>
                <input
                  type="text"
                  name="email"
                  placeholder="name@work-email.com"
                  value={email}
                  onChange={updateEmail}
                ></input>
              </div>
              <div className="login-password-input">
                <label for="password">Password</label>
                <input
                  type="text"
                  name="password"
                  value={password}
                  onChange={updatePassword}
                ></input>
              </div>
              <div className="sign-in-btn">
                <button type="submit">Sign In With Email</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    // <form onSubmit={onLogin}>

    //   <div>
    //     <label htmlFor='email'>Email</label>
    //     <input
    //       name='email'
    //       type='text'
    //       placeholder='Email'
    //       value={email}
    //       onChange={updateEmail}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor='password'>Password</label>
    //     <input
    //       name='password'
    //       type='password'
    //       placeholder='Password'
    //       value={password}
    //       onChange={updatePassword}
    //     />
    //     <button type='submit'>Login</button>
    //   </div>
    // </form>
  );
};

export default LoginForm;
