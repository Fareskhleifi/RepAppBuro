import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom"; 
import Cookies from 'js-cookie';
import {request} from '../../../Service/axios_helper'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppareilAReparaerTable = () => {

  const [actionMenuVisible, setActionMenuVisible] = useState({});
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 5; 
  const [reparations, setReparations] = useState([]);

  useEffect(() => {
    fetchReparations();
  }, []);

  const fetchReparations = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/tech/getReparationsNonTerminees", null, headers);
      setReparations(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération des reparations terminées.");
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

  const toggleActionMenu = (reparationId) => {
    setActionMenuVisible((prev) => ({
      ...prev,
      [reparationId]: !prev[reparationId]
    }));
  };

  const handleMouseLeave = () => {
    setActionMenuVisible({});
  };

  const handleAction = (reparation, action) => {
    if (action === 'terminer') {
      Swal.fire({
        title: 'Marquer comme terminé?',
        text: "Confirmer la fin de réparation pour cet reparation.",
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Oui, terminé',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.setItem('FicheTechIsViewMode',"Update");
          setTimeout(()=>{
            navigate("/fiche-tech",{state : { reparation: reparation } });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          },500);
        }
      });
    } else if (action === 'commencer') {
      Swal.fire({
        title: 'Commencer la réparation?',
        text: "Confirmer le début de la réparation pour cet reparation.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Oui, commencer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          const token = sessionStorage.getItem('token') || Cookies.get('token');
          const headers = { Authorization: `Bearer ${token}` };
          request('put', `/tech/commanceReparation/${reparation.demandeReparation.id}`, null, headers)
            .then(() => {
              toast.success("L'état de la demande a été mis à jour.", {
                autoClose: 1300,
              });
              setTimeout(()=>{
                // fetchReparations()
                window.location.reload();
              },1350);
            })
            .catch((error) => {
              toast.error('Erreur', error.response?.data || 'Une erreur est survenue.', {
                autoClose: 1300,
              });
            });
        }
      });
    } else if (action === 'annuler') {
      Swal.fire({
        title: "Marquer l'appreil comme irréparable?",
        text: "Confirmer que l'appareil pour cet reparation est irréparable .",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, confirmer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          const token = sessionStorage.getItem('token') || Cookies.get('token');
          const headers = { Authorization: `Bearer ${token}` };
          request('put', `/tech/irreparable/${reparation.id}`, null, headers)
            .then(() => {
              toast.success("L'état de la demande a été mis à jour.", {
                autoClose: 1300,
              });
              setTimeout(()=>{
                // fetchReparations()
                window.location.reload();
              },1350);
            })
            .catch((error) => {
              toast.error('Erreur', error.response?.data || 'Une erreur est survenue.', {
                autoClose: 1300,
              });
            });
        }
      });
    } else if (action === 'voirFiche') {
      Swal.fire({
        title: 'Voir la fiche de réparation?',
        text: "Vous allez consulter la fiche sans modifier l'état de la réparation.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Oui, consulter',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.setItem('FicheTechIsViewMode',"View");
          setTimeout(()=>{
          navigate("/fiche-tech?mode=voirFiche",{state : { reparation: reparation } });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },500);
        }
      });
    }
  };
  
  

  const filteredreparations = reparations
  .filter(reparation =>
    filter === 'enCours' ? reparation.demandeReparation.etat === 'En cours' : filter === 'enAttente' ? reparation.demandeReparation.etat === 'En attente' : true
  )
  .filter(reparation =>
    reparation.demandeReparation.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reparation.id.toString().includes(searchTerm)
  )
  .filter(reparation => {
    return filterDate ? new Date(reparation.demandeReparation.dateDepot).toDateString() === new Date(filterDate).toDateString() : true;
  });



  const csvData = filteredreparations.map(reparation => ({
    ID: reparation.id,
    Client: reparation.demandeReparation.client.com,
    Description: reparation.description,
    "Date Prévue": reparation.dateFinReparation
  }));

  const totalPages = Math.ceil(filteredreparations.length / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredreparations.slice(indexOfFirstPart, indexOfLastPart);

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
      <h2 className="text-2xl font-semibold text-gray-800">Appareil en Réparation</h2>
      <p className="text-sm text-gray-500">Voir les informations sur tous les réparations a finaliser</p>
          </div>
        <div className="flex items-center space-x-2">
           <Link to={"/pending-repairs"}>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                VOIR TOUT
            </button>
          </Link>
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
          <button onClick={() => setFilter('enCours')} className={`py-2 px-4 ${filter === "enCours" ? "bg-gray-200" : "bg-white"} text-gray-600 border border-gray-300 rounded-lg`}>
            En Cours
          </button>
          <button onClick={() => setFilter('enAttente')} className={`py-2 px-4 ${filter === "enAttente" ? "bg-gray-200" : "bg-white"} text-gray-600 border border-gray-300 rounded-lg`}>
            En Attente
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
            <th className="px-6 py-3 text-left  font-semibold border-b " >Appareil</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Symptomes Panne</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Date Depot</th>
            <th className="px-8 py-3  text-left  font-semibold border-b " >État</th>
            <th className="px-6 py-3 text-left  font-semibold border-b " >Date Prévue Remise</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentParts.length > 0 ? (
            currentParts.map((reparation) => (
              <tr key={reparation.id} className="bg-white border-b  hover:bg-gray-50">
                <td className="px-6 py-4">{reparation.id}</td>
                <td className="px-6 py-4">{reparation.demandeReparation.client.nom}</td>
                <td className="px-6 py-4">{reparation.demandeReparation.appareil.numeroSerie}</td>
                <td className="px-6 py-4">{reparation.demandeReparation.symptomesPanne}</td>
                <td className="px-6 py-4">{reparation.demandeReparation.dateDepot}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${reparation.demandeReparation.etat==="En attente" ? "bg-yellow-300 text-white" : "bg-blue-600 text-white"}`}>
                    {reparation.demandeReparation.etat}
                  </span>
                </td>
                <td className="px-6 py-4">{reparation.demandeReparation.datePrevueRemise}</td>
                <td onMouseLeave={handleMouseLeave}  className="px-6 py-4 ">
                  <button onClick={() => toggleActionMenu(reparation.id)} className="text-gray-500 px-4 hover:text-black">
                    <FontAwesomeIcon icon={faEllipsisH} className="text-2xl" />
                  </button>
                  {actionMenuVisible[reparation.id] && (
                    <div ref={menuRef} className="bg-white py-1 shadow-lg border w-44 mt-2 absolute right-10 z-10">
                      <button onClick={() => handleAction(reparation, 'voirFiche')} className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100">
                        Voir Fiche
                      </button>
                      {reparation.demandeReparation.etat=="En cours" ?  (
                        <>
                         <button onClick={() => handleAction(reparation, 'annuler')} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          Irréparable
                        </button>
                        <button onClick={() => handleAction(reparation, 'terminer')} className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100">
                          Finaliser
                        </button>
                      </>
                      ):(
                        <>
                        <button onClick={() => handleAction(reparation, 'commencer')} className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100">
                          Commencer
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
        <ToastContainer/>
    </div>
  );
};

export default AppareilAReparaerTable;
