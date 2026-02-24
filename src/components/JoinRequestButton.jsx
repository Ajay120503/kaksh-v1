import { useNavigate } from "react-router-dom";
import { FaUserClock } from "react-icons/fa";

export default function JoinRequestButton() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/join-requests`);
  };

  return (
    <button
      onClick={handleRedirect}
      className="btn btn-circle btn-md btn-secondary"
    >
      <FaUserClock size={18} />
    </button>
  );
}
