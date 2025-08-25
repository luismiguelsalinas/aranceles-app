import React, { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Info, Calculator, Globe2, Bell, BookOpen, Search, FileText, ExternalLink, Download } from "lucide-react";

/**
 * Apartado de Aranceles – Página modular en React + Tailwind
 * - Sidebar con navegación entre módulos
 * - Datos precargados basados en el documento "Aranceles en la aduana colombiana"
 * - Simulador de cálculo (Ad Valorem, Específico, Mixto) con soporte para preferencias TLC
 * - Biblioteca de aranceles (tabla filtrable)
 * - Clasificación arancelaria (explicativa + buscador simple para dataset de ejemplo + enlace DIAN)
 * - Tratados y exenciones (catálogo y filtros)
 * - Noticias y alertas (cargador local y listado)
 * - Recursos y soporte (guías y enlaces clave)
 *
 * Nota: Esta es una base funcional y auto-contenida para iniciar el desarrollo.
 * Donde corresponda, sustituye datasets de ejemplo por integraciones reales (API DIAN, CMS de noticias, etc.).
 */

// ==========================
// Datos base (seed)
// ==========================

const TIPOS_ARANCEL = [
  {
    id: "ad_valorem",
    tipo: "Arancel Ad Valorem",
    descripcion:
      "Tarifa expresada como porcentaje sobre el valor comercial (CIF) del producto importado.",
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

const PRODUCTOS_EJEMPLO = [
  {
    sector: "Agropecuario",
    productos: ["Arroz", "Leche", "Maíz blanco", "Carne de res", "Azúcar"],
    observacion: "Pueden tener tarifas específicas o franjas arancelarias",
  },
  {
    sector: "Automotriz",
    productos: ["Vehículos", "Partes y repuestos"],
    observacion: "Aranceles variables ~5%–35% según subpartida",
  },
  {
    sector: "Bebidas alcohólicas",
    productos: ["Cerveza", "Fermentados"],
    observacion: "Aranceles específicos por litro o ad valorem por graduación",
  },
  {
    sector: "Perfumería y cosméticos",
    productos: ["Perfumes", "Cosméticos"],
    observacion: "Tarifa por kg o ad valorem, según clasificación",
  },
];

const CLASIFICACION_INFO = [
  { label: "Sistema Armonizado (SA)", value: "Base internacional (OMA), 6 dígitos" },
  { label: "NANDINA (Com. Andina)", value: "Dígitos 7-8" },
  { label: "Arancel Colombiano", value: "Dígitos 9-10 (nacionales)" },
  { label: "Importancia", value: "La correcta clasificación determina el arancel y evita sanciones" },
];

const RANGO_ARANCEL = { min: 0, max: 40 };

const TLC_SEED = [
  {
    id: "can",
    nombre: "Comunidad Andina (CAN)",
    paises: ["Bolivia", "Colombia", "Ecuador", "Perú"],
    beneficio: "Preferencias arancelarias según reglas de origen",
  },
  {
    id: "ap",
    nombre: "Alianza del Pacífico",
    paises: ["Chile", "Colombia", "México", "Perú"],
    beneficio: "Desgravación progresiva para múltiples subpartidas",
  },
  {
    id: "usa",
    nombre: "Estados Unidos (TLC)",
    paises: ["Colombia", "Estados Unidos"],
    beneficio: "Reducciones/eliminaciones por capítulo con origen calificado",
  },
  {
    id: "ue",
    nombre: "Unión Europea (Acuerdo)",
    paises: ["Colombia", "UE"],
    beneficio: "Preferencias por sectores (agro, industria)",
  },
];

const NOTICIAS_SEED = [
  {
    id: 1,
    fecha: "2025-01-13",
    titulo: "Circular DIAN sobre procedimientos aduaneros",
    detalle:
      "Actualiza pautas operativas; revisar impactos en liquidación y control documental.",
    fuente: "DIAN",
    url: "https://www.dian.gov.co/",
  },
];

// Dataset de ejemplo para "Clasificación" (sustituir por integración real)
const CODIGOS_EJEMPLO = [
  {
    codigo: "2203.00.00.00",
    descripcion: "Cerveza de malta",
    unidad: "L",
    tipoArancel: "especifico",
    tarifaEspecifica: 0.35, // USD por litro (ejemplo)
    tarifaAdValorem: 0, // no aplica en este ejemplo
  },
  {
    codigo: "8703.23.90.00",
    descripcion: "Vehículos turismos, cilindrada 1500-3000cc, otros",
    unidad: "Unidad",
    tipoArancel: "ad_valorem",
    tarifaAdValorem: 0.25, // 25% ejemplo
    tarifaEspecifica: 0,
  },
  {
    codigo: "3303.00.00.00",
    descripcion: "Perfumes y aguas de tocador",
    unidad: "kg",
    tipoArancel: "mixto",
    tarifaAdValorem: 0.05, // 5% ejemplo
    tarifaEspecifica: 2.0, // USD/kg (ejemplo)
  },
];

// ==========================
// Utilidades
// ==========================

const money = (n, c = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: c }).format(
    Number.isFinite(n) ? n : 0
  );

function calcularArancel({ tipo, valorCIF, unidades, tasaAdValorem, tasaEspecifica, reduccionPreferencial = 0 }) {
  let base = 0;
  if (tipo === "ad_valorem") {
    base = valorCIF * (tasaAdValorem || 0);
  } else if (tipo === "especifico") {
    base = (tasaEspecifica || 0) * (unidades || 0);
  } else if (tipo === "mixto") {
    const p1 = valorCIF * (tasaAdValorem || 0);
    const p2 = (tasaEspecifica || 0) * (unidades || 0);
    base = p1 + p2;
  }
  const descuento = base * (reduccionPreferencial || 0);
  const total = Math.max(base - descuento, 0);
  return { base, descuento, total };
}

// ==========================
// Componentes UI atómicos
// ==========================

function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white/80 dark:bg-zinc-900/60 backdrop-blur rounded-2xl shadow p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="w-5 h-5 opacity-80" />}
        {title && <h3 className="text-lg font-semibold">{title}</h3>}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

