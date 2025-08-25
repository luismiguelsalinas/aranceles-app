// Simulación de datos
const paquetes = [
  { id: 1, descripcion: "Paquete Importación #123", estado: "Pendiente" },
  { id: 2, descripcion: "Paquete Exportación #456", estado: "Liberado" },
  { id: 3, descripcion: "Paquete Aduana #789", estado: "En revisión" }
];

// Pintar tabla
const tableBody = document.getElementById("paqueteTable");

function renderTabla() {
  tableBody.innerHTML = "";
  paquetes.forEach(pkg => {
    const row = `
      <tr class="hover:bg-gray-100">
        <td class="px-4 py-2 border">${pkg.id}</td>
        <td class="px-4 py-2 border">${pkg.descripcion}</td>
        <td class="px-4 py-2 border">${pkg.estado}</td>
        <td class="px-4 py-2 border">
          <button class="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2">Editar</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Eliminar</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

renderTabla();

// Ejemplo de acción en botón navbar
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Sesión cerrada ✅");
});
