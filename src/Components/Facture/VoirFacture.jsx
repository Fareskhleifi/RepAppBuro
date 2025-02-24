import { useState, useRef,useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; 
import {request} from '../../Service/axios_helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function VoirFacture() {
  const factureRef = useRef(null); 
  const navigate = useNavigate();
  
  const location = useLocation();
  const DemandeReparation = location.state?.demande || null; 
  const invoice = location.state?.invoice || null; 
  const clientInfo = DemandeReparation?.client || {}; 
  const [DetailsFacture ,setDetailsFacture] = useState(null);
  const [pieces,setPieces] = useState([]);

  useEffect(() => {
    fetchDetailsFacture();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const fetchDetailsFacture = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", `/rsc/DetailsFacture?id=${DemandeReparation.id}`, null, headers);
      setDetailsFacture(response.data);
      setPieces(response.data.picesesUtilisees);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Erreur lors de la récupération de la details de facture.");
    }
  };

  const generatePDF = () => {
    if (factureRef.current) {
      html2canvas(factureRef.current, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const image = canvas.toDataURL("image/png");
        pdf.addImage(image, "PNG", 10, 10, 190, 0);
        pdf.save(`factureN°000${invoice.idFacture}.pdf`);
      });
    }
  };

  const handleRetourner =()=>{
    navigate('/dashboard');
  }

  if(DemandeReparation == null && invoice==null){
   navigate('/dashboard');
  }

  return (
    <div className="flex bg-gray-100 min-h-screen p-6">
      {/* Facture */}
      <div
        ref={factureRef}
        className="w-3/4 bg-white shadow-lg rounded-xl p-8 relative"
        style={{ backgroundColor: "#fff" }}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-[#2563EB]" >
              RepAppBuro
            </h1>
            <p className="text-gray-600 text-sm">Adresse de l&apos;entreprise : sfax</p>
            <p className="text-gray-600 text-sm">Téléphone : +216 28 781 584</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-[#2563EB]" >
              Facture
            </h2>
            <p className="text-gray-600">Date : {invoice.dateFacture} </p>
            <p className="text-gray-600">N° : 000{invoice.idFacture}</p>
          </div>
        </div>

        {/* Informations sur le client */}
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2 text-[#2563EB]" >
            Informations du client
          </h3>
          <p className="text-gray-800">Nom : {clientInfo.nom}</p>
          <p className="text-gray-800">Adresse : {clientInfo.adresse}</p>
          <p className="text-gray-800">Téléphone : {clientInfo.telephone}</p>
        </div>

        <div className="border-b mt-6"></div>
        
        {/* Table de details de reparation */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-[#2563EB]" >
            Détails de réparation
          </h3>
          <table className="w-full border-collapse bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-gray-700">Description</th>
                <th className="border px-4 py-2 text-gray-700">Durée main doeuvre(heures)</th>
                <th className="border px-4 py-2 text-gray-700">Tarif horaire (TND)</th>
                <th className="border px-4 py-2 text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
                <tr className="bg-white">
                <td className="border px-4 py-2">{DetailsFacture?.description || "N/A"}</td>
                <td className="border px-4 py-2">{DetailsFacture?.dureeMainOeuvre || "0"}</td>
                <td className="border px-4 py-2">{DemandeReparation?.tarifMainOeuvre || 15}</td>
                <td className="border px-4 py-2">{DetailsFacture?.totalReparation.toFixed(2)} TND</td>
                </tr>
            </tbody>
          </table>
        </div>

        {/* Table des pièces */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-[#2563EB]" >
            Détails des pièces
          </h3>
          <table className="w-full border-collapse bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-gray-700">Nom de pièce</th>
                <th className="border px-4 py-2 text-gray-700">Quantité</th>
                <th className="border px-4 py-2 text-gray-700">Prix TTC (TND)</th>
                <th className="border px-4 py-2 text-gray-700">Total (TND)</th>
              </tr>
            </thead>
            <tbody>
            {pieces.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">Aucune pièce utilisée</td>
                </tr>
              ) : (
                pieces.map((piece, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border px-4 py-2">{piece.nom}</td>
                    <td className="border px-4 py-2">{piece.reparationPieces[0].qte}</td>
                    <td className="border px-4 py-2">{piece.prixVenteTTC.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      {(piece.reparationPieces[0].qte * piece.prixVenteTTC).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="mt-8 text-right">
          <p className="text-gray-800">Total HT : {DetailsFacture?.totalTTC.toFixed(2)} TND</p>
          <p className="text-gray-800">Remise (-{((invoice.montantTotal - DetailsFacture?.totalTTC) / invoice.montantTotal * 100).toFixed(2)}%) : -{(invoice.montantTotal - DetailsFacture?.totalTTC).toFixed(2)} TND</p>
          <p className="text-lg font-bold text-[#2563EB]" >
            Total TTC : {invoice.montantTotal.toFixed(2)} TND
          </p>
        </div>

        {/* Conditions générales */}
        <div className="mt-10 text-sm text-gray-600">
          <h3 className="text-lg font-bold text-[#2563EB]" >
            Conditions générales
          </h3>
          <p>Merci de régler votre facture dans un délai de 30 jours.</p>
          <p>Aucun remboursement après réparation.</p>
        </div>

        {/* Cachet et signature */}
        <div className="mt-12 flex justify-between items-center">
          <div>
              <div className="text-left">
                <p className="mb-2">Cachet de l&apos;entreprise :</p>
                <div className="w-56 h-24 border-2 border-dashed flex items-center justify-center"></div>
              </div>
          </div>
          <div className="text-left">
            <p className="mb-1">Signature du client :</p>
            <div className="border-2 border-dashed w-48 h-24"></div>
          </div>
        </div>
      </div>

      {/* Menu  */}
      <div className="w-1/4 bg-gray-200 h-56 rounded-xl shadow-lg p-6 ml-6">
        <h2 className="text-xl text-center font-bold mb-10">Panneau Des Actions</h2>
        <div className="mt-6 flex justify-center">
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white p-2 rounded-md w-full"
          >
            Générer PDF
          </button>
          </div>
          <div className="mt-6 flex justify-center">
          <button
            onClick={handleRetourner}
            className="bg-gray-900 text-white p-2 rounded-md w-full"
          >
            Retourner
          </button>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
