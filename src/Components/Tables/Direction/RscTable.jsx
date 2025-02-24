import { Link,useLocation } from "react-router-dom"
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

export default function RscTable() {

const location = useLocation();
const ViewAll = location.pathname === "/Travailleurs-rsc" ? true : false;
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [selectedRSC, setSelectedRSC] = useState({ nom: '', prenom: '', email: '' , fonction: '', experience: '', telephone: '' });
const [showAddRSCForm, setShowAddRSCForm] = useState(false);
const RSCPerPage = ViewAll ? 5 : 10;
const [Rscs, setRscs] = useState([]);

useEffect(() => {
  fetchRscs();
}, []);

const fetchRscs = async () => {
  try {
    const token = sessionStorage.getItem('token') || Cookies.get('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await request("get", "/direction/getAllRscs", null, headers);
    setRscs(response.data);
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    toast.error("Erreur lors de la récupération des Responsables service clients.");
  }
};


const filteredRSC = Rscs.filter((member) =>{
    return member.prenom.toLowerCase().includes(searchQuery.toLowerCase()) || member.nom.toLowerCase().includes(searchQuery.toLowerCase());
});

const totalPages = Math.ceil(filteredRSC.length / RSCPerPage);
const indexOfLastRSC = currentPage * RSCPerPage;
const indexOfFirstRSC = indexOfLastRSC - RSCPerPage;
const currentTech = filteredRSC.slice(indexOfFirstRSC, indexOfLastRSC);

  const handleNextPage = () => {
    if (currentPage < 10) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAddRSC = () => {
    setShowAddRSCForm(true);
    setSelectedRSC({ nom: '', prenom: '', email: '' , fonction: '', experience: '', telephone: '' });
  };

  const handleEditRSC= (RSC) => {
    setSelectedRSC(RSC);
    setShowAddRSCForm(true);
  };

  const handleTableRSC = () => {
    setShowAddRSCForm(false);
    setSelectedRSC({ nom: '', prenom: '', email: '' , fonction: '', experience: '', telephone: '' });
  };

  const handleAddRSCSuccess = async () =>
  {
    const rscData = {
      id: selectedRSC.id, 
      nom: selectedRSC.nom,
      prenom: selectedRSC.prenom,
      email: selectedRSC.email,
      telephone: selectedRSC.telephone,
      experience: selectedRSC.experience,
      fonction: selectedRSC.fonction
    };
  
    const isEdit = Boolean(selectedRSC.id);
    const confirmationMessage = !isEdit
      ? "Êtes-vous sûr de vouloir modifier ce responsable ?"
      : "Êtes-vous sûr de vouloir ajouter ce responsable ?";
    const actionTitle = isEdit ? "Modifier RSC" : "Ajouter RSC";
    const apiUrl = isEdit ? "/direction/updateRsc" : "/direction/signupRsc";
  
    const result = await MySwal.fire({
      title: `Confirmer ${isEdit ? "la modification" : "l'ajout"}`,
      text: confirmationMessage,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, confirmer",
      cancelButtonText: "Annuler",
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };
      await request(isEdit ? "put" : "post", apiUrl, rscData, headers);
      Swal.fire({
        title: `${actionTitle} réussie`,
        text: `Responsable ${isEdit ? "modifié" : "ajouté"} avec succès!`,
        icon: "success",
      });
      setShowAddRSCForm(false);
      setSelectedRSC({ nom: '', prenom: '', email: '' , fonction: '', experience: '', telephone: '' });
      fetchRscs();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(`Erreur lors de ${isEdit ? "la modification" : "l'ajout"} du responsable.`);
    }
  };

  const handleSupprimer = async(RscId) => {
    const result = await MySwal.fire({
      title: "Confirmer la suppression",
      text: "Êtes-vous sûr de vouloir supprimer ce responsable ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };      
      await request("delete", `/direction/DeleteRsc?id=${RscId}`, null, headers);
      Swal.fire({
        title: "Confirmer la supression",
        text: "responsable supprimé avec succès!",
        icon: "success",
      });
      fetchRscs();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la suppression du responsable.");
    }
  };

  const renderAddRSCForm = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {selectedRSC.id ? "Modifier RSC" : "Ajouter Nouveau RSC"}
      </h2>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddRSCSuccess();
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, nom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Entrer nom"
              defaultValue={selectedRSC?.nom || ""}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Prenom
            </label>
            <input
              type="text"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, prenom: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Entrer prenom"
              defaultValue={selectedRSC?.prenom || ""}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Adresse Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Entrer email"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, email: e.target.value })}
              defaultValue={selectedRSC?.email || ""}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Poste
            </label>
            <input
              type="text"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, fonction: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Entrer poste"
              defaultValue={selectedRSC?.fonction || ""}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Expérience (années)
            </label>
            <input
              type="number"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, experience: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Années d'expérience"
              defaultValue={selectedRSC?.experience || ""}
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
                Telephone
            </label>
            <input
              type="text"
              onChange={(e) => setSelectedRSC({ ...selectedRSC, telephone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              placeholder="Nombre de clients gérés"
              defaultValue={selectedRSC?.telephone || ""}
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full"
          >
            {selectedRSC.id ? "Modifier RSC" : "Ajouter RSC"}
          </button>
          <button
            onClick={handleTableRSC}
            type="button"
            className="bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300 w-full"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
      
      
  return (
    <div className="p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
    {showAddRSCForm ? (
        renderAddRSCForm()
      ) : (
        <>
            <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Liste des responsables service Client</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-200">Voir les informations sur tous les responsables service Client</p>
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
                    { !ViewAll &&
                    <Link to="/Travailleurs-rsc">
                        <button  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            VOIR TOUT
                        </button>
                    </Link>}
                    <button onClick={handleAddRSC}  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
                    <span className="inline-block">AJOUTER UN RSC</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Nom & Matricule
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Email
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">
                                            Telephone
                                        </th>
                                        <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">
                                           Status
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">Poste</th>
                                        <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left  text-gray-500 dark:text-gray-400">Expérience</th>
                                        <th scope="col" className="relative py-3.5 px-4">
                                            <span className="font-normal">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {currentTech.length > 0 ? (
                                currentTech.map((RSC, index) => (
                                    <tr   key={index}>
                                        <td className="px-4  py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <img className="object-cover w-10 h-10 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" alt=""/>
                                                    <div>
                                                        <h2 className="font-medium text-gray-800 dark:text-white ">{RSC.prenom +" "+RSC.nom}</h2>
                                                        <p className="text-sm font-normal text-gray-600 dark:text-gray-400">#RSC{RSC.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{RSC.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{RSC.telephone}</td>
                                        <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full gap-x-2 ${RSC.status == "ACTIF" ? "bg-emerald-100/60" : "bg-red-100/60"} dark:bg-gray-800`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${RSC.status == "ACTIF" ? 'bg-emerald-500' : 'bg-red-500'} `}></span>

                                                <h2 className={`text-sm font-normal ${RSC.status == "ACTIF" ? 'text-emerald-500' : 'text-red-500'} `}>{RSC.status}</h2>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">{RSC.fonction}</td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-2">
                                                <p className="px-4 py-1 text-xs text-indigo-500 rounded-full dark:bg-gray-800 bg-indigo-100/60">{RSC.experience}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-6">
                                                <button onClick={()=>handleSupprimer(RSC.id)} className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>

                                                <button onClick={() => handleEditRSC(RSC)} className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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
                                        <p className="text-gray-600 text-lg">Aucune RSC trouvée.</p>
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
        </>
        )}
        <ToastContainer />
    </div>
  )
}
