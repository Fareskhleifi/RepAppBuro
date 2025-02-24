import { FaDollarSign, FaUserCog, FaCheckCircle, FaShoppingCart,FaPercent, FaFileInvoiceDollar, FaProjectDiagram } from 'react-icons/fa'; 
import AreaChartComponent from '../Chart/AreaChartComponent ';
import TechBarChart from '../Chart/TechBarChart';
import FichTable from "../Tables/FichTable"; 
import ClientTable from "../Tables/ClientTable";
import FactTable from "../Tables/FactTable";
import AppareilAReparaerTable from '../Tables/Technicien/AppareilAReparaerTable';
import TableProduit from '../Tables/Technicien/TableProduit';
import TechTable from '../Tables/Direction/TechTable';
import RscTable from '../Tables/Direction/RscTable';

export default function DashboardContentDR() {
  
  return (
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">
       {/* Top Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Techniciens Actifs", 
            value: "9", 
            icon: <FaUserCog size={21} color="#422afb" /> 
          },
          { 
            title: "Nombre des clients", 
            value: "95", 
            icon: <FaUserCog size={21} color="#422afb" /> 
          },
          { 
            title: "Réparation en Cours", 
            value: "12", 
            icon: <FaProjectDiagram size={21} color="#422afb" /> 
          },
          { 
            title: "Réparation Terminés", 
            value: "259", 
            icon: <FaCheckCircle size={21} color="#422afb" /> 
          },
          { 
            title: "Bénéfices Ce Mois", 
            value: "120,000 DT", 
            icon: <FaDollarSign size={21} color="#422afb" /> 
          },
          { 
            title: "Dépenses Ce Mois", 
            value: "75,000 DT", 
            icon: <FaShoppingCart size={21} color="#422afb" /> 
          },
          { 
            title: "Factures à Encaisser", 
            value: "30,000 DT", 
            icon: <FaFileInvoiceDollar size={21} color="#422afb" /> 
          },
          { title: "Marge Bénéficiaire Nette", value: "25 %", icon: <FaPercent size={21} color="#422afb" /> },
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-12">Weekly Revenue</div>
          <AreaChartComponent></AreaChartComponent>
        </div>
      </div>

       {/* Table Section  */}
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
      <div className="p-0 rounded-lg shadow-md dark:bg-gray-800">
        <AppareilAReparaerTable/>
      </div>
      <div className="p-0 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <TableProduit/>
      </div>
    </div>
  )
}
