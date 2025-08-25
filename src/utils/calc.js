export function money(n, c = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: c,
  }).format(Number.isFinite(n) ? n : 0);
}

export function calcularArancel({ tipo, valorCIF, unidades, tasaAdValorem, tasaEspecifica, reduccionPreferencial = 0 }) {
  let base = 0;
  if (tipo === "ad_valorem") {
    base = valorCIF * (tasaAdValorem || 0);
  } else if (tipo === "especifico") {
    base = (tasaEspecifica || 0) * (unidades || 0);
  } else if (tipo === "mixto") {
    base = valorCIF * (tasaAdValorem || 0) + (tasaEspecifica || 0) * (unidades || 0);
  }
  const descuento = base * (reduccionPreferencial || 0);
  return { base, descuento, total: Math.max(base - descuento, 0) };
}
