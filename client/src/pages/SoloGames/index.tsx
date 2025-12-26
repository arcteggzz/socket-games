import routePaths from "../../utils/routePaths";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

export default function SoloGames() {
  const navigate = useNavigate();

  return (
    <div className="text-center text-lg">
      <div>solo games list</div>

      <Button variant="primary" onClick={() => navigate(routePaths.root)}>
        Back
      </Button>
    </div>
  );
}
