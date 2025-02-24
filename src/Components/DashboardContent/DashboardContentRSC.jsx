import CustomBarChart from "../Chart/BarChart";
import CustomLineChart from "../Chart/LineChart ";
import { FaDollarSign, FaShoppingCart, FaBalanceScale, FaTasks, FaProjectDiagram } from 'react-icons/fa'; 
import { BsFillPiggyBankFill } from 'react-icons/bs'; 
import FichTable from "../Tables/FichTable"; 
import ClientTable from "../Tables/ClientTable";
import FactTable from "../Tables/FactTable";
import { useState,useEffect } from 'react';
import { request } from '../../Service/axios_helper';
import Cookies from 'js-cookie'; 

const DashboardContentRSC = () => {

   const [statistiques, setStatistiques] =  useState({
    totalDemandesRecuesCeMois: 0,
    totalDemandesEnCours: 0,
    totalDemandesCloturees: 0,
    totalClients: 0,
    nouveauxClientsCeMois : 0,
    montantTotalFactureCeMois : 0,
    });

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
          const response = await request("get", "/rsc/statistiques", null, headers);
          return response.data;
        } catch (error) {
          console.error("Erreur API Statistiques:", error);
        }
      };

  return (
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Nombre total de demandes reçues ce mois-ci", value: statistiques.totalDemandesRecuesCeMois , icon: <FaDollarSign size={21} color="#422afb" /> },
          { title: "Nombre de demandes en cours de traitement", value: statistiques.totalDemandesEnCours  , icon: <FaShoppingCart size={21} color="#422afb" /> },
          { title: "Nombre de demandes clôturées", value: statistiques.totalDemandesCloturees  , icon: <FaBalanceScale size={21} color="#422afb" /> },
          { title: "Nombre total de clients", value: statistiques.totalClients  , icon: <BsFillPiggyBankFill size={21} color="#422afb" /> },
          { title: "Nombre de nouveaux clients ce mois-ci", value: statistiques.nouveauxClientsCeMois  , icon: <FaTasks size={21} color="#422afb" /> },
          { title: "Montant total facturé ce mois-ci ", value: statistiques.montantTotalFactureCeMois.toFixed(2) + " DT"  , icon: <FaProjectDiagram size={21} color="#422afb" /> },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center"
          >
            {/* Icon Wrapper with Background */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f4f7fe] dark:bg-gray-700">
              {item.icon}
            </div>
            <div className="ml-4">
              <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{item.title}</div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-4">This Month</div>
          <CustomLineChart />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-4">Weekly Revenue</div>
          <CustomBarChart />
        </div>
      </div>

      {/* Table Section  */}
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <FichTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <ClientTable />
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <FactTable />
      </div>
    </div>
  );
};

export default DashboardContentRSC;
