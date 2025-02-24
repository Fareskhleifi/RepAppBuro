import { FaDollarSign, FaUserCog, FaCheckCircle, FaShoppingCart, FaPercent, FaFileInvoiceDollar, FaProjectDiagram } from 'react-icons/fa'; 
import AreaChartComponent from '../Chart/AreaChartComponent ';
import TechBarChart from '../Chart/TechBarChart';
import FichTable from "../Tables/FichTable"; 
import ClientTable from "../Tables/ClientTable";
import FactTable from "../Tables/FactTable";
import TableProduit from '../Tables/Technicien/TableProduit';
import TechTable from '../Tables/Direction/TechTable';
import RscTable from '../Tables/Direction/RscTable';
import { useState,useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { request } from '../../Service/axios_helper';
import Cookies from 'js-cookie'; 

export default function DashboardContentDR() {
  const [showDetails, setShowDetails] = useState(false);
  const [statistiques, setStatistiques] =  useState({
    techniciensActifs: 0,
    nombreClients: 0,
    reparationsEnCours: 0,
    reparationsTerminees: 0,
    beneficesCeMois : 0,
    depensesCeMois : 0,
    facturesAEncaisser: 0,
    margeBeneficiaireNette : 0,
  });
  const calculateDetails = (title) => {
    switch (title) {
      case "Bénéfices Ce Mois":
        return "Bénéfices calculés sur les ventes et réparations effectuées ce mois.";
      case "Dépenses Ce Mois":
        return "Dépenses calculées en fonction des coûts des pièces, main d'œuvre et autres frais.";
      case "Factures à Encaisser":
        return "Montant total des factures impayées pour ce mois.";
      case "Marge Bénéficiaire Nette":
        return "Marge bénéficiaire nette = (Revenus - Dépenses) / Revenus.";
        case "Techniciens Actifs":
          return "Nombre de techniciens actifs dans l'entreprise.";
        case "Nombre des clients":
          return "Total des clients enregistrés dans le système.";
        case "Réparation en Cours":
          return "Nombre de réparations actuellement en cours.";
        case "Réparation Terminés":
          return "Nombre total de réparations terminées.";
      default:
        return "Détails indisponibles.";
    }
  };

  useEffect(() => {
    const loadStatistiques = async () => {
      const data = await fetchStatistiques(); 
      if (data) {
        setStatistiques(data);
      }
    };
    loadStatistiques();
  }, []);

  const fetchStatistiques = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token'); 
      const headers = { Authorization: `Bearer ${token}` }; 
      const response = await request("get", "/direction/statistiques", null, headers);
      return response.data;
    } catch (error) {
      console.error("Erreur API Statistiques:", error);
    }
  };

  return (
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Techniciens Actifs",
            value: statistiques.techniciensActifs,
            icon: <FaUserCog size={21} color="#422afb" />,
          },
          {
            title: "Nombre des clients",
            value: statistiques.nombreClients,
            icon: <FaUserCog size={21} color="#422afb" />,
          },
          {
            title: "Réparation en Cours",
            value: statistiques.reparationsEnCours,
            icon: <FaProjectDiagram size={21} color="#422afb" />,
          },
          {
            title: "Réparation Terminés",
            value: statistiques.reparationsTerminees,
            icon: <FaCheckCircle size={21} color="#422afb" />,
          },
          {
            title: "Bénéfices Ce Mois",
            value: statistiques.beneficesCeMois.toFixed(2) + " DT",
            icon: <FaDollarSign size={21} color="#422afb" />,
          },
          {
            title: "Dépenses Ce Mois",
            value: statistiques.depensesCeMois.toFixed(2) + " DT",
            icon: <FaShoppingCart size={21} color="#422afb" />,
          },
          {
            title: "Factures à Encaisser",
            value: statistiques.facturesAEncaisser.toFixed(2) + " DT",
            icon: <FaFileInvoiceDollar size={21} color="#422afb" />,
          },
          {
            title: "Marge Bénéficiaire Nette",
            value: statistiques.margeBeneficiaireNette.toFixed(2) + " %",
            icon: <FaPercent size={21} color="#422afb" />,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f4f7fe] dark:bg-gray-700">
              {item.icon}
            </div>
            <div className="ml-4">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.title}</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</div>
              {/* Bouton pour afficher/masquer les détails */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-500 mt-2 text-sm flex items-center"
              >
                {showDetails ? (
                  <FaChevronUp size={16} />
                ) : (
                  <FaChevronDown size={16} />
                )}
                <span className="ml-2">{showDetails ? "Masquer les détails" : "Afficher les détails"}</span>
              </button>
              {/* Affichage des détails */}
              {showDetails && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <p>{calculateDetails(item.title)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Autres sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechBarChart />
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-12">Weekly Revenue</div>
          <AreaChartComponent />
        </div>
      </div>

      {/* Table Section */}
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <ClientTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <TechTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <RscTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <FactTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <FichTable />
      </div>
      <div className="p-0 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <TableProduit />
      </div>
    </div>
  );
}
