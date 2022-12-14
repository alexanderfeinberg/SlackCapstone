import "./SplashPage.css";
import { Link } from "react-router-dom";

const SplashPage = () => {
  return (
    <div className="splash-body">
      <div className="header-columns-container">
        <div className="banner resize-body">
          <div className="left-col">
            <div className="splash-header-container">
              <div className="header-text">
                <div className="header-text-white">
                  <h1>
                    Great teamwork starts with a{" "}
                    <span className="header-text-gold">digital HQ</span>
                  </h1>
                </div>
              </div>
              <div className="header-subtext">
                With all your people, tools and communication in one place, you
                can work faster and more flexibly than ever before.
              </div>
              <div className="splash-action-btns">
                <Link to="/login" className="sign-up-email">
                  Sign in with email
                </Link>

                <Link to="/sign-up" className="try-for-free">
                  Try for free
                </Link>
              </div>
              <div className="slogan">
                <strong>Transmit is free to try</strong> for as long as you’d
                like
              </div>
            </div>
          </div>
          <div className="right-col">
            <div className="show-animation">
              <video
                muted
                loop="true"
                autoplay="autoplay"
                src="https://a.slack-edge.com/9689dea/marketing/img/homepage/e2e-prospects/animations/webm/hero-product-ui.webm"
                class="slider"
              ></video>
            </div>
          </div>
        </div>
      </div>
      <div className="container-content">
        <div className="splash-content resize-body">
          <div className="trusted-container">
            <div className="trusted-text">
              Trusted by companies all over the world
            </div>
            <div className="trusted-logo">
              <div className="img-container">
                <img src="https://a.slack-edge.com/e2fa17/marketing/img/logos/company/_color/airbnb-logo.png" />
              </div>

              <div className="img-container">
                <img src="https://a.slack-edge.com/5ae14bf/marketing/img/logos/company/_color/logo-nasa.png" />
              </div>
              <div className="img-container">
                <img src="https://a.slack-edge.com/ce67d/marketing/img/logos/company/_color/uber.png" />
              </div>
              <div className="img-container">
                <img src="https://a.slack-edge.com/80588/marketing/img/logos/company/_color/target-logo.png" />
              </div>
              <div className="img-container">
                <img src="https://a.slack-edge.com/044f5db/marketing/img/logos/company/_color/nyt.png" />
              </div>
              <div className="img-container">
                <img src="https://a.slack-edge.com/1e38e34/marketing/img/logos/company/logo-etsy.png" />
              </div>
            </div>
          </div>
        </div>
        <div className="item-container">
          <div className="item-columns">
            <div className="item-row">
              <video
                autoplay="autoplay"
                muted
                loop="true"
                src="https://a.slack-edge.com/9436a9f/marketing/img/homepage/e2e-prospects/animations/webm/connectedness.webm"
              ></video>
              <div className="item-content">
                <div className="item-content-header">
                  <h1>Choose how you want to work</h1>
                </div>
                <div className="item-content-subtext">
                  In Transmit, you've got all the flexibility to work when,
                  where and how it's best for you. You can easily chat, send
                  audio and video clips, or hop on a huddle to talk things out
                  live.
                </div>
              </div>
            </div>
            <div className="item-row">
              <div className="item-content">
                <div className="item-content-header">
                  <h1>Bring your team together</h1>
                </div>
                <div className="item-content-subtext">
                  At the heart of Transmit are channels: organized spaces for
                  everyone and everything you need for work. In channels, it’s
                  easier to connect across departments, offices, time zones and
                  even other companies.
                </div>
              </div>
              <video
                src="https://a.slack-edge.com/9436a9f/marketing/img/homepage/e2e-prospects/animations/webm/flexibility.webm"
                autoplay="autoplay"
                loop="true"
                muted
              ></video>
            </div>
            <div className="item-row">
              <video
                autoplay="autplay"
                muted
                loop="true"
                src="https://a.slack-edge.com/221d25b/marketing/img/homepage/e2e-prospects/animations/webm/speed.webm"
              />
              <div className="item-content">
                <div className="item-content-header">
                  <h1>Move faster with your tools in one place</h1>
                </div>
                <div className="item-content-subtext">
                  With your other work apps connected to Transmit, you can work
                  faster by switching tabs less. And with powerful tools like
                  Workflow Builder, you can automate away routine tasks.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="section-3">
          <div className="section-3-content">
            <h1>Welcome to your new digital HQ</h1>
            <div className="section-3-btns signin-buttons">
              <a className="login-auth section3-btn" href="/login">
                Sign In
              </a>
              <a className="signup-auth section3-btn" href="/sign-up">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;
