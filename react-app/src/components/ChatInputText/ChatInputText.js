import "./ChatInputText.css";
import Errors from "../Errors/Errors";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const ChatInputText = ({
  setUserMessage,
  userMessage,
  channelName,
  errors,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const channel = useSelector((state) => state.channel.channel);

  useEffect(() => {
    if (channel) setIsLoaded(true);
  }, [channel]);

  if (!isLoaded) return null;
  return (
    <>
      <textarea
        value={userMessage}
        placeholder={`Message ${channelName}`}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <div className="support-data">
        <div className={`char-count ${userMessage.length >= 500 ? "red" : ""}`}>
          {500 - userMessage.length}
        </div>
        {/* {errors && (
          <div className="errors">
            {errors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div>
        )} */}
        {errors && errors.length > 0 && <Errors errors={errors} />}
      </div>
    </>
  );
};

export default ChatInputText;
