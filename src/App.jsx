import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar.jsx";
import Dashboard from "./modules/Dashboard.jsx";
import TiposArancel from "./modules/tiposarancel.jsx";
//import Clasificacion from "./pages/Clasificacion";
import Configuracion from "./modules/Configuracion.jsx";
import Reportes from "./modules/reportes.jsx";
import Simulador from "./modules/simulador.jsx";
import Card from "./components/card.jsx";
import Stat from "./components/stat.jsx";
import Badge from "./components/badge.jsx";
import LinkExt from "./components/linkext.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex h-screen bg-zinc-100 dark:bg-zinc-950">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tipos-arancel" element={<TiposArancel />} />
            <Route path="/card" element={<Card />} />
            <Route path="/stat" element={<Stat />} />
            <Route path="/badge" element={<Badge />} />
            <Route path="/link-ext" element={<LinkExt />} />
            {/* <Route path="/clasificacion" element={<Clasificacion />} /> */}
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/simulador" element={<Simulador />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
