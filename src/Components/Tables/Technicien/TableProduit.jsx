/* eslint-disable no-unused-vars */

import { useState,useEffect } from "react";
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";
import { useAuth } from '../../../contextHook/AuthContext';
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import {request} from '../../../Service/axios_helper'
const MySwal = withReactContent(Swal);
import withReactContent from 'sweetalert2-react-content';

const ProduitTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 5; 
  const [filter, setFilter] = useState('');
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [selectedPart, setSelectedPart] = useState({ nom: '', categorie: '', id: '' });
  const [quantiteDemande, setQuantiteDemande] = useState(0);
  const { role } = useAuth();
  const [pieces, setPieces] = useState([]);
  
  useEffect(() => {
    fetchPieces();
  }, []);

  const fetchPieces = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/tech/getAllPieces", null, headers);
      setPieces(response.data);
    } catch (error) {
      toast.error("Erreur lors de la récupération des pieces.");
    }
  };

  const filteredParts = pieces.filter((part) => {
    const matchesSearch = part.nom.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filter ? part.categorie === filter : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredParts.length / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentParts = filteredParts.slice(indexOfFirstPart, indexOfLastPart);

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

  const handleAddPart = () => {
    setShowAddPartForm(true);
  };

  const handleTablePart = () => {
    Swal.fire({
      title: "Confirmer la réinitialisation",
      text: "Êtes-vous sûr de vouloir réinitialiser les champs ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, réinitialiser",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedPart({ nom: "", categorie: "", id: "" });
        setQuantiteDemande(0);
        setShowAddPartForm(false);
      }
    });
  };

  const demandePiece = async () =>{
    try {
      if (!selectedPart.nom || !selectedPart.categorie) {
        toast.error("Tous les champs sont requis.");
        return;
      }
      if(quantiteDemande == 0){
        toast.error("La quantité est invalide (doit être supérieure à 0).");
        return;
      }
      const Data = {
        piece : {
          id : selectedPart.id
        },
        dateCommande : new Date(),
        quantiteCommandee : quantiteDemande
      }
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("post", "/tech/addDemandePiece", Data, headers);
  
      if (response.status === 200) {
        Swal.fire({
          title: "Demande confirmée",
          text: "La demande a été envoyée avec succès.",
          icon: "success",
        });
        setSelectedPart({ nom: "", categorie: "", id: "" });
        setQuantiteDemande(0);
        setShowAddPartForm(false);
        const event = new CustomEvent("refreshDemande", { detail: "newDemandeAdded" });
        window.dispatchEvent(event);
      } else {
        toast.error("Erreur lors de l'envoi de la demande.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la demande.");
      console.error("Erreur:", error); 
    }
  }
  const handleAddPartSuccess = () => {
    Swal.fire({
      title: "Confirmer la demande",
      text: "Voulez-vous vraiment demander cette pièce ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Oui, demander",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        demandePiece();
      }
    });
  };
  

  const handleRequestPart = (part) => {
    setSelectedPart({ nom: part.nom, categorie: part.categorie, id: part.id });
    setShowAddPartForm(true);
  };

  const renderAddPartForm = () => (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Demande une pièce</h2>
      <form className="space-y-6" onSubmit={(e) => {
        e.preventDefault();
        handleAddPartSuccess();
      }}>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Nom</label>
          <input
            type="text"
            value={selectedPart.nom}
            onChange={(e) => setSelectedPart({ ...selectedPart, nom: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            placeholder="Entrez le nom de la pièce"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Categorie</label>
          <input
            type="text"
            value={selectedPart.categorie}
            onChange={(e) => setSelectedPart({ ...selectedPart, categorie: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            placeholder="Entrez la catégorie"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Référence</label>
          <input
            type="text"
            value={selectedPart.id}
            onChange={(e) => setSelectedPart({ ...selectedPart, id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            placeholder="Entrez la référence"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-1">Quantité nécessaire</label>
          <input
            type="text"
            value={quantiteDemande}
            onChange={(e) => setQuantiteDemande(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            placeholder="Entrez la quantité nécessaire"
            required
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full"
          >
            Demander
          </button>
          <button
            onClick={handleTablePart}
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
    <>
    <div className="p-8 bg-white rounded-lg shadow-lg ">
         {showAddPartForm ? (
        renderAddPartForm()
      ) : (
        <>
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Liste des pièces</h2>
            <p className="text-sm text-gray-500">Voir les informations sur tous les pièces</p>
          </div>
          <div className="flex space-x-3">
            <Link to="/produits-stock">
            <button  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
              VOIR TOUT
            </button></Link>
            { role === "DIRECTION" ? (
                  <button  className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
                  <span className="inline-block">Exporte en csv</span>
                </button>
            ) : (
            <button onClick={handleAddPart} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition duration-300">
              <span className="inline-block">DEMANDER UNE PIÈCE</span>
            </button>)}
          </div>
        </div>

        <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')} className={`py-2 px-4 rounded-md ${filter === "" ? "bg-gray-200" : "bg-white"} text-gray-800 font-medium border border-gray-300 hover:bg-gray-200`}>
            Tout
          </button>
          <button onClick={() => setFilter('Memory')} className={`py-2 px-4 rounded-md ${filter === "Memory" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            Mémoire
          </button>
          <button onClick={() => setFilter('Storage')} className={`py-2 px-4 rounded-md ${filter === "Storage" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            Stockage
          </button>
          <button onClick={() => setFilter('Graphics Card')} className={`py-2 px-4 rounded-md ${filter === "Graphics Card" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            Carte Graphique
          </button>
          <button onClick={() => setFilter('Processor')} className={`py-2 px-4 rounded-md ${filter === "Processor" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            Processeur
          </button>
          <button onClick={() => setFilter('Motherboard')} className={`py-2 px-4 rounded-md ${filter === "Motherboard" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
            Carte Mère
          </button>
          <div className="ml-auto flex items-center">
            <input
              type="text"
              placeholder="Rechercher par nom"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className="min-w-full border-collapse bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nom de la Pièce</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Catégorie</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Temps de reparation(H)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Tarif de reparation</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Prix Vente TTC</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Statut du Stock</th>
              {
                 role != "DIRECTION" &&(
                  <th className="px-6 py-3">Action</th>
                 )
              }
            </tr>
          </thead>
          <tbody>
          {currentParts.length > 0 ? (
            currentParts.map((piece, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">{piece.nom}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800">{piece.categorie}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-md text-gray-600">{piece.tempsReparation} heure</td>
                <td className="px-12 py-4 text-md text-gray-600">{piece.typePiece.tarifH}  TND</td>
                <td className="px-8 py-4 text-md text-gray-600">{piece.prixVenteTTC} TND</td>
                <td className="px-1 text-center py-4">
                <span
                    className={`py-1 px-3 rounded-full text-white text-sm ${
                      piece.quantiteStock > 0 ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    {piece.quantiteStock > 0 ? "En stock" : "Repture de stock"}
                  </span>
                </td>
                { role === "DIRECTION" ? (
                   <td className="px-6 py-4 text-center">
                     
                  </td>
                ) : (
                <td className="px-6 py-4 text-center">
                    {piece.quantiteStock > 0 ? '' : 
                  <button onClick={() => handleRequestPart(piece)} className="text-white text-sm bg-gray-800 p-1 px-2 rounded-lg hover:text-white hover:bg-gray-600 transition duration-300">
                  Demande
                  </button>}
                </td> )}
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6">
                <div className="relative "> 
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-4xl" />
                    <p className="text-gray-600 text-lg">Aucune pièce trouvée.</p>
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
        </>
      )}
    </div>
     <ToastContainer />
    </>
  );
};

export default ProduitTable;
