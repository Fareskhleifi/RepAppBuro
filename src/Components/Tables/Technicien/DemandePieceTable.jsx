import { useState ,useEffect} from "react";
import {  faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link,useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";
import Swal from 'sweetalert2';
import {request} from '../../../Service/axios_helper';
import Cookies from 'js-cookie';


const DemandePieceTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const partsPerPage = 5;
  const [filter, setFilter] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const location = useLocation();
  const path = location.pathname;
  const [piecesDemandes, setPiecesDemandes] = useState([]);

  useEffect(() => {
    fetchPiecesDemandees();
  }, []);

  useEffect(() => {
    const refreshListener = () => fetchPiecesDemandees();
    window.addEventListener("refreshDashboard", refreshListener);
    return () => window.removeEventListener("refreshDashboard", refreshListener);
  }, []);

  const fetchPiecesDemandees = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", "/tech/getAllPieceDemandee", null, headers);
      setPiecesDemandes(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération des piéces demandées.");
    }
  };

  const filteredDemande = piecesDemandes
  .filter(demande => {
    // Apply etat filter based on the 'filter' variable
    const etatCondition = 
      filter === 'enAttente' ? demande.etat === 'EN_ATTENTE' :
      filter === 'confirmée' ? demande.etat === 'CONFIRME' :
      filter === 'refuse' ? demande.etat === 'REFUSE' :
      true;

    const searchCondition =
      demande.piece.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demande.id.toString().includes(searchQuery);
    const dateCondition =
      filterDate ? new Date(demande.dateCommande).toDateString() === new Date(filterDate).toDateString() : true;
    return etatCondition && searchCondition && dateCondition;
  });


  const totalPages = Math.ceil(filteredDemande.length / partsPerPage);
  const indexOfLastPart = currentPage * partsPerPage;
  const indexOfFirstPart = indexOfLastPart - partsPerPage;
  const currentDemande = filteredDemande.slice(indexOfFirstPart, indexOfLastPart);

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

  const csvData = filteredDemande.map(demande => ({
    ID: demande.id,
    Réference: demande.piece.id,
    "Nom de pièce": demande.piece.nom,
    Categorie: demande.piece.categorie,
    "Quantite commandé": demande.quantiteCommandee,
    Etat: demande.etat,
    "Date Prévue": demande.dateCommande
  }));


  const handleAnnuler = (demandeId) => {
      Swal.fire({
        title: "Confirmer l'annulation",
        text: "Êtes-vous sûr de vouloir annuler cet demande ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, confirmer',
        cancelButtonText: 'Annuler'
      }).then((result) => {
        if (result.isConfirmed) {
          AnnulerDemande(demandeId);
        }
      });
  };

  const AnnulerDemande = async (demandeId) => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("delete", `/tech/deleteDemandePiece?id=${demandeId}`, null, headers);
      if (response.status === 204) {
        toast.success("Demande annulée avec succès!", {
          autoClose: 1300,
        });
        fetchPiecesDemandees();
      } else {
        toast.error("Erreur lors de l'annulation de la demande.");
      }
    } catch (error) {
      console.error("Error during request:", error);
      toast.error("Erreur lors de l'annulation de la demande.");
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
    <div className="p-8 bg-white rounded-lg shadow-lg ">
        <div className="flex justify-between items-center pb-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Liste des demandes</h2>
            <p className="text-sm text-gray-500">Voir les informations sur tous les demandes</p>
          </div>
          <div className="flex space-x-3">
            { path ==="/produits-demandees" ? "" :(
              <Link to="/produits-demandees">
                <button  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                  VOIR TOUT
                </button>
              </Link>)
            }
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

        <div className="flex items-center space-x-4 py-6">
          <button onClick={() => setFilter('')} className={`py-2 px-4 rounded-md ${filter === "" ? "bg-gray-200" : "bg-white"} text-gray-800 font-medium border border-gray-300 hover:bg-gray-200`}>
            Tout
          </button>
          <button onClick={() => setFilter('enAttente')} className={`py-2 px-4 rounded-md ${filter === "enAttente" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
          Demande en attente
          </button>
          <button onClick={() => setFilter('confirmée')} className={`py-2 px-4 rounded-md ${filter === "confirmée" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
          Demande confirmée 
          </button>
          <button onClick={() => setFilter('refuse')} className={`py-2 px-4 rounded-md ${filter === "refuse" ? "bg-gray-200" : "bg-white"} text-gray-600 font-medium border border-gray-300 hover:bg-gray-200`}>
          Demande refusée 
          </button>
            <input
              type="text"
              placeholder="Rechercher par nom de pièce ou Id"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
                      <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="py-2 px-4 border border-gray-300 rounded-lg"
          />
        </div>

        <table className="min-w-full border-collapse bg-white shadow overflow-hidden sm:rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Nom de la Pièce</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Catégorie</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-600">Quantite commandé</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Etat de commande</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date de commande</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
          {currentDemande.length > 0 ? (
            currentDemande.map((demande, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-3">
                <p className="font-semibold text-gray-800">{demande.id}</p>
                </td>
                <td className="px-6 py-3">
                  <div>
                    <p className="font-semibold text-gray-800">{demande.piece.nom}</p>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div>
                    <p className="font-semibold  text-gray-800">{demande.piece.categorie}</p>
                  </div>
                </td>
                <td className=" px-3 py-3 text-base text-center text-gray-600">{demande.quantiteCommandee}</td>
                <td className="px-6 py-3">
                <span
                    className={`py-1 px-3 font-semibold rounded-full text-md ${
                        demande.etat === "CONFIRME" ? "text-green-700" : demande.etat === "REFUSE" ? "text-red-600" : "text-yellow-600"
                    }`}
                  >
                    {demande.etat}
                  </span>
                </td>
                <td className="px-6 py-3 text-base  text-gray-600">{demande.dateCommande}</td>
                <td className={`px-6 py-3   text-center`}>
                  <button disabled={demande.etat != "EN_ATTENTE"} onClick={()=>handleAnnuler(demande.id)} className={`text-white text-sm ${demande.etat != "EN_ATTENTE" ? "opacity-65" : "hover:text-white hover:bg-gray-600 transition duration-300" }  bg-gray-800 p-1 px-2 rounded-lg `}>
                  Annuler
                  </button>
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
       <ToastContainer />
    </div>
  );
};

export default DemandePieceTable;
