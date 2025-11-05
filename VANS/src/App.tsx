import { Routes, Route, BrowserRouter } from "react-router-dom";
import Sidebar, { Topbar } from "./components/layout/Sidebar";
import { FiltersProvider } from "./lib/filters";
import Overview from "./pages/Overview";
import Audience from "./pages/Audience";
import Demographics from "./pages/Demographics";
import Terms from "./pages/Terms";
import Geography from "./pages/Geography";
import Influencers from "./pages/Influencers";
import Events from "./pages/Events";

export default function App() {
  return (
    <BrowserRouter>
      <FiltersProvider>
        <div className="flex">
          <Sidebar />
          <div className="flex-1 min-h-screen ml-64">
            <Topbar />
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/audience" element={<Audience />} />
              <Route path="/demographics" element={<Demographics />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/influencers" element={<Influencers />} />
              <Route path="/events" element={<Events />} />
            </Routes>
          </div>
        </div>
      </FiltersProvider>
    </BrowserRouter>
  );
}
