export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumen</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución ilustrativa */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">Distribución de tipos</h3>
          <div className="h-40 flex items-center justify-center">
            <p>📊 Gráfico ilustrativo</p>
          </div>
        </div>

        {/* Rango legal */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h3 className="font-semibold">Rango legal (0–40%)</h3>
          <div className="h-40 flex items-center justify-center">
            <p>📈 Gráfico de barras</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="font-semibold">Accesos rápidos</h3>
        <ul className="list-disc pl-6">
          <li><a href="#" className="text-blue-600">Consulta Arancelaria DIAN</a></li>
          <li><a href="#" className="text-blue-600">Guía MinCIT</a></li>
          <li><a href="#" className="text-blue-600">Arancel – Legis</a></li>
        </ul>
      </div>
    </div>
  );
}
