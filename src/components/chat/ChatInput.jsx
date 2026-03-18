import { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatInput = ({ socket, classId, user }) => {
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      classId,
      senderId: user._id,
      text,
    });

    socket.emit("stopTyping", { classId });
    setText("");
  };

  return (
    <div className="p-3 bg-base-100 border-t border-base-300 flex items-center gap-2">
      {/* INPUT WRAPPER */}
      <div className="flex-1 flex items-center bg-base-200 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary transition">
        <input
          type="text"
          placeholder="Type a message..."
          className="bg-transparent flex-1 outline-none text-sm sm:text-base"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("typing", {
              classId,
              userName: user.name,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
      </div>

      {/* SEND BUTTON */}
      <button
        onClick={sendMessage}
        disabled={!text.trim()}
        className="btn btn-primary btn-circle shadow-md 
        hover:scale-105 active:scale-95 transition"
      >
        <IoSend size={18} />
      </button>
    </div>
  );
};

export default ChatInput;
