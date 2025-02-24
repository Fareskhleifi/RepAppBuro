import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dialog, Transition } from "@headlessui/react";
import { CSVLink } from "react-csv";
import { jsPDF } from "jspdf";

const initialData = [
  { month: "Jan", year: 2024, profit: 4000, details: [
      { category: "Ordinateur", amount: 2000 },
      { category: "Imprimante", amount: 1000 },
      { category: "Accessoires", amount: 1000 },
    ]
  },
  { month: "Feb", year: 2024, profit: 3000, details: [
      { category: "Ordinateur", amount: 1500 },
      { category: "Imprimante", amount: 800 },
      { category: "Accessoires", amount: 700 },
    ]
  },
  { month: "Mar", year: 2024, profit: 4500, details: [
      { category: "Ordinateur", amount: 2500 },
      { category: "Imprimante", amount: 1200 },
      { category: "Accessoires", amount: 800 },
    ]
  },
  { month: "Apr", year: 2024, profit: 3200, details: [
      { category: "Ordinateur", amount: 1600 },
      { category: "Imprimante", amount: 1000 },
      { category: "Accessoires", amount: 600 },
    ]
  },
  { month: "May", year: 2024, profit: 5000, details: [
      { category: "Ordinateur", amount: 3000 },
      { category: "Imprimante", amount: 1500 },
      { category: "Accessoires", amount: 500 },
    ]
  },
  { month: "Jun", year: 2024, profit: 5500, details: [
      { category: "Ordinateur", amount: 2700 },
      { category: "Imprimante", amount: 2000 },
      { category: "Accessoires", amount: 800 },
    ]
  },
  { month: "Jul", year: 2024, profit: 4600, details: [
      { category: "Ordinateur", amount: 2300 },
      { category: "Imprimante", amount: 1300 },
      { category: "Accessoires", amount: 1000 },
    ]
  },
  { month: "Aug", year: 2024, profit: 4800, details: [
      { category: "Ordinateur", amount: 2400 },
      { category: "Imprimante", amount: 1600 },
      { category: "Accessoires", amount: 800 },
    ]
  },
  { month: "Sep", year: 2024, profit: 5200, details: [
      { category: "Ordinateur", amount: 2600 },
      { category: "Imprimante", amount: 1500 },
      { category: "Accessoires", amount: 1100 },
    ]
  },
  { month: "Oct", year: 2024, profit: 4300, details: [
      { category: "Ordinateur", amount: 2000 },
      { category: "Imprimante", amount: 1300 },
      { category: "Accessoires", amount: 1000 },
    ]
  },
  { month: "Nov", year: 2024, profit: 4800, details: [
      { category: "Ordinateur", amount: 2200 },
      { category: "Imprimante", amount: 1700 },
      { category: "Accessoires", amount: 900 },
    ]
  },
  { month: "Dec", year: 2024, profit: 6000, details: [
      { category: "Ordinateur", amount: 3000 },
      { category: "Imprimante", amount: 2000 },
      { category: "Accessoires", amount: 1000 },
    ]
  }
];


const ProfitChart = () => {
  const [data, setData] = useState(initialData);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2024); // Sélection de l'année par défaut

  // Fonction pour filtrer les données par année
  const handleYearChange = (event) => {
    const filteredData = initialData.filter(item => item.year === parseInt(event.target.value));
    setData(filteredData);
    setSelectedYear(parseInt(event.target.value));
  };

  // Ouvrir la modale avec les détails d’un mois spécifique
  const handlePointClick = (month) => {
    const monthData = data.find((d) => d.month === month);
    if (monthData) {
      setSelectedMonth(monthData.month);
      setSelectedDetails(monthData.details);
      setIsModalOpen(true);
    }
  };

  // Exporter les données en CSV
  const exportCSV = () => {
    const csvData = data.map((entry) => ({
      Month: entry.month,
      Profit: entry.profit,
      "Ordinateur": entry.details.find(d => d.category === "Ordinateur")?.amount || 0,
      "Imprimante": entry.details.find(d => d.category === "Imprimante")?.amount || 0,
      "Accessoires": entry.details.find(d => d.category === "Accessoires")?.amount || 0,
    }));
    return csvData;
  };

  // Exporter les données en PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Profit Report", 20, 20);
    let yOffset = 30;
    data.forEach(item => {
      doc.text(`Month: ${item.month}, Profit: €${item.profit}`, 20, yOffset);
      item.details.forEach(detail => {
        doc.text(`${detail.category}: €${detail.amount}`, 20, yOffset + 10);
        yOffset += 10;
      });
      yOffset += 10;
    });
    doc.save("profit_report.pdf");
  };

  return (
    <div className="p-8 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Statistiques des Profits</h2>

      {/* Sélection de l'année */}
      <div className="mb-4">
        <label htmlFor="year" className="text-sm font-medium text-gray-700">Choisir une année</label>
        <select
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
          className="mt-1 p-2 border border-gray-300 rounded-md"
        >
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
          {/* Ajouter d'autres années ici */}
        </select>
      </div>

      {/* Graphique */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} onClick={(e) => e && e.activeLabel && handlePointClick(e.activeLabel)}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="profit" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Actions d'exportation */}
      <div className="mt-6 flex justify-between">
        <CSVLink data={exportCSV()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Exporter CSV</CSVLink>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Exporter PDF</button>
      </div>

      {/* Modale pour afficher les détails */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full ml-12 max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Détails des Profits pour {selectedMonth}
                  </Dialog.Title>
                  <div className="mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Catégorie</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Montant (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDetails.map((detail, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="px-4 py-2 text-sm text-gray-600">{detail.category}</td>
                            <td className="px-4 py-2 text-sm text-gray-600">{detail.amount.toLocaleString("fr-FR")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Fermer
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default ProfitChart;
