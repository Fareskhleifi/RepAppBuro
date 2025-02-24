/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import FicheReparation from "../../fiche/FicheReparation";
import {request} from '../../../Service/axios_helper';
import Cookies from 'js-cookie'; 

const ViewAllClientsForFiche = ({setShowClientTable}) => {

  const MySwal = withReactContent(Swal);

  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 6;
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null); 
  const [show, setShow] = useState(false);

  const handleClick = (client) => {
    setSelectedClient(client);
    setShow(true);
  };



  const fetchClients = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/rsc/getAllClients",null,headers);
      setClients(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des clients.");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.nom.toLowerCase().includes(searchQuery.toLowerCase());  
    return matchesSearch;
  });


  const totalPages = Math.ceil(filteredClients.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredClients.slice(indexOfFirstMember, indexOfLastMember);

  const handleAddClientSubmit = async (e) => {
    e.preventDefault();
    const newClient = {
      nom: e.target.nom.value,
      email: e.target.email.value,
      adresse: e.target.adresse.value,
      telephone: e.target.telephone.value,
    };
    try {
      {
        const token = sessionStorage.getItem('token') || Cookies.get('token');
        const headers = { Authorization: `Bearer ${token}` };
        await request("post", "/rsc/addClient", newClient,headers);
        toast.success("Client ajouté avec succès!",
          {
            autoClose: 1300,
          }
        );
      }
      fetchClients();
      setSearchQuery('')
      setShowAddClientForm(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout ou de la modification du client.");
    }
  };

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
  };
  
  const handleTableClient = () => {
    setShowAddClientForm(false);
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
    <div className="p-8 bg-white rounded-lg shadow-lg">
      {show ? (
        <FicheReparation setShowClientTable={setShowClientTable} member={selectedClient} onBack={() => {
          setShow(false);
          setSelectedClient(null);
        }} />
      ) : showAddClientForm ? (
        renderAddClientForm()
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 pb-6 border-gray-200">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Liste des clients</h2>
              <p className="text-sm text-gray-500">Voir les informations sur tous les clients</p>
              
            </div>
            <div className="flex space-x-4">
              <input type="text" placeholder="Search" className="border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button onClick={() => { setShowClientTable(true); }} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">Annuler</button>
            </div>
          </div>
          <p className="text-xl text-center mb-4 text-gray-900">sélectionner un client</p>
          <table className="min-w-full border-collapse bg-white shadow overflow-hidden sm:rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Client</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Adresse</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Avoir une réparation</th>
                <th className="px-8 py-3 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Telephone</th>
              </tr>
            </thead>
            <tbody>
          {currentMembers.length > 0 ? (
            currentMembers.map((client, index) => (
              <tr key={index}  onClick={() => handleClick(client)}  className="bg-white cursor-pointer border-b hover:bg-gray-50">
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
                      client.demandesEnCours > 0 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {client.demandesEnCours > 0 ? client.demandesEnCours : "Non"}
                  </span>
                </td>
                <td className="px-6 py-2 text-md text-gray-600">{client.telephone}</td>
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

          <div className="flex justify-between items-center mt-6">
            <button onClick={handlePrevPage} disabled={currentPage === 1} className={`py-2 px-4 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Prev
            </button>
            <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={`py-2 px-4 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Next
            </button>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewAllClientsForFiche;
