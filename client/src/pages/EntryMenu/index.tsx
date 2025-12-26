import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import DarkModeToggle from "../../components/DarkModeToggle";
import routePaths from "../../utils/routePaths";

export default function EntryMenu() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">Games</div>
        <DarkModeToggle />
      </div>

      <div className="grid gap-4">
        <Card onClick={() => navigate(routePaths.createRoom)}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Room Games</div>
            <Button variant="primary">Create Room</Button>
          </div>
        </Card>

        <Card onClick={() => navigate(routePaths.soloGames)}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Solo Games</div>
            <Button variant="primary">Open</Button>
          </div>
        </Card>

        <Card onClick={() => navigate(routePaths.join)}>
          <div className="flex items-center justify-between">
            <div className="font-medium">Join Game Room</div>
            <Button variant="primary">Join</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
