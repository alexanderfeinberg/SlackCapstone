import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/session";

const LoginForm = () => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   setErrors([]);
  // }, [email, password]);

  const onLogin = async (e, demo) => {
    if (!demo) e.preventDefault();
    console.log("email ", email);
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

  return (
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
          type="password"
          name="password"
          value={password}
          onChange={updatePassword}
        ></input>
      </div>
      <div className="auth-btn">
        <button type="submit">Sign In With Email</button>
      </div>
      <div className="auth-btn">
        <button
          onClick={(e) => {
            setEmail("demo1@gmail.com");
            setPassword("password");
            if (email && password) onLogin(e, true);
          }}
        >
          Demo User
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
