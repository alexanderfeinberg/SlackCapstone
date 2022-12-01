import "./ChatInputText.css";

const ChatInputText = ({
  setUserMessage,
  userMessage,
  channelName,
  errors,
}) => {
  return (
    <>
      <textarea
        value={userMessage}
        placeholder={`Message #${channelName}`}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <div className="support-data">
        <div className={`char-count ${userMessage.length >= 500 ? "red" : ""}`}>
          {500 - userMessage.length}
        </div>
        {errors && (
          <div className="errors">
            {errors.map((err, idx) => (
              <div key={idx}>{err}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ChatInputText;
