export const TIPOS_ARANCEL = [
  { id: "ad_valorem", tipo: "Ad Valorem", descripcion: "Porcentaje sobre CIF", base: "Valor CIF", ejemplo: "10% sobre 10.000 USD = 1.000 USD" },
  { id: "especifico", tipo: "Específico", descripcion: "Tarifa fija por unidad", base: "Unidades", ejemplo: "5 USD x 100 und = 500 USD" },
  { id: "mixto", tipo: "Mixto", descripcion: "Combinación CIF + fijo", base: "Valor CIF + unidades", ejemplo: "5% CIF + 2 USD/unidad" }
];

export const CLASIFICACION_INFO = [
  { label: "SA", value: "6 dígitos internacionales" },
  { label: "NANDINA", value: "Dígitos 7-8 Andinos" },
  { label: "Colombia", value: "Dígitos 9-10 nacionales" },
];
