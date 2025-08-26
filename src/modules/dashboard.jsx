import LinkExt from "../components/linkext.jsx";
import { GraficoTipos, GraficoRango } from "./GraficoDashboard"; // Ajusta la ruta

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución ilustrativa */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">Distribución de tipos (ilustrativa)</h3>
          <GraficoTipos />
        </div>
        {/* Rango legal */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">Rango legal (0–40% ad valorem)</h3>
          <GraficoRango />
        </div>
      </div>
      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-semibold">Accesos rápidos</h3>
        <ul className="list-disc pl-6">
          <li>
            <LinkExt href="https://muisca.dian.gov.co/WebArancel/DefMenuConsultas.faces">
              Consulta Arancelaria DIAN
            </LinkExt>
          </li>
          <li>
            <LinkExt href="https://www.mincit.gov.co/mincomercioexterior/como-importar-a-colombia">
              Guía MinCIT – Importar a Colombia
            </LinkExt>
          </li>
          <li>
            <LinkExt href="https://arancel.legis.com.co">
              Arancel – Legis
            </LinkExt>
          </li>
        </ul>
      </div>
    </div>
  );
}
