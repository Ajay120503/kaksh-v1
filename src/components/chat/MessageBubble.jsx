import { useState } from "react";
import { deleteMessage, editMessage } from "../../services/messageService";
import { BsThreeDotsVertical } from "react-icons/bs";

const MessageBubble = ({ msg, user, socket }) => {
  const isMe = msg.sender?._id === user._id || msg.sender === user._id;

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(msg.text);

  const handleDelete = async () => {
    await deleteMessage(msg._id);

    socket.emit("deleteMessage", {
      messageId: msg._id,
      classId: msg.classId,
    });
  };

  const handleEdit = async () => {
    await editMessage(msg._id, text);

    socket.emit("editMessage", {
      messageId: msg._id,
      newText: text,
      classId: msg.classId,
    });

    setEditing(false);
  };

  return (
    <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
      {/* AVATAR (UNCHANGED) */}
      <div className="chat-image avatar placeholder">
        <div
          className={`${
            isMe ? "bg-primary" : "bg-secondary"
          } text-primary-content rounded-full w-10 h-10
          flex items-center justify-center text-sm font-bold shadow-md`}
        >
          {(() => {
            const name = msg.sender?.name || "";
            const parts = name.trim().split(" ").filter(Boolean);

            if (parts.length === 0) return "U";
            if (parts.length === 1) return parts[0][0].toUpperCase();

            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          })()}
        </div>
      </div>

      {/* HEADER */}
      <div className="chat-header text-xs opacity-60 flex gap-1">
        <div className=" flex flex-col">
          <div>{msg.sender?.name}</div>
          <div>
            <span>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <div>{msg.isEdited && <span className="italic">(edited)</span>}</div>
      </div>

      {/* BUBBLE WRAPPER */}
      <div className="relative group w-fit max-w-[75%] sm:max-w-[60%]">
        {/* BUBBLE (UNCHANGED STYLE + FIXED TEXT WRAP) */}
        <div
          className={`chat-bubble ${
            isMe ? "chat-bubble-primary" : "chat-bubble-secondary"
          } shadow-md whitespace-pre-wrap break-normal`}
        >
          {msg.isDeleted ? (
            <i>Message deleted</i>
          ) : editing ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="input input-sm w-full text-neutral outline-0"
            />
          ) : (
            msg.text
          )}
        </div>

        {isMe && !msg.isDeleted && (
          <div className="absolute -top-2 right-0 opacity-0 group-hover:opacity-100 transition">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle">
                <BsThreeDotsVertical size={14} />
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content z-20 menu p-2 shadow-lg 
                bg-base-100 rounded-box w-32"
              >
                {!editing ? (
                  <>
                    <li>
                      <button onClick={() => setEditing(true)}>Edit</button>
                    </li>
                    <li>
                      <button onClick={handleDelete} className="text-error">
                        Delete
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button onClick={handleEdit} className="text-success">
                      Save
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
