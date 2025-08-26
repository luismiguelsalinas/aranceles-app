// TIPOS_ARANCEL: Array con la información de cada tipo de arancel.
// Cada objeto representa un tipo y contiene descripción, base de cálculo, ejemplo y uso.
const TIPOS_ARANCEL = [
  {
    id: "ad_valorem",
    tipo: "Arancel Ad Valorem",
    descripcion: "Tarifa expresada como porcentaje sobre el valor comercial (CIF) del producto importado.",
    base: "% sobre valor CIF (Costo + Seguro + Flete)",
    ejemplo: "10% sobre CIF de 10.000 USD => 1.000 USD",
    uso: "Más común; mayoría de productos",
  },
  {
    id: "especifico",
    tipo: "Arancel Específico",
    descripcion: "Tarifa fija por unidad física (peso, volumen, cantidad).",
    base: "Monto fijo por unidad física",
    ejemplo: "5 USD por unidad; 100 und => 500 USD",
    uso: "Frecuente en agro, combustibles, algunos textiles",
  },
  {
    id: "mixto",
    tipo: "Arancel Mixto",
    descripcion: "Combinación de ad valorem + específico por unidad.",
    base: "% sobre CIF + monto fijo por unidad",
    ejemplo: "5% CIF (10.000 => 500) + 2 USD x 100 und => 200; total 700 USD",
    uso: "Menos frecuente; productos sensibles",
  },
];

const EJEMPLOS_SECTOR = [
  {
    sector: "Agropecuario",
    ejemplos: ["Arroz", "Leche", "Maíz blanco", "Carne de res", "Azúcar"],
    nota: "Pueden tener tarifas específicas o franjas arancelarias.",
  },
  {
    sector: "Automotriz",
    ejemplos: ["Vehículos", "Partes y repuestos"],
    nota: "Aranceles variables – 5%–35% según subpartida.",
  },
  {
    sector: "Bebidas alcohólicas",
    ejemplos: ["Cerveza", "Fermentados"],
    nota: "Aranceles específicos por litro o ad valorem por graduación.",
  },
  {
    sector: "Perfumería y cosméticos",
    ejemplos: ["Perfumes", "Cosméticos"],
    nota: "Tarifa por kg o ad valorem, según clasificación.",
  },
];

// Componente principal que muestra la tabla de tipos de arancel.
export default function TiposArancel() {
  return (
    <div className="space-y-6">
      {/* Título de la sección */}
      <h2 className="text-2xl font-bold mb-4">Tipos de Arancel</h2>
      {/* Tabla responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="bg-zinc-100">
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Base de cálculo</th>
              <th className="px-4 py-2 text-left">Ejemplo</th>
              <th className="px-4 py-2 text-left">Uso</th>
            </tr>
          </thead>
          <tbody>
            {/* Recorre el array TIPOS_ARANCEL y muestra cada tipo en una fila */}
            {TIPOS_ARANCEL.map((arancel) => (
              <tr key={arancel.id} className="border-t">
                <td className="px-4 py-2 font-semibold">{arancel.tipo}</td>
                <td className="px-4 py-2">{arancel.descripcion}</td>
                <td className="px-4 py-2">{arancel.base}</td>
                <td className="px-4 py-2">{arancel.ejemplo}</td>
                <td className="px-4 py-2">{arancel.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Ejemplos por sector */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Ejemplos por sector</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {EJEMPLOS_SECTOR.map((sector) => (
            <div key={sector.sector} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold mb-2">{sector.sector}</h3>
              <ul className="list-disc pl-4 mb-2">
                {sector.ejemplos.map((ej, idx) => (
                  <li key={idx}>{ej}</li>
                ))}
              </ul>
              <p className="text-xs text-zinc-600">{sector.nota}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}