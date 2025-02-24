import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import Cookies from 'js-cookie';
import {request} from '../../../../Service/axios_helper'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewHistorique = () => {
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 5; 
  const [reparations, setReparations] = useState([]);

  const handleAction = (reparation, action) => {
    if (action === 'voirFiche') {
     Swal.fire({
       title: 'Voir la fiche de réparation?',
       text: "Vous allez consulter la fiche de la réparation.",
       icon: 'info',
       showCancelButton: true,
       confirmButtonText: 'Oui, consulter',
       cancelButtonText: 'Annuler'
     }).then((result) => {
       if (result.isConfirmed) {
        sessionStorage.setItem('FicheTechIsViewMode',"View");
        setTimeout(()=>{
          navigate("/fiche-tech?mode=voirFiche",{state : { reparation: reparation } });
        },40)
       }
     });
   }
 };

  useEffect(() => {
    fetchReparations();
  }, []);

  const fetchReparations = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/tech/getReparationsTerminees", null, headers);
      setReparations(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération des reparations terminées.");
    }
  };

  const filteredreparation= reparations
  .filter(reparation =>
    filter === 'Mohamed' ? reparation.technicien.prenom.toLowerCase() === 'mohamed' : filter === 'Ahmed' ? reparation.technicien.prenom.toLowerCase() === 'ahmed' : true
  )
  .filter(reparation =>
    reparation.demandeReparation.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reparation.id.toString().includes(searchTerm)
  )
  .filter(reparation => {
    return filterDate ? new Date(reparation.demandeReparation.dateDepot).toDateString() === new Date(filterDate).toDateString() : true;
  });


  const csvData = filteredreparation.map(reparation => ({
    ID: reparation?.id,
    Client: reparation?.demandeReparation?.client?.com,
    Description: reparation?.description,
    Technicien: reparation?.technicien?.nom,
    "Date Prévue": reparation?.dateFinReparation
  }));

  const totalPages = Math.ceil(filteredreparation.length / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredreparation.slice(indexOfFirstPart, indexOfLastPart);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleExportConfirmation = () => {
    Swal.fire({
      title: "Confirmer l'exportation",
      text: "Êtes-vous sûr de vouloir exporter les données en CSV ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, exporter",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si l'utilisateur confirme, déclencher l'exportation CSV
        document.getElementById("csv-export-link").click();
        Swal.fire({
          title: "Exportation réussie",
          text: "Les données ont été exportées avec succès.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <div className="w-full p-8 bg-white shadow-md">
      <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Historique des réparations</h2>
            <p className="text-sm text-gray-500">Voir les informations sur tous les historique des réparations</p>
          </div>
        <div className="flex items-center space-x-2">
        <button onClick={handleExportConfirmation} className="bg-gray-950 text-white py-2 px-4 rounded-lg">
            Exporter CSV
          </button>
          <CSVLink
            id="csv-export-link"
            data={csvData}
            filename="appareils_en_reparation.csv"
            className="hidden"
          />
        </div>
      </div>

      <div className="border-b border-gray-200"></div>
      <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')} className={`py-2 px-4 ${filter === "" ? "bg-gray-200" : "bg-white"} text-gray-800 border border-gray-300 rounded-lg`}>
            Tout
          </button>
          <button onClick={() => setFilter('Mohamed')} className={`py-2 px-4 ${filter === "Mohamed" ? "bg-gray-200" : "bg-white"} text-gray-600 border border-gray-300 rounded-lg`}>
            Mohamed
          </button>
          <button onClick={() => setFilter('Ahmed')} className={`py-2 px-4 ${filter === "Ahmed" ? "bg-gray-200" : "bg-white"} text-gray-600 border border-gray-300 rounded-lg`}>
            Ahmed
          </button>
          
          <input 
            type="text" 
            placeholder="Rechercher par nom de client..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="py-2 px-4 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded-lg"
          />
      </div>

      <table className="min-w-full border-collapse bg-white shadow sm:rounded-lg overflow-hidden ">
        <thead className="bg-gray-100">
          <tr className="text-sm text-gray-500">
            <th className="px-6 py-3 text-left  font-semibold border-b " >ID</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Client</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Description</th>
            <th className="px-6 py-3  text-left  font-semibold border-b " >Technicien</th>
            <th className="px-8 py-3  text-left  font-semibold border-b " >Appareil</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Date Depot</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Date Prévue </th>
            <th className="px-10 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParts.length > 0 ? (
            currentParts.map((reparation) => (
              <tr key={reparation?.id} className="bg-white border-b ">
                <td className="px-6 py-4">{reparation?.id}</td>
                <td className="px-6 py-4">{reparation?.demandeReparation?.client.nom}</td>
                <td className="px-6 py-4">{reparation?.description}</td>
                <td className="px-6 py-4">{reparation?.technicien?.nom}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-200 text-green-700">
                    {reparation.demandeReparation.appareil.numeroSerie}
                  </span>
                </td>
                <td className="px-6 py-4">{reparation?.demandeReparation?.dateDepot}</td>
                <td className="px-6 py-4">{reparation?.dateFinReparation}</td>
                <td  className="px-6 py-4 ">
                  <button onClick={() => handleAction(reparation, 'voirFiche')} className="block w-full text-left font-semibold px-4 py-2 text-sm text-blue-600 hover:text-blue-900">
                    Voir Fiche
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
            <td colSpan="7" className="text-center py-6">
            <div className="relative "> 
              <div className="flex flex-col items-center justify-center space-y-2">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl" />
                <p className="text-gray-600 text-lg">Aucune reparation trouvée.</p>
              </div>
            </div>
          </td>
          </tr>
          )}
        </tbody>
      </table>
      
      <div className="flex justify-between mt-4 items-center py-4">
            <button
              className="px-4 py-2  rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <span className="mr-2">←</span>PRÉCÉDENTE
            </button>
            <span className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2  rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              SUIVANTE <span className="ml-2">→</span> 
            </button>
        </div>
        <ToastContainer></ToastContainer>
    </div>
  );
};

export default ViewHistorique;
