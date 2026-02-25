import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route} from "react-router";
import "./styles/index.css";
//React.lazy()
import App from "./pages/App.jsx";
import SoundGuesser from "./pages/SoundGuesser.jsx";
import FeetGuesser from "./pages/FeetGuesser.jsx";
import MapGuesser from "./pages/MapGuesser.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="sounds" element={<SoundGuesser />} />
        <Route path="feet" element={<FeetGuesser />} />
        <Route path="maps" element={<MapGuesser />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
