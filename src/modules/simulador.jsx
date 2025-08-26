import { useState, useMemo } from "react";
import { Calculator, Download } from "lucide-react";
import Card from "../components/Card";
import { calcularArancel, money } from "../utils/helpers";

export default function Simulador() {
  const [tipo, setTipo] = useState("ad_valorem");
  const [valorCIF, setValorCIF] = useState(10000);
  const [unidades, setUnidades] = useState(100);
  const [tasaAdValorem, setTasaAdValorem] = useState(0.1); // 0.1 = 10%
  const [tasaEspecifica, setTasaEspecifica] = useState(2); // USD/unidad
  const [preferencia, setPreferencia] = useState(0); // 0 = 0%

  const { base, descuento, total } = useMemo(
    () =>
      calcularArancel({
        tipo,
        valorCIF: Number(valorCIF) || 0,
        unidades: Number(unidades) || 0,
        tasaAdValorem: Number(tasaAdValorem) || 0,
        tasaEspecifica: Number(tasaEspecifica) || 0,
        reduccionPreferencial: Number(preferencia) || 0,
      }),
    [tipo, valorCIF, unidades, tasaAdValorem, tasaEspecifica, preferencia]
  );

  const onExport = () => {
    const blob = new Blob(
      [
        `Simulación de arancel\n\n` +
          `Tipo: ${tipo}\n` +
          `Valor CIF: ${valorCIF}\n` +
          `Unidades: ${unidades}\n` +
          `Tasa ad valorem: ${(tasaAdValorem * 100).toFixed(2)}%\n` +
          `Tasa específica: ${tasaEspecifica}\n` +
          `Reducción TLC: ${(preferencia * 100).toFixed(2)}%\n\n` +
          `Base: ${base}\n` +
          `Descuento: ${descuento}\n` +
          `Total: ${total}\n`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `simulacion_arancel.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* ---- PARÁMETROS ---- */}
      <Card title="Parámetros" icon={Calculator}>
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Tipo de arancel
            </label>
            <select
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="ad_valorem">Ad Valorem</option>
              <option value="especifico">Específico</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Valor CIF (USD)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={valorCIF}
              onChange={(e) => setValorCIF(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Unidades físicas
            </label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={unidades}
              onChange={(e) => setUnidades(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Tasa ad valorem (%)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={tasaAdValorem * 100}
              onChange={(e) =>
                setTasaAdValorem((Number(e.target.value) || 0) / 100)
              }
              disabled={tipo === "especifico"}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Tasa específica (USD / unidad)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={tasaEspecifica}
              onChange={(e) => setTasaEspecifica(Number(e.target.value) || 0)}
              disabled={tipo === "ad_valorem"}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              Reducción por TLC (%)
            </label>
            <input
              type="number"
              step="1"
              className="w-full mt-1 px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-blue-500"
              value={preferencia * 100}
              onChange={(e) =>
                setPreferencia((Number(e.target.value) || 0) / 100)
              }
            />
            <div className="text-xs text-zinc-500 mt-1">
              Ej.: 100 = exención total; 0 = sin preferencia
            </div>
          </div>
        </div>
      </Card>

      {/* ---- RESULTADOS ---- */}
      <Card title="Resultado">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Base calculada</span>
            <span className="font-semibold text-lg">{money(base)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Descuento TLC</span>
            <span className="font-semibold text-lg">{money(descuento)}</span>
          </div>
          <div className="flex items-center justify-between text-xl">
            <span className="font-semibold">Total a pagar</span>
            <span className="font-bold text-blue-600">{money(total)}</span>
          </div>
          <button
            onClick={onExport}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            <Download className="w-4 h-4" /> Exportar TXT
          </button>
        </div>
      </Card>
    </div>
  );
}
