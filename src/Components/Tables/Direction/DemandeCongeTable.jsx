// import { useLocation } from "react-router-dom"
import { useState , useEffect} from "react";
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
import {request} from '../../../Service/axios_helper';
import Cookies from 'js-cookie';

export default function DemandeCongeTable() {

// const location = useLocation();
// const ViewAll = location.pathname === "/Demande-conge" ? true : false;
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const RSCPerPage = 10;
const [demandeConge, setDemandeConge] = useState([]);

useEffect(() => {
  fetchDemandeConge();
}, []);

const fetchDemandeConge = async () => {
  try {
    const token = sessionStorage.getItem('token') || Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await request("get", "/direction/getAllDemandeDeConge", null, headers);
    setDemandeConge(response.data);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Erreur lors de la récupération des demandes des congées.");
  }
};


const filteredRSC = demandeConge.filter((conge) =>{
    return conge.utilisateur.prenom.toLowerCase().includes(searchQuery.toLowerCase()) || conge.utilisateur.nom.toLowerCase().includes(searchQuery.toLowerCase());
});

const totalPages = Math.ceil(filteredRSC.length / RSCPerPage);
const indexOfLastRSC = currentPage * RSCPerPage;
const indexOfFirstRSC = indexOfLastRSC - RSCPerPage;
const currentTech = filteredRSC.slice(indexOfFirstRSC, indexOfLastRSC);

const handleNextPage = () => {
  setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
};

const handlePrevPage = () => {
  setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
};

  const handleAccepter = async(conge) => {
    const result = await MySwal.fire({
      title: "Confirmer l'acceptation",
      text: "Êtes-vous sûr de vouloir accepter ce congé ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, accepter",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };      
      await request("put", `/direction/accepterConge/${conge.id}`, null, headers);
      Swal.fire({
        title: "Confirmer l'acceptation",
        text: "congé accepter avec succès!",
        icon: "success",
      });
      fetchDemandeConge();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de l'acceptation du congé.");
    }
  };

  const handleRefuser = async(conge) => {
    const result = await MySwal.fire({
      title: "Confirmer la refusation",
      text: "Êtes-vous sûr de vouloir refuser ce congé ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, refuser",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };      
      await request("put", `/direction/refuserConge/${conge.id}`, null, headers);
      Swal.fire({
        title: "Confirmer la refusation",
        text: "congé refuser avec succès!",
        icon: "success",
      });
      fetchDemandeConge();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la refusation du congé.");
    }
  };
      
      
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Liste des demandes des congées</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-200">Voir les informations sur tous les demandes des congées</p>
                </div>
                <div className="flex space-x-3">
                    <div className="ml-auto flex items-center">
                        <input
                        type="text"
                        placeholder="Search"
                        className="border dark:text-gray-300 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-md font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Travailleur
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-md font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-md font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Date Debut
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-md font-normal text-left  text-gray-500 dark:text-gray-400">
                                           Date Fin
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-md font-normal text-left  text-gray-500 dark:text-gray-400">Type de congé</th>
                                        <th scope="col" className="px-14 py-3.5 text-md font-normal text-left   text-gray-500 dark:text-gray-400">Status</th>
                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="font-normal -ml-3">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {currentTech.length > 0 ? (
                                currentTech.map((conge, index) => (
                                    <tr   key={index}>
                                        <td className="px-4  py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <img className="object-cover w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt=""/>
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">{conge.utilisateur.prenom +" "+conge.utilisateur.nom}</h2>
                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">#Travailleur{conge.utilisateur.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{conge.utilisateur.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{conge.dateDebut}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{conge.dateFin}</td>
                                        <td className="px-10 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{conge.typeConge}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-gray-100/90 dark:bg-gray-800">
                                                <span className={`h-1.5 w-1.5 rounded-full ${conge.statut == "ACCEPTEE" ? 'bg-emerald-500' : conge.statut == "REJETEE" ? 'bg-red-500' : 'bg-yellow-500'} `}></span>
                                                <h2 className={`text-sm font-normal ${conge.statut == "ACCEPTEE" ? 'text-emerald-500' : conge.statut == "REJETEE" ? 'text-red-500' : 'text-yellow-500'} `}>{conge.statut}</h2>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-5">
                                                <button
                                                    onClick={()=>handleAccepter(conge)}
                                                    className={` ${conge.statut!="EN_ATTENTE" ? "opacity-80 text-gray-500" : "text-green-500 hover:text-green-700 transition-colors duration-200 dark:hover:text-green-700 dark:text-gray-300 "}   focus:outline-none`}
                                                    title="Accepter"
                                                    disabled={conge.statut!="EN_ATTENTE"}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 12.75l6 6 9-13.5"
                                                        />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={()=>handleRefuser(conge)}
                                                    className={`  ${conge.statut!="EN_ATTENTE" ? "opacity-80 text-gray-500" : "text-red-500 hover:text-red-700 transition-colors duration-200 dark:hover:text-red-700 dark:text-gray-300"} focus:outline-none`}
                                                    title="Refuser"
                                                    disabled={conge.statut!="EN_ATTENTE"}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                <td colSpan="7" className="text-center py-6">
                                <div className="relative "> 
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl" />
                                    <p className="text-gray-600 text-lg">Aucune demande de congé trouvée.</p>
                                    </div>
                                </div>
                                </td>
                                </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center py-4">
                <button
                    className="px-4 py-2 dark:text-gray-200 rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}>
                    <span className="mr-2 ">←</span>PRÉCÉDENTE
                </button>

                <span className="text-sm dark:text-gray-200 text-gray-500">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    className="px-4 dark:text-gray-200 py-2 rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}>
                    SUIVANTE <span className="ml-2">→</span> 
                </button>
            </div>
        <ToastContainer />
    </div>
  )
}
