import { useState, useMemo } from "react";
import { calcularArancel, money } from "../utils/calc";
import Card from "../components/card.jsx";
import { Calculator } from "lucide-react";

export default function Simulador() {
  const [tipo, setTipo] = useState("ad_valorem");
  const [valorCIF, setValorCIF] = useState(10000);
  const [unidades, setUnidades] = useState(100);
  const [tasaAdValorem, setTasaAdValorem] = useState(0.1);
  const [tasaEspecifica, setTasaEspecifica] = useState(2);
  const [preferencia, setPreferencia] = useState(0);

  const { base, descuento, total } = useMemo(
    () => calcularArancel({ tipo, valorCIF, unidades, tasaAdValorem, tasaEspecifica, reduccionPreferencial: preferencia }),
    [tipo, valorCIF, unidades, tasaAdValorem, tasaEspecifica, preferencia]
  );

  return (
    <Card title="Simulador de Arancel" icon={Calculator}>
      <div className="grid gap-3">
        <input type="number" value={valorCIF} onChange={e=>setValorCIF(+e.target.value)} />
        <input type="number" value={unidades} onChange={e=>setUnidades(+e.target.value)} />
        <div>Total: {money(total)}</div>
      </div>
    </Card>
  );
}
