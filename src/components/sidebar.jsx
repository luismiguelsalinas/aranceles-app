//este es el menu lateral 
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, BarChart3, Settings, FileText } from "lucide-react";

// Agrega el apartado "Tipos de Arancel" al menú
const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Tipos de Arancel", path: "/tipos-arancel", icon: FileText },
  { name: "Clasificación", path: "/clasificacion", icon: Package },
  { name: "Simulador", path: "/simulador", icon: Package },
  /*{ name: "Tratados", path: "/tratados", icon: Package },*/
  { name: "Noticias", path: "/noticias", icon: Package },
  { name: "Control de Paquetes", path: "/paquetes", icon: Package },
  { name: "Reportes", path: "/reportes", icon: BarChart3 },
  { name: "Configuración", path: "/configuracion", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-zinc-900 text-white flex flex-col p-4">
      <h1 className="text-xl font-bold mb-6">AduanasApp</h1>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-zinc-700 text-white font-semibold"
                  : "hover:bg-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
