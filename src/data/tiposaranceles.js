// ...imports...

// Array detallado para la tabla
const TIPOS_ARANCEL_DETALLADO = [
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

export default TIPOS_ARANCEL_DETALLADO;

