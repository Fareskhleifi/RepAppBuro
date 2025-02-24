import { useState,useEffect } from 'react';
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {request} from '../../../Service/axios_helper';
import Cookies from 'js-cookie'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

export default function ArchiveFacture() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [factures, setFactures] = useState([]);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/rsc/getFacturesArchivees", null, headers);
      setFactures(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération des factures archivées.");
    }
  };

  const filteredInvoices = factures.filter(invoice => 
    invoice.nomClient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvoices.length / 10); 

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleDesarchiver = async (invoice) =>{
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      await request("put", `/rsc/desarchiverFacture?id=${invoice.idFacture}`, null,headers);
      toast.success("facture desarchivée avec succès!", { autoClose: 1300 });
      fetchFactures();
    } catch (error) {
      toast.error("Erreur lors de la desarchivage de la facture.");
      console.error("Erreur:", error);
    }
  }

  const handleClick = (invoice)=>{
    MySwal.fire({
      title: 'Confirmer la desarchivage',
      text: "Êtes-vous sûr de vouloir desarchiver la facture ?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, desarchiver',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        handleDesarchiver(invoice);
      }
    });
  }

  const voirFiche = async (invoice) => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get",`/rsc/${invoice.idReparation}/demande`, null, headers);
      const demande = response.data;
      navigate("/voir-facture", { state: { demande, invoice } });
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la récupération de la demande.");
    }
  };
  

  const handleVoirFacture = (invoice)=>{
    MySwal.fire({
      title: 'Confirmer la visualisation',
      text: "Êtes-vous sûr de vouloir voir la facture ?",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Oui, voir',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        voirFiche(invoice)
      }
    });

  }


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="flex justify-between items-center pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Liste des factures</h2>
          <p className="text-sm text-gray-500 dark:text-white" >Voir les informations sur toutes les factures</p>
        </div>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="Search..." 
            className="border border-gray-500 p-2 rounded-md" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="container mt-4 px-4 mx-auto">
        <div className="flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                      <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400">ID</th>
                      <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Client</th>
                      <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Montant Total</th>
                      <th className="px-12 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.slice((currentPage - 1) * 5, currentPage * 5).map(invoice => (
                      <tr key={invoice.idFacture}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">#{invoice.idFacture}</td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{invoice.dateFacture}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200">Payé</td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300"> <div className="flex items-center gap-x-2">
                            <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=81" alt="" />
                            <div>
                                <h2 className="text-sm font-medium text-gray-800 dark:text-white">{invoice.nomClient}</h2>
                            </div>
                        </div></td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">{invoice.montantTotal} (TND)</td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            {
                              invoice.archived &&(
                            <button onClick={()=>handleClick(invoice)} className="text-gray-500 hover:text-indigo-500 focus:outline-none">Desarchiver</button>
                              )}
                            <button onClick={()=>{handleVoirFacture(invoice)}} className="text-blue-500 hover:text-indigo-500 focus:outline-none">Voir</button>
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
                              <p className="text-gray-600 text-lg">Aucune facture trouvée.</p>
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

        <div className="flex items-center justify-between mt-6">
          <button onClick={handlePrevious} className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800" disabled={currentPage === 1}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span>previous</span>
          </button>

          <div className="items-center hidden md:flex gap-x-3">
            {/* Add pagination logic here */}
            {[...Array(totalPages).keys()].map(num => (
              <button key={num + 1} onClick={() => setCurrentPage(num + 1)} className={`px-2 py-1 text-sm rounded-md ${currentPage === num + 1 ? 'text-blue-500 bg-blue-100/60' : 'text-gray-500 hover:bg-gray-100'}`}>
                {num + 1}
              </button>
            ))}
          </div>

          <button onClick={handleNext} className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800" disabled={currentPage === totalPages}>
            <span>Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:-scale-x-100">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
