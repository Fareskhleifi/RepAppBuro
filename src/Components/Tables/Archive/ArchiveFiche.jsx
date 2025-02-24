/* eslint-disable react/prop-types */
import { useState,useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {request} from '../../../Service/axios_helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; 
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const ProgressBar = ({ progress }) => {
  const getColor = (progress) => {
    switch (progress) {
      case "Terminé":
        return 'bg-green-500';
      case "En attente":
        return 'bg-[#e8e21e]';
        case "Irréparable":
          return 'bg-red-500';
      default:
        return 'bg-blue-600';
    }
  };
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${getColor(progress)}`}
        style={{ width: `${progress === "En attente" ? 100 : progress === "En cours" ? 50 : 100 }%` }}
      ></div>
    </div>
  );
};

const MySwal = withReactContent(Swal);

const ArchiveFiche = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [demandes, setdemandes] = useState([]);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/rsc/getDemandesArchivees",null,headers);
      setdemandes(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération des demandes.");
    }
  };

  const handleDesarchiver = async (demande) =>{
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      await request("put", `/rsc/desarchiverDemande?id=${demande.id}`, null,headers);
      toast.success("demande desarchivée avec succès!", { autoClose: 1300 });
      fetchDemandes();
    } catch (error) {
      toast.error("Erreur lors de la desarchivage de la demande.");
      console.error("Erreur:", error);
    }
  }

  const handleClick = (demande)=>{
    MySwal.fire({
      title: 'Confirmer la desarchivage',
      text: "Êtes-vous sûr de vouloir desarchiver la demande ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, desarchiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDesarchiver(demande);
      }
    });
  }


  const filteredDemande = demandes.filter(demande => 
    demande.client.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDemande.length / itemsPerPage);
  const currentDemande= filteredDemande.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  return (
    <div className="w-full p-6 bg-white shadow-md">
      <div className="flex justify-between items-center mb-1 ">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Fiche de reparation</h2>
            <p className="text-sm text-gray-500">Voir les informations sur toutes les fiches de réparation</p>
          </div>
          <div className="flex items-center space-x-4 py-6">
          <div className="ml-auto flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
      </div>
      </div>
      <div className="border-b mb-6 border-gray-200"></div>
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-500">
              <th className="py-2">ID</th>
              <th className="py-2">Client</th>
              <th className="py-2">Appareil</th>
              <th className="py-2">date de Depot</th>
              <th className="py-2">État </th>
              <th className="py-2">date de prévu</th>
              <th className="py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDemande.length > 0 ? (
            currentDemande.map((demande) => (
              <tr key={demande.id} className="border-t">
                <td className="flex items-center py-4 px-0 mr-4">
                  #{demande.id}
                </td>
                <td className="py-4">
                  <div className="flex  ">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Project Icon" className="rounded-full  w-6 h-6 mr-2" />
                      {demande.client.nom}
                  </div>
                </td>
                <td className="py-4">  {demande.appareil.designation}</td>
                <td className="py-4 "> <span className="bg-gray-100 px-3 py-0.5  rounded-full">{demande.dateDepot}</span></td>
                <td className="py-2">
                  <div className="block items-center space-y-1 mr-14">
                  <span className="text-xs font-semibold">{demande.etat === "Terminé" || demande.etat === "Irréparable" ? 100 : demande.etat === "En cours" ? 50 : 0}%</span>
                    <ProgressBar progress={demande.etat } />
                  </div>
                </td>
                <td className="py-4 "> <span className="bg-gray-100 px-2 py-0.5  rounded-full">{demande.datePrevueRemise}</span></td>
                <td  className="py-4 text-center relative">
                  {
                    demande.archived &&(
                      <button
                      onClick={()=>handleClick(demande)}
                        className="text-blue-600 text-left  text-sm hover:text-blue-800"
                      >
                        Desarchiver
                      </button>
                    )
                  }
                  <button
                    className="text-gray-500 px-4 hover:text-black"
                  > Télécharger
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6">
              <div className="relative top-6"> 
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl" />
                  <p className="text-gray-600 text-lg">Aucune fiche de réparation trouvée.</p>
                </div>
              </div>
            </td>
            </tr>
          )}
          </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">Page {currentPage} of {totalPages}</p>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            className="px-4 py-2 border  hover:bg-gray-300 transition duration-300 rounded-md text-sm flex items-center"
            disabled={currentPage === 1}
          >
            <span className="mr-2">←</span> PREC
          </button>
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            className="px-4 py-2 border  hover:bg-gray-300 transition duration-300 rounded-md text-sm flex items-center"
            disabled={currentPage === totalPages}
          >
            SUIV <span className="ml-2">→</span>
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default ArchiveFiche;
