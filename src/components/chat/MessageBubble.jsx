import { useState } from "react";
import { deleteMessage, editMessage } from "../../services/messageService";
import { IoIosArrowDown } from "react-icons/io";

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
    if (!text.trim()) return;

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
      {/* AVATAR */}
      <div className="chat-image avatar placeholder">
        <div
          className={`${
            isMe ? "bg-primary" : "bg-secondary"
          } text-primary-content rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md`}
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
      <div className="chat-header text-xs opacity-60 flex gap-1 items-center">
        <div className="flex flex-col">
          <span>{msg.sender?.name}</span>
          <span>
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        {msg.isEdited && <span className="italic">(edited)</span>}
      </div>

      {/* BUBBLE */}
      <div className="relative group w-fit max-w-[75%] sm:max-w-[60%]">
        <div
          className={`chat-bubble p-1 ${
            isMe ? "chat-bubble-primary" : "chat-bubble-secondary"
          } shadow-md whitespace-pre-wrap break-words space-y-1`}
        >
          {msg.isDeleted ? (
            <i>Message deleted</i>
          ) : editing ? (
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEdit();
              }}
              className="input input-sm w-full text-neutral outline-0"
              autoFocus
            />
          ) : (
            <>
              {/* TEXT */}
              {msg.type === "text" && <p>{msg.text}</p>}

              {/* IMAGE */}
              {msg.type === "image" && msg.fileUrl && (
                <div className="mt-1 overflow-hidden rounded-lg">
                  <img
                    src={msg.fileUrl}
                    alt="sent"
                    onClick={() => window.open(msg.fileUrl, "_blank")}
                    className="w-full h-auto max-h-64 object-cover cursor-pointer"
                  />
                </div>
              )}

              {/* FILE */}
              {msg.type === "file" && msg.fileUrl && (
                <a
                  href={msg.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-base-content gap-2 mt-1 bg-base-200 px-3 py-2 rounded-lg hover:bg-base-300 transition"
                >
                  <span className="truncate max-w-37.5">
                    {msg.fileUrl.split("/").pop()}
                  </span>
                </a>
              )}
            </>
          )}
        </div>

        {/* ACTION MENU */}
        {isMe && !msg.isDeleted && (
          <div className="absolute -top-2 right-0 transition">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-xs btn-circle">
                <IoIosArrowDown size={14} />
              </label>

              <ul className="dropdown-content z-20 menu p-2 shadow-lg bg-base-100 rounded-box w-32">
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