function Badge({ children }) {
  return <span className="px-2 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800">{children}</span>;
}

function LinkExt({ href, children }) {
  return (
    <a className="inline-flex items-center gap-1 text-blue-600 hover:underline" href={href} target="_blank" rel="noreferrer">
      {children} <ExternalLink className="w-3.5 h-3.5" />
    </a>
  );
}

// ==========================
// Módulos
// ==========================

function ModDashboard() {
  const dataTipos = TIPOS_ARANCEL.map((t) => ({ name: t.tipo.replace("Arancel ", ""), value: 1 }));
  const dataRango = [
    { name: "Mínimo legal", value: RANGO_ARANCEL.min },
    { name: "Máximo legal", value: RANGO_ARANCEL.max },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card title="Resumen" icon={Info} className="lg:col-span-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Tipos de arancel" value={TIPOS_ARANCEL.length} />
          <Stat label="Sectores ejemplo" value={PRODUCTOS_EJEMPLO.length} />
          <Stat label="Rango legal" value={`${RANGO_ARANCEL.min}% – ${RANGO_ARANCEL.max}%`} />
          <Stat label="TLC registrados" value={TLC_SEED.length} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card title="Distribución de tipos (ilustrativa)">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={dataTipos} outerRadius={100} label>
                    {dataTipos.map((entry, index) => (
                      <Cell key={`cell-${index}`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card title="Rango legal (0–40% ad valorem)">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataRango}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </Card>

      <Card title="Accesos rápidos">
        <ul className="space-y-2 text-sm">
          <li>
            <LinkExt href="https://muisca.dian.gov.co/WebArancel/DefMenuConsultas.faces">Consulta Arancelaria DIAN</LinkExt>
          </li>
          <li>
            <LinkExt href="https://www.mincit.gov.co/mincomercioexterior/como-importar-a-colombia">Guía MinCIT – Importar a Colombia</LinkExt>
          </li>
          <li>
            <LinkExt href="https://arancel.legis.com.co">Arancel – Legis</LinkExt>
          </li>
        </ul>
      </Card>
    </div>
  );
}

function ModBiblioteca() {
  const [q, setQ] = useState("");
  const filtered = TIPOS_ARANCEL.filter(
    (t) =>
      t.tipo.toLowerCase().includes(q.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(q.toLowerCase()) ||
      t.uso.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar tipo, descripción o uso..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500">
              <th className="py-2 pr-4">Tipo</th>
              <th className="py-2 pr-4">Descripción</th>
              <th className="py-2 pr-4">Base de cálculo</th>
              <th className="py-2 pr-4">Ejemplo</th>
              <th className="py-2 pr-4">Uso</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-zinc-200/50 dark:border-zinc-800/60">
                <td className="py-2 pr-4 font-medium">{t.tipo}</td>
                <td className="py-2 pr-4">{t.descripcion}</td>
                <td className="py-2 pr-4">{t.base}</td>
                <td className="py-2 pr-4">{t.ejemplo}</td>
                <td className="py-2 pr-4"><Badge>{t.uso}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card title="Ejemplos por sector" icon={BookOpen}>
        <div className="grid md:grid-cols-2 gap-4">
          {PRODUCTOS_EJEMPLO.map((s) => (
            <div key={s.sector} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="font-semibold mb-1">{s.sector}</div>
              <div className="text-sm opacity-90">{s.productos.join(", ")}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.observacion}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ModClasificacion() {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return CODIGOS_EJEMPLO;
    return CODIGOS_EJEMPLO.filter(
      (r) => r.codigo.toLowerCase().includes(k) || r.descripcion.toLowerCase().includes(k)
    );
  }, [q]);

  return (
    <div className="space-y-6">
      <Card title="Cómo se estructura el código" icon={Search}>
        <div className="grid md:grid-cols-2 gap-4">
          {CLASIFICACION_INFO.map((i) => (
            <div key={i.label} className="flex items-start gap-3">
              <div className="mt-1"><Badge>{i.label}</Badge></div>
              <div className="text-sm">{i.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm">
          Consulta oficial: <LinkExt href="https://muisca.dian.gov.co/WebArancel/DefMenuConsultas.faces">DIAN – Web Arancel</LinkExt>
        </div>
      </Card>

      <Card title="Buscador (dataset de ejemplo)">
        <div className="flex items-center gap-2 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Código (ej. 2203) o descripción (ej. cerveza)"
            className="w-full md:w-1/2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-2 pr-4">Código</th>
                <th className="py-2 pr-4">Descripción</th>
                <th className="py-2 pr-4">Unidad</th>
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Tarifa Ad Valorem</th>
                <th className="py-2 pr-4">Tarifa Específica</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.codigo} className="border-t border-zinc-200/50 dark:border-zinc-800/60">
                  <td className="py-2 pr-4 font-medium">{r.codigo}</td>
                  <td className="py-2 pr-4">{r.descripcion}</td>
                  <td className="py-2 pr-4">{r.unidad}</td>
                  <td className="py-2 pr-4">{r.tipoArancel.replace("_", " ")}</td>
                  <td className="py-2 pr-4">{r.tarifaAdValorem ? `${(r.tarifaAdValorem * 100).toFixed(2)}%` : "–"}</td>
                  <td className="py-2 pr-4">{r.tarifaEspecifica ? `${r.tarifaEspecifica} USD/${r.unidad}` : "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ModSimulador() {
  const [tipo, setTipo] = useState("ad_valorem");
  const [valorCIF, setValorCIF] = useState(10000);
  const [unidades, setUnidades] = useState(100);
  const [tasaAdValorem, setTasaAdValorem] = useState(0.1); // 10%
  const [tasaEspecifica, setTasaEspecifica] = useState(2); // USD/unidad
  const [preferencia, setPreferencia] = useState(0); // % reducción por TLC

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
          `Tasa ad valorem: ${tasaAdValorem}\n` +
          `Tasa específica: ${tasaEspecifica}\n` +
          `Reducción TLC: ${preferencia}\n\n` +
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card title="Parámetros" icon={Calculator} className="lg:col-span-2">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500">Tipo de arancel</label>
            <select
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="ad_valorem">Ad Valorem</option>
              <option value="especifico">Específico</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-zinc-500">Valor CIF (USD)</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={valorCIF}
              onChange={(e) => setValorCIF(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Unidades físicas</label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={unidades}
              onChange={(e) => setUnidades(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Tasa ad valorem (%)</label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={(tasaAdValorem * 100).toString()}
              onChange={(e) => setTasaAdValorem((Number(e.target.value) || 0) / 100)}
              disabled={tipo === "especifico"}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Tasa específica (USD / unidad)</label>
            <input
              type="number"
              step="0.01"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={tasaEspecifica}
              onChange={(e) => setTasaEspecifica(Number(e.target.value) || 0)}
              disabled={tipo === "ad_valorem"}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500">Reducción por TLC (%)</label>
            <input
              type="number"
              step="1"
              className="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
              value={(preferencia * 100).toString()}
              onChange={(e) => setPreferencia((Number(e.target.value) || 0) / 100)}
            />
            <div className="text-xs text-zinc-500 mt-1">Ej.: 100 = exención total; 0 = sin preferencia</div>
          </div>
        </div>
      </Card>

      <Card title="Resultado">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Base calculada</span>
            <span className="font-semibold">{money(base)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Descuento TLC</span>
            <span className="font-semibold">{money(descuento)}</span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total a pagar</span>
            <span className="font-bold">{money(total)}</span>
          </div>
          <button onClick={onExport} className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800">
            <Download className="w-4 h-4" /> Exportar TXT
          </button>
        </div>
      </Card>
    </div>
  );
}

function ModTratados() {
  const [q, setQ] = useState("");
  const res = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return TLC_SEED;
    return TLC_SEED.filter((t) => t.nombre.toLowerCase().includes(k) || t.paises.join(",").toLowerCase().includes(k));
  }, [q]);

  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar tratado o país..."
          className="w-full pl-10 pr-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 outline-none"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {res.map((t) => (
          <Card key={t.id} title={t.nombre} icon={Globe2}>
            <div className="text-sm">
              <div className="mb-1"><span className="text-zinc-500">Países: </span>{t.paises.join(", ")}</div>
              <div className="mb-2"><span className="text-zinc-500">Beneficio: </span>{t.beneficio}</div>
              <div className="text-xs text-zinc-500">Aplica según reglas de origen y subpartida.</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ModNoticias() {
  const [items, setItems] = useState(NOTICIAS_SEED);
  const [nueva, setNueva] = useState({ fecha: "", titulo: "", detalle: "", fuente: "", url: "" });

  const add = () => {
    if (!nueva.titulo) return;
    setItems((arr) => [
      { id: Date.now(), ...nueva },
      ...arr,
    ]);
    setNueva({ fecha: "", titulo: "", detalle: "", fuente: "", url: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <Card title="Publicar alerta" icon={Bell} className="lg:col-span-1">
        <div className="space-y-2">
          <input
            placeholder="Fecha (YYYY-MM-DD)"
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            value={nueva.fecha}
            onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
          />
          <input
            placeholder="Título"
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            value={nueva.titulo}
            onChange={(e) => setNueva({ ...nueva, titulo: e.target.value })}
          />
          <textarea
            placeholder="Detalle"
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            value={nueva.detalle}
            onChange={(e) => setNueva({ ...nueva, detalle: e.target.value })}
          />
          <input
            placeholder="Fuente"
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            value={nueva.fuente}
            onChange={(e) => setNueva({ ...nueva, fuente: e.target.value })}
          />
          <input
            placeholder="URL (opcional)"
            className="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
            value={nueva.url}
            onChange={(e) => setNueva({ ...nueva, url: e.target.value })}
          />
          <button onClick={add} className="w-full px-3 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800">Publicar</button>
        </div>
      </Card>

      <Card title="Noticias y alertas" className="lg:col-span-2">
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
              <div className="text-xs text-zinc-500">{n.fecha || "Sin fecha"}</div>
              <div className="font-semibold">{n.titulo}</div>
              <div className="text-sm opacity-90">{n.detalle}</div>
              <div className="flex items-center gap-2 text-xs mt-1">
                {n.fuente && <Badge>{n.fuente}</Badge>}
                {n.url && (
                  <LinkExt href={n.url}>Ver fuente</LinkExt>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ModRecursos() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      <Card title="Guías y documentación" icon={FileText}>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>
            <LinkExt href="https://muisca.dian.gov.co/WebArancel/DefMenuConsultas.faces">DIAN – Web Arancel (consulta oficial)</LinkExt>
          </li>
          <li>
            <LinkExt href="https://www.bancolombia.com/negocios/actualizate/comercio-internacional/politica-arancelaria-colombia">Política arancelaria – Bancolombia</LinkExt>
          </li>
          <li>
            <LinkExt href="https://www.mincit.gov.co/mincomercioexterior/como-importar-a-colombia">Cómo importar – MinCIT</LinkExt>
          </li>
        </ul>
        <div className="text-xs text-zinc-500 mt-3">
          *Verifica siempre la norma vigente y la subpartida exacta.
        </div>
      </Card>

      <Card title="Notas clave">
        <ul className="text-sm space-y-1">
          <li>Los aranceles pueden ir de {RANGO_ARANCEL.min}% a {RANGO_ARANCEL.max}% (según subpartida).</li>
          <li>La base ad valorem es el valor CIF: Costo + Seguro + Flete.</li>
          <li>En específico/mixto, define la unidad (L, kg, unidad, etc.).</li>
          <li>Las preferencias dependen del origen y reglas de cada acuerdo.</li>
        </ul>
      </Card>
    </div>
  );
}

// ==========================
// Shell principal
// ==========================

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: Info, comp: ModDashboard },
  { id: "biblioteca", label: "Tipos de Arancel", icon: BookOpen, comp: ModBiblioteca },
  { id: "clasificacion", label: "Clasificación", icon: Search, comp: ModClasificacion },
  { id: "simulador", label: "Simulador", icon: Calculator, comp: ModSimulador },
  { id: "tratados", label: "Tratados y exenciones", icon: Globe2, comp: ModTratados },
  { id: "noticias", label: "Noticias y alertas", icon: Bell, comp: ModNoticias },
  { id: "recursos", label: "Recursos", icon: FileText, comp: ModRecursos },
];

export default function ArancelesPage() {
  const [tab, setTab] = useState("dashboard");
  const Active = NAV.find((n) => n.id === tab)?.comp ?? NAV[0].comp;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      <header className="border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 text-white grid place-content-center">$</div>
            <div>
              <h1 className="text-xl font-bold leading-tight">Aranceles – Gestión Aduanera</h1>
              <div className="text-xs text-zinc-500">Colombia · Módulo especializado</div>
            </div>
          </div>
          <div className="hidden md:block text-sm text-zinc-500">
            Basado en lineamientos del documento interno de aranceles
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <nav className="sticky top-6 space-y-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 border transition ${
                  tab === n.id
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white/80 dark:bg-zinc-900/60 border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <n.icon className="w-4 h-4" /> 
                {n.label}
              </button>
              ))}
          </nav>
        </aside>

        <section className="lg:col-span-9">
          <Active />
        </section>
      </main>

      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-sm text-zinc-500">
          © {new Date().getFullYear()} Módulo Aranceles. Esta es una base técnica de referencia. Verifique siempre la norma vigente y la subpartida exacta en fuentes oficiales.
        </div>
      </footer>
    </div>
  );
}
