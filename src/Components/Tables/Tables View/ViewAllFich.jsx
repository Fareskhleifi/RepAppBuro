/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import ViewAllClientsForFiche from "./ViewAllClientsForFiche";
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../../contextHook/AuthContext';
import {request} from '../../../Service/axios_helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie'; 


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

const ViewAllFich = ({ showListClient = true }) => {

  const { role } = useAuth();

  const [actionMenuVisible, setActionMenuVisible] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');
  const [showClientTable, setShowClientTable] = useState(showListClient);
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const menuRef = useRef(null);
  const [demandes, setdemandes] = useState([]);
  const [statutsPaiement, setStatutsPaiement] = useState({});

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/rsc/getDemandesActives",null,headers);
      setdemandes(response.data);

      const statuts = await Promise.all(
        response.data.map(demande => 
          request("get", `/rsc/demande/isPayee/${demande.id}`, null, headers)
            .then(res => ({ id: demande.id, paye: res.data }))
        )
      );
  
      const statutsMap = statuts.reduce((acc, cur) => {
        acc[cur.id] = cur.paye;
        return acc;
      }, {});
      setStatutsPaiement(statutsMap);
    } catch (error) {
      toast.error("Erreur lors de la récupération des demandes.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuVisible({});
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseLeave = () => {
    setActionMenuVisible({});
  };

  const toggleActionMenu = (projectId) => {
    setActionMenuVisible((prev) => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleArchive = async (demande) => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      await request("put", `/rsc/archiverDemande?id=${demande.id}`, null,headers);
      toast.success("Demande archivée avec succès!", { autoClose: 1300 });
      fetchDemandes();
    } catch (error) {
      toast.error("Erreur lors de l'archivage de la demande.");
      console.error("Erreur:", error);
    }
  };

  const handleAnnuler = async (demande) => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      console.log(demande.id);
      await request("put", `/rsc/deleteDemande?id=${demande.id}`, null,headers);
      toast.success("Demande supprimée avec succès!", { autoClose: 1300 });
      fetchDemandes();
    } catch (error) {
      toast.error("Erreur lors de la suppression de la demande.");
      console.error("Erreur:", error);
    }
  };

  const handleAction = (action,demande) => {
    if (action === 'Générer une facture' && demande) {
      MySwal.fire({
        title: 'Confirmer la facturation',
        text: "Êtes-vous sûr de vouloir générer la facture ?",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Oui, générer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/facture-page", { state: demande });
        }
      });
    } else if (action === 'Archiver' && demande) {
      MySwal.fire({
        title: 'Confirmer l\'archivage',
        text: "Êtes-vous sûr de vouloir archiver ce projet ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, archiver',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          handleArchive(demande)
        }
      });
    } else if (action === 'Consulter' && demande) {
      MySwal.fire({
        title: 'Confirmer la consultation',
        text: "Êtes-vous sûr de vouloir consulter ce fiche ?",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Oui, consulter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(demande);
          navigate("/fiche-rsc?mode=voirFiche", { state: demande });
        }
      });
    } else if (action === 'Modifier' && demande) {
      MySwal.fire({
        title: 'Confirmer la modification',
        text: "Êtes-vous sûr de vouloir modifier ce fiche ?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, modifier',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/fiche-rsc", { state: demande });
        }
      });
    } else if (action === 'Annuler' && demande) {
      MySwal.fire({
        title: 'Confirmer l\'annulation',
        text: "Êtes-vous sûr de vouloir annuler ce projet ?",
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Oui, annuler',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          handleAnnuler(demande);
        }
      });
    } else {
      console.log(`Action ${action} effectuée`);
    }
  };
  
  const filteredProjects = demandes.filter(demande => {
    const matchesSearch = demande.client.nom.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesProgress;
  
    switch (filter) {
      case 'enCours':
        matchesProgress = demande.etat === "En cours";
        break;
      case 'terminée':
        matchesProgress = demande.etat === "Terminé";
        break;
      case 'enAttente':
        matchesProgress = demande.etat === "En attente";
        break;
      case 'irréparable':
        matchesProgress = demande.etat === "Irréparable";
        break;
      default:
        matchesProgress = true;
        break;
    }
  
    return matchesSearch && matchesProgress;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const currentProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRepair = () => {
    setShowClientTable(false);
  }

  return (
    showClientTable ? (
    <div className="w-full p-8 bg-white shadow-md">
      <div className="flex justify-between items-center mb-6 ">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Fiche de reparation</h2>
            <p className="text-sm text-gray-500">Voir les informations sur toutes les fiches de réparation</p>
          </div>
        <div className="flex items-center space-x-2">
          {
            role === "DIRECTION" ? 
            ( <button 
              className="px-4 py-2 bg-black text-white rounded-md">
                Exporte en csv
              </button> 
              ) : (
                <button onClick={handleRepair} 
                className="px-4 py-2 bg-black text-white rounded-md">
                  NOUVELLE FICHE DE REPARATION
                </button> )
            };
        </div>
      </div>
      <div className="border-b border-gray-200"></div>
      <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')} className={`py-2 px-4 rounded-md ${filter==="" ? "bg-gray-200" : "bg-white" } text-gray-800 font-medium border border-gray-300 hover:bg-gray-200`}>
              Tout
          </button>
          <button  onClick={() => setFilter('irréparable')} className={`py-2 px-4 rounded-md ${filter==="irréparable" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
              Réparation irréparable
          </button>
          <button  onClick={() => setFilter('enCours')} className={`py-2 px-4 rounded-md ${filter==="enCours" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
              Réparation en cours
          </button>
          <button  onClick={() => setFilter('enAttente')} className={`py-2 px-4 rounded-md ${filter==="enAttente" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
              Réparation en attente
          </button>
          <button onClick={() => setFilter('terminée')} className={`py-2 px-4 rounded-md ${filter==="terminée" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
              Réparation terminée
          </button>
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

      <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500">
              <th className="py-2">ID</th>
              <th className="py-2">Client</th>
              <th className="py-2">Appareil</th>
              <th className="py-2">date de Depot</th>
              <th className="py-2">État </th>
              <th className="py-2">date de prévu</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentProjects.length > 0 ? (
            currentProjects.map((demande) => (
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
                <td className="py-4 "> <span className={` ${statutsPaiement[demande.id] ? "text-green-600" : demande.etat=="Irréparable" ? "text-green-600" : "text-red-600"} px-2 py-0.5  rounded-full`}>{statutsPaiement[demande.id] ? "Payé" : demande.etat=="Irréparable" ? "Sans facturation" :  "impayé"}</span></td>
                <td onMouseLeave={handleMouseLeave}  className="py-4 relative">
                { role=== "DIRECTION" ? 
                  (                        <button
                    onClick={() => handleAction('Consulter',demande)}
                    className="text-blue-600 text-left  text-sm hover:text-blue-800"
                  >
                    Consulter
                  </button>) : (
                  <button 
                    onClick={() => toggleActionMenu(demande.id)}
                    className="text-gray-500 px-4 hover:text-black"
                  >
                    <FontAwesomeIcon icon={faEllipsisH} className="text-lg" />
                  </button> )
                  }
                  {actionMenuVisible[demande.id] && (
                  <div ref={menuRef} className="bg-white py-1 shadow-lg border w-40 mt-2 absolute right-0 z-10">
                    {demande.etat === "Terminé" || demande.etat === "Irréparable" ? (
                      <>
                      { (statutsPaiement[demande.id] || demande.etat === "Irréparable") &&(
                        <button
                          onClick={() => handleAction('Archiver',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Archiver
                        </button>)
                      }
                        <button
                          onClick={() => handleAction('Consulter',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Consulter
                        </button>
                        {
                          !statutsPaiement[demande.id] && demande.etat != "Irréparable" && (
                                <button
                                onClick={() => handleAction('Générer une facture',demande)}
                                className="block text-left w-full text-green-700 px-5 py-3 text-sm hover:bg-gray-100"
                              >
                                Facture
                              </button>
                          )
                        }
                      </>
                    ) : demande.etat === "En cours" ? (
                      <>
                        <button
                          onClick={() => handleAction('Consulter',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Consulter
                        </button>
                        <button
                          onClick={() => handleAction('Modifier',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Modifier
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAction('Annuler',demande)}
                          className="block text-red-600 text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleAction('Consulter',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Consulter
                        </button>
                        <button
                          onClick={() => handleAction('Modifier',demande)}
                          className="block text-left w-full px-5 py-3 text-sm hover:bg-gray-100"
                        >
                          Modifier
                        </button>
                      </>
                    )}
                  </div>
                )}
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
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            className="px-4 py-2 border  hover:bg-gray-300 transition duration-300 rounded-md text-sm flex items-center"
            disabled={currentPage === 1}
          >
            <span className="mr-2">←</span> PREC
          </button>
          <span className="text-sm text-gray-500">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
            className="px-4 py-2 border  hover:bg-gray-300 transition duration-300 rounded-md text-sm flex items-center"
            disabled={currentPage === totalPages}
          >
            SUIV <span className="ml-2">→</span>
          </button>
      </div>
      <ToastContainer></ToastContainer>
    </div>
    ) : (
      <ViewAllClientsForFiche setShowClientTable={setShowClientTable}></ViewAllClientsForFiche>
    )
  );
};

export default ViewAllFich;
