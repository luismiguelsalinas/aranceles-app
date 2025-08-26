// Formatea valores como dinero USD
export function money(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Calcula el arancel según el tipo seleccionado
 * @param {Object} params
 * @param {"ad_valorem"|"especifico"|"mixto"} params.tipo
 * @param {number} params.valorCIF - Valor CIF en USD
 * @param {number} params.unidades - Número de unidades físicas
 * @param {number} params.tasaAdValorem - Tasa ad valorem (decimal, ej: 0.1 = 10%)
 * @param {number} params.tasaEspecifica - Tasa específica (USD por unidad)
 * @param {number} params.reduccionPreferencial - Reducción por TLC (decimal, ej: 0.5 = 50%)
 * @returns {{ base: number, descuento: number, total: number }}
 */
export function calcularArancel({
  tipo,
  valorCIF,
  unidades,
  tasaAdValorem,
  tasaEspecifica,
  reduccionPreferencial,
}) {
  let base = 0;

  switch (tipo) {
    case "ad_valorem":
      base = valorCIF * tasaAdValorem;
      break;
    case "especifico":
      base = unidades * tasaEspecifica;
      break;
    case "mixto":
      base = valorCIF * tasaAdValorem + unidades * tasaEspecifica;
      break;
    default:
      base = 0;
  }

  // descuento por TLC
  const descuento = base * reduccionPreferencial;

  // total a pagar
  const total = base - descuento;

  return { base, descuento, total };
}
