import { FaProjectDiagram, FaCheckCircle,FaTasks } from 'react-icons/fa'; 
import TechBarChart from '../Chart/TechBarChart';
import TechCercleChart from '../Chart/TechCercleChart';
import AppareilAReparaerTable from '../Tables/Technicien/AppareilAReparaerTable';
import HistoriqueTable from '../Tables/Technicien/HistoriqueTable';
import TableProduit from '../Tables/Technicien/TableProduit';
import DemandePieceTable from '../Tables/Technicien/DemandePieceTable';
import { useState, useEffect } from 'react';
import { request } from '../../Service/axios_helper';
import Cookies from 'js-cookie'; 


export default function DashboardContentTech() {
  const [statistiques, setStatistiques] =  useState({
    reparationsEnCours: 0,
    reparationsTerminees: 0,
    reparationsEnAttente: 0,
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
        const response = await request("get", "/tech/statistiques", null, headers);
        return response.data;
      } catch (error) {
        console.error("Erreur API Statistiques:", error);
      }
    };

  return (
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
        {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: "Total de réparations en cours", value: statistiques.reparationsEnCours , icon: <FaProjectDiagram size={21} color="#422afb" /> },
          { title: "Total de réparations terminées ce mois-ci", value: statistiques.reparationsTerminees , icon: <FaCheckCircle size={21} color="#422afb" /> },
          { title: "Appareils en attente de réparation", value: statistiques.reparationsEnAttente , icon: <FaTasks size={21} color="#422afb" /> },
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
            </div>
          </div>
        ))}
      </div>

        {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechBarChart></TechBarChart>
        <TechCercleChart></TechCercleChart>
      </div>

       {/* Table Section  */}
       <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <AppareilAReparaerTable/>
      </div>
      <div className="p-0 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <TableProduit/>
      </div>
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <HistoriqueTable/>
      </div>
      <div className="p-0 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <DemandePieceTable/>
      </div>
    </div>
  );
}
