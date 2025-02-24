/* eslint-disable no-unused-vars */
import { useState,useEffect } from "react";
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import {request} from '../../../Service/axios_helper'
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(Swal);


const PiecesDemandeesTable = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryDate, setSearchQueryDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 10; 
  const [filter, setFilter] = useState('');
  const [piecesDemandees, setPiecesDemandees] = useState([]);
  
  useEffect(() => {
    fetchPiecesDemandees();
  }, []);

  const fetchPiecesDemandees = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/direction/getAllPieceDemandee", null, headers);
      setPiecesDemandees(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pièces demandées.");
    }
  };

  const filteredParts = piecesDemandees.filter((demande) => {
    const matchesSearch = demande.piece.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDate = searchQueryDate 
    ? new Date(demande.dateCommande).toISOString().split('T')[0] === searchQueryDate
    : true;
    const matchesEtat = filter ? demande.etat === filter : true;
    return matchesSearch && matchesEtat && matchDate;
  });

  const totalPages = Math.ceil(filteredParts.length / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  
  
  const handleAccepter = async(demande) => {
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
      await request("put", `/direction/accepterDemandePiece/${demande.id}`, null, headers);
      Swal.fire({
        title: "Confirmer l'acceptation",
        text: "demande accepter avec succès!",
        icon: "success",
      });
      fetchPiecesDemandees();
    } catch (error) {
      toast.error("Erreur lors de l'acceptation du demande.");
    }
  };

  const handleRefuser = async(demande) => {
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
      await request("put", `/direction/refuserDemandePiece/${demande.id}`, null, headers);
      Swal.fire({
        title: "Confirmer la refusation",
        text: "demande refuser avec succès!",
        icon: "success",
      });
      fetchPiecesDemandees();
    } catch (error) {
      toast.error("Erreur lors de la refusation du demande.");
    }
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["ID,Nom,Categorie,Quantité,Etat,Date"]
        .concat(piecesDemandees.map(d => 
          `${d.id},${d.piece.nom},${d.piece.categorie},${d.quantiteCommandee},${d.etat},${d.dateCommande}`))
        .join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pieces_demandees.csv");
    document.body.appendChild(link); 
    link.click();
  };
  

  return (
    <>
    <div className="p-8 bg-white rounded-lg shadow-lg ">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Liste des pièces</h2>
            <p className="text-sm text-gray-500">Voir les informations sur tous les pièces</p>
          </div>
          <div className="flex space-x-3">
          <button onClick={handleExportCSV} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
            Exporter en CSV
          </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')} className={`py-2 px-4 rounded-md ${filter === "" ? "bg-gray-200" : "bg-white"} text-gray-800 font-medium border border-gray-300 hover:bg-gray-200`}>
            Tout
          </button>
          <button onClick={() => setFilter('EN_ATTENTE')} className={`py-2 px-4 rounded-md ${filter === "EN_ATTENTE" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            En attente
          </button>
          <button onClick={() => setFilter('REFUSE')} className={`py-2 px-4 rounded-md ${filter === "REFUSE" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
              Refusée
          </button>
          <button onClick={() => setFilter('CONFIRME')} className={`py-2 px-4 rounded-md ${filter === "CONFIRME" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
             Confirmé
          </button>
          <div className="ml-auto flex items-center">
            <input
              type="text"
              placeholder="Rechercher par pièce"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQueryDate}
              onChange={(e) => setSearchQueryDate(e.target.value)}
            />
          </div>
        </div>

        <table className="min-w-full border-collapse bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">ID de demande</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nom de la Pièce</th>
              <th className="px-9 py-3 text-left text-sm font-medium text-gray-600">Prix d&apos;achat</th>
              <th className="px-10 py-3 text-left text-sm font-medium text-gray-600">Quantite CMD</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date de commande</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Etat de commande</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
          {currentParts.length > 0 ? (
            currentParts.map((demande, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">#D{demande.id}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-normal text-gray-800">{demande.piece.nom}</p>
                  </div>
                </td>
                <td className="px-0 py-4 text-center  text-base text-gray-600">{demande.piece.prixAchat} DT</td>
                <td className="px-0 py-4 text-base text-center text-gray-600">{demande.quantiteCommandee} pièce(s)</td>
                <td className="px-6 py-4 text-center text-md text-gray-600">{demande.dateCommande}</td>
                <td className="px-0 text-center py-4">
                    <span
                      className={`py-1 px-3 rounded-full font-medium text-base ${
                        demande.etat === "CONFIRME"
                          ? "text-green-600"
                          : demande.etat === "EN_ATTENTE"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {demande.etat}
                    </span>
                  </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="flex items-center gap-x-5">
                        <button
                            onClick={()=>handleAccepter(demande)}
                            className={` ${demande.etat!="EN_ATTENTE" ? "opacity-80 text-gray-500" : "text-green-500 hover:text-green-700 transition-colors duration-200 dark:hover:text-green-700 dark:text-gray-300 "}   focus:outline-none`}
                            title="Accepter"
                            disabled={demande.etat!="EN_ATTENTE"}
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
                            onClick={()=>handleRefuser(demande)}
                            className={`  ${demande.etat!="EN_ATTENTE" ? "opacity-80 text-gray-500" : "text-red-500 hover:text-red-700 transition-colors duration-200 dark:hover:text-red-700 dark:text-gray-300"} focus:outline-none`}
                            title="Refuser"
                            disabled={demande.etat!="EN_ATTENTE"}
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
                    <p className="text-gray-600 text-lg">Aucune demande trouvée.</p>
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
    </div>
     <ToastContainer />
    </>
  );
};

export default PiecesDemandeesTable;
