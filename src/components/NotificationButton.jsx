import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../services/notificationService";

export default function NotificationButton() {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  const fetchCount = async () => {
    try {
      const unread = await getUnreadCount();
      setCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCount();

    const interval = setInterval(fetchCount, 600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => navigate("/notifications")}
      className="relative p-2 btn btn-outline btn-primary rounded-full"
    >
      <Bell size={22} />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
