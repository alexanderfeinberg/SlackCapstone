import "./ChatInputText.css";

const ChatInputText = ({ setUserMessage, userMessage }) => {
  return (
    <textarea
      value={userMessage}
      onChange={(e) => setUserMessage(e.target.value)}
    />
  );
};

export default ChatInputText;
