import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function JoinRequestButton() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate(`/join-requests`);
  };

  return (
    <button
      onClick={handleRedirect}
      className="btn btn-circle btn-md hover:bg-base-300 btn-ghost"
    >
      <UserPlus size={18} />
    </button>
  );
}
