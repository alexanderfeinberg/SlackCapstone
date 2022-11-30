import "./ChatInputText.css";

const ChatInputText = ({ setUserMessage, userMessage, channelName }) => {
  return (
    <textarea
      value={userMessage}
      placeholder={`Message #${channelName}`}
      onChange={(e) => setUserMessage(e.target.value)}
    />
  );
};

export default ChatInputText;
