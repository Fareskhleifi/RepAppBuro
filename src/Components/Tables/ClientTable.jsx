/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);
import {request} from '../../Service/axios_helper';
import Cookies from 'js-cookie';
import { useAuth } from '../../contextHook/AuthContext';

const ClientTable = () => {
  const location = useLocation();
  const pathName = location.pathname; 
  const [clients, setClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = pathName == '/dashboard' ? 4 : 10 ;
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [selectedClient, setSelectedClient] = useState(null); 
  const { role } = useAuth();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/rsc/getAllClients", null, headers);
      setClients(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des clients.");
    }
  };

  const handleAddClientSubmit = async (e) => {
    e.preventDefault();
  
    const newClient = {
      nom: e.target.nom.value,
      email: e.target.email.value,
      adresse: e.target.adresse.value,
      telephone: e.target.telephone.value,
    };
  
    const confirmationMessage = selectedClient
      ? "Êtes-vous sûr de vouloir modifier ce client ?"
      : "Êtes-vous sûr de vouloir ajouter ce client ?";
  
    const result = await MySwal.fire({
      title: <strong>Confirmation</strong>,
      html: <p>{confirmationMessage}</p>,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, ajouter",
      cancelButtonText: "Annuler",
    });
  
    if (!result.isConfirmed) {
      return;
    }
  
    try {
      const token = sessionStorage.getItem("token") || Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };
  
      if (selectedClient) {
        const oldClient = {
          id: selectedClient.id,
          nom: e.target.nom.value,
          email: e.target.email.value,
          adresse: e.target.adresse.value,
          telephone: e.target.telephone.value,
        };
  
        await request("put", "/rsc/UpdateClient", oldClient, headers);
        Swal.fire({
          title: "Modification confirmée",
          text: "Client modifié avec succès!",
          icon: "success",
        });
      } else {
        await request("post", "/rsc/addClient", newClient, headers);
        Swal.fire({
          title: "Ajoutation confirmée",
          text: "Client ajouté avec succès!",
          icon: "success",
        });
      }
      fetchClients();
      setShowAddClientForm(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la modification du client.");
    }
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "avec"
        ? client.demandesEnCours && client.demandesEnCours > 0
        : filter === "sans"
        ? !client.demandesEnCours || client.demandesEnCours === 0
        : true;
      
    return matchesSearch && matchesFilter;
  });


  const totalPages = Math.ceil(filteredClients.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredClients.slice(indexOfFirstMember, indexOfLastMember);

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

  const handleAddClient = () => {
    setShowAddClientForm(true);
    setSelectedClient(null);
  };

  const handleEditClient = (client) => {
    setSelectedClient(client);
    setShowAddClientForm(true);
  };

  const handleTableClient = () => {
    setShowAddClientForm(false);
  };

  const handleModifier = (client) => {
    MySwal.fire({
      title: 'Confirmer la modification',
      text: "Êtes-vous sûr de vouloir modifier cet client ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler'
      }).then((result) => {
          if (result.isConfirmed) {
            handleEditClient(client)
          }
      });
  };

const handleSupprimerClient = async(client)=>{
  try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      await request("delete", `/direction/deleteClient?id=${client.id}`, client,headers);
      Swal.fire({
        title: "supprime confirmée",
        text: "Client supprimé avec succès!",
        icon: "success",
      });
      fetchClients();
  } catch (error) {
    toast.error("Erreur lors de la suppression du client.");
  }

}


  const handleSupprimer = (client) => {
    MySwal.fire({
      title: 'Confirmer la suppression',
      text: "Êtes-vous sûr de vouloir supprimer cet client ?",
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
      }).then((result) => {
          if (result.isConfirmed) {
            handleSupprimerClient(client)
          }
      });
  };

  const renderAddClientForm = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {selectedClient ? "Modifier Client" : "Ajouter Nouveau Client"}
      </h2>
      <form className="space-y-6" onSubmit={handleAddClientSubmit}>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Nom
          </label>
          <input
            name="nom"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Entrez le nom"
            defaultValue={selectedClient?.nom || ""}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Entrez l'email"
            defaultValue={selectedClient?.email || ""}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Adresse
          </label>
          <input
            name="adresse"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Entrez l'adresse"
            defaultValue={selectedClient?.adresse || ""}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">
            Téléphone
          </label>
          <input
            name="telephone"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Entrez le téléphone"
            defaultValue={selectedClient?.telephone || ""}
            required
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
          >
            {selectedClient ? "Modifier" : "Ajouter"}
          </button>
          <button
            type="button"
            onClick={handleTableClient}
            className="bg-gray-600 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
  

  return (
    <div className="p-8 bg-white   rounded-lg shadow-lg dark:bg-gray-800 ">
       {showAddClientForm ? (
        renderAddClientForm()
      ) : (
        <>
        <div className="flex  justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Liste des clients</h2>
            <p className="text-sm text-gray-500 dark:text-gray-200">Voir les informations sur tous les clients</p>
          </div>
          <div className="flex space-x-3">
            {
              pathName == '/dashboard' &&(
            <Link to="/clients">
              <button  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                VOIR TOUT
              </button>
            </Link>)}
            <button onClick={handleAddClient} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
              <span className="inline-block">AJOUTER UN CLIENT</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')}  className={`py-2 px-4 rounded-md ${filter==="" ? "bg-gray-200" : "bg-white" } text-gray-800 font-medium border border-gray-300 hover:bg-gray-200`}>
            Tout
          </button>
          <button onClick={() => setFilter('avec')}  className={`py-2 px-4 rounded-md ${filter==="avec" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
          Clients avec réparation en cours
          </button>
          <button onClick={() => setFilter('sans')}  className={`py-2 px-4 rounded-md ${filter==="sans" ? "bg-gray-200" : "bg-white" } text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
          Clients sans réparation en cours
          </button>
          <div className="ml-auto flex items-center">
            <input
              type="text"
              placeholder="Search"
              className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          
          </div>
        </div>

        <table className="min-w-full border-collapse  bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Client</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Adresse</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Avoir une réparation</th>
              <th className="px-8 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Telephone</th>
              <th className="px-6 py-3 dark:text-gray-200">Action</th>
            </tr>
          </thead>
          <tbody className="">
          {currentMembers.length > 0 ? (
            currentMembers.map((client, index) => (
              <tr key={index} className="bg-white border-b  dark:bg-gray-900 hover:bg-gray-50">
                <td className="px-6  py-2">
                  <div className="flex items-center">
                    <img
                      src={`https://i.pravatar.cc/150?img=${client.id}`}
                      alt={client.nom}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold dark:text-gray-300 text-gray-800">{client.nom}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-2">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-300">{client.adresse}</p>
                  </div>
                </td>
                <td className="px-14 py-2">
                  <span
                    className={`py-1 px-3 rounded-full text-white text-sm ${
                      client.demandesEnCours  > 0 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {client.demandesEnCours != 0 ? client.demandesEnCours : "Non"}
                  </span>
                </td>
                <td className="px-6 py-2 text-md text-gray-600">{client.telephone}</td>
                <td className="px-4 py-2 text-sm whitespace-nowrap ">
                  <div className="flex px-4 py-4 justify-center items-center gap-x-6">
                    <button onClick={() => handleModifier(client)} className="text-gray-500 hover:text-gray-800 transition duration-300">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232a3 3 0 114.242 4.242l-4.242-4.242zM3 17.25V21h3.75l12.91-12.91-4.242-4.242L3 17.25z"
                        />
                      </svg>
                    </button>
                    {
                      role==="DIRECTION" && (
                        <button onClick={()=> handleSupprimer(client)} className="text-gray-500 transition-colors duration-200 dark:hover:text-red-500 dark:text-gray-300 hover:text-red-500 focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                      </button>
                      )
                    }
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
                    <p className="text-gray-600 text-lg">Aucune client trouvée.</p>
                    <button onClick={handleAddClient} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
              <span className="inline-block">AJOUTER UN CLIENT</span>
            </button>
                  </div>
                </div>
              </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center py-4">
            <button
                className="px-4 py-2 dark:text-gray-300 rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
                onClick={handlePrevPage}
                disabled={currentPage === 1}>
                <span className="mr-2">←</span>PRÉCÉDENTE
            </button>

            <span className="text-sm dark:text-gray-300  text-gray-500">
                Page {currentPage} of {totalPages}
            </span>

            <button
                className="px-4 py-2 dark:text-gray-300  rounded-md border text-gray-600 hover:bg-gray-300 transition duration-300"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}>
                SUIVANTE <span className="ml-2">→</span> 
            </button>
        </div>
        </>
      )}
       <ToastContainer />
    </div>
  );
};

export default ClientTable;
