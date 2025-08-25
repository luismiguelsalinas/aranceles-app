import { useState } from "react";
import Simulador from "./modules/simulador.jsx";
import Dashboard from "./modules/Dashboard";
import Biblioteca from "./modules/Biblioteca";
// ... importa otros

const NAV = [
  { id: "dashboard", label: "Dashboard", comp: Dashboard },
  { id: "biblioteca", label: "Biblioteca", comp: Biblioteca },
  { id: "simulador", label: "Simulador", comp: Simulador },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const Active = NAV.find(n=>n.id===tab)?.comp;

  return (
    <div className="min-h-screen grid grid-cols-4">
      <aside className="col-span-1 bg-gray-100 p-4">
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} className="block w-full mb-2">{n.label}</button>
        ))}
      </aside>
      <main className="col-span-3 p-4">
        <Active />
      </main>
    </div>
  );
}
