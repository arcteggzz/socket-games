import { Route, Routes, useLocation } from "react-router-dom";
import EntryMenu from "./pages/EntryMenu";
import CreateRoom from "./pages/CreateRoom";
import SoloGames from "./pages/SoloGames";
import JoinGame from "./pages/JoinGame";
import Master from "./pages/Master";
import Waiting from "./pages/Waiting";
import routePaths from "./utils/routePaths";

function App() {
  const location = useLocation();

  return (
    <div className="screen">
      <div className="container">
        <Routes location={location} key={location.pathname}>
          <Route path={routePaths.root} element={<EntryMenu />} />
          <Route path={routePaths.createRoom} element={<CreateRoom />} />
          <Route path={routePaths.soloGames} element={<SoloGames />} />
          <Route path={routePaths.join} element={<JoinGame />} />
          <Route path={routePaths.master} element={<Master />} />
          <Route path={routePaths.waiting} element={<Waiting />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
