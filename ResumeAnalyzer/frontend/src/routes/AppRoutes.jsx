import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Analyze from "../pages/Analyze";
import Results from "../pages/Results";
import History from "../pages/History";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/analyze" element={<Analyze />} />

      <Route path="/results/:id" element={<Results />} />

      <Route path="/history" element={<History />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;