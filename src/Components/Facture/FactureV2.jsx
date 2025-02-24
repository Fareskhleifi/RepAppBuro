/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useRef,useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; 
import {request} from '../../Service/axios_helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Facture() {
  const factureRef = useRef(null); 
  const [color, setColor] = useState("#2563EB"); 
  const [cachet, setCachet] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0); 
  const navigate = useNavigate();
  
  const location = useLocation();
  const DemandeReparation = location.state; 
  const clientInfo = DemandeReparation?.client || {}; 
  const [DetailsFacture ,setDetailsFacture] = useState(null);
  const [pieces,setPieces] = useState([]);

  useEffect(() => {
    fetchDetailsFacture();
  }, []);
  
  const fetchDetailsFacture = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", `/rsc/DetailsFacture?id=${DemandeReparation.id}`, null, headers);
      setDetailsFacture(response.data);
      setPieces(response.data.picesesUtilisees);
    } catch (error) {
      toast.error("Erreur lors de la récupération de la details de facture.");
    }
  };

  const discount = DetailsFacture ? (DetailsFacture.totalTTC * discountPercentage) / 100 : 0;
  const totalAfterDiscount = DetailsFacture ? DetailsFacture.totalTTC - discount : 0;

  const handleAddFacture = async ()=>{
    if (DetailsFacture?.idReparation){
      try {
        const factureData = {
          montantTotal: totalAfterDiscount,
          dateFacture: new Date().toISOString().split('T')[0],
          idReparation: DetailsFacture?.idReparation
        };
        const token = sessionStorage.getItem('token') || Cookies.get('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await request("post", "/rsc/addFacture",factureData,headers);
        toast.success("facture ajoutée avec succès!", { autoClose: 1200 });
        setTimeout(()=>{
          generatePDF();
        },1200)
        setTimeout(()=>{
          navigate('/dashboard');
        },1500)
      } catch (error) {
        toast.error("Erreur lors de l'ajoutation de facture.");
      }
    }
    else{
      toast.error("Erreur lors de l'ajoutation de facture, reparation id est null.");
    }
  }

  const generatePDF = () => {
    if (factureRef.current) {
      html2canvas(factureRef.current, { scale: 2 }).then((canvas) => {
        const pdf = new jsPDF("p", "mm", "a4");
        const image = canvas.toDataURL("image/png");
        pdf.addImage(image, "PNG", 10, 10, 190, 0);
        pdf.save(`factureN°000${DetailsFacture?.idOfLastFacture}.pdf`);
      });
    }
  };

  const handleAnnuler =()=>{
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
            <h1 className="text-3xl font-extrabold" style={{ color }}>
              RepAppBuro
            </h1>
            <p className="text-gray-600 text-sm">Adresse de l&apos;entreprise : sfax</p>
            <p className="text-gray-600 text-sm">Téléphone : +216 28 781 584</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold" style={{ color }}>
              Facture
            </h2>
            <p className="text-gray-600">Date : {new Date().toLocaleDateString()}</p>
            <p className="text-gray-600">N° : 000{DetailsFacture?.idOfLastFacture}</p>
          </div>
        </div>

        {/* Informations sur le client */}
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2" style={{ color }}>
            Informations du client
          </h3>
          <p className="text-gray-800">Nom : {clientInfo.nom}</p>
          <p className="text-gray-800">Adresse : {clientInfo.adresse}</p>
          <p className="text-gray-800">Téléphone : {clientInfo.telephone}</p>
        </div>

        <div className="border-b mt-6"></div>
        
        {/* Table de details de reparation */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color }}>
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
                <td className="border px-4 py-2">15</td>
                <td className="border px-4 py-2">{DetailsFacture?.totalReparation.toFixed(2)} TND</td>
                </tr>
            </tbody>
          </table>
        </div>

        {/* Table des pièces */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4" style={{ color }}>
            Détails des pièces
          </h3>
          <table className="w-full border-collapse bg-gray-50 rounded-xl overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-gray-700">Nom de pièce</th>
                <th className="border px-4 py-2 text-gray-700">Quantité</th>
                <th className="border px-4 py-2 text-gray-700">Prix unitaire TTC (TND)</th>
                <th className="border px-4 py-2 text-gray-700">Tarif de reparation/U</th>
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
                    <td className="border px-4 py-2">{piece.typePiece.tarifH.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      {(piece.reparationPieces[0].qte * piece.prixVenteTTC + piece.typePiece.tarifH * piece.reparationPieces[0].qte ).toFixed(2)}
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
          <p className="text-gray-800">Remise ({discountPercentage}%) : -{discount.toFixed(2)} TND</p>
          <p className="text-lg font-bold" style={{ color }}>
            Total TTC : {totalAfterDiscount.toFixed(2)} TND
          </p>
        </div>

        {/* Conditions générales */}
        <div className="mt-10 text-sm text-gray-600">
          <h3 className="text-lg font-bold" style={{ color }}>
            Conditions générales
          </h3>
          <p>Merci de régler votre facture dans un délai de 30 jours.</p>
          <p>Aucun remboursement après réparation.</p>
        </div>

        {/* Cachet et signature */}
        <div className="mt-12 flex justify-between items-center">
          <div>
            {cachet ? (
              <div className="text-left">
                <p className="mb-2">Cachet de l&apos;entreprise :</p>
                <div className="w-56 h-24 border-2 border-dashed flex items-center justify-center">
                  <img
                    src={cachet}
                    alt="Cachet d'entreprise"
                    className="w-44 h-20 object-contain"
                  />
                </div>
              </div>
            ) : (
              <div className="text-left">
                <p className="mb-2">Cachet de l&apos;entreprise :</p>
                <div className="w-56 h-24 border-2 border-dashed flex items-center justify-center"></div>
              </div>
            )}
          </div>
          <div className="text-left">
            <p className="mb-1">Signature du client :</p>
            <div className="border-2 border-dashed w-48 h-24"></div>
          </div>
        </div>
      </div>

      {/* Menu de configuration */}
      <div className="w-1/4 bg-gray-200 rounded-xl shadow-lg p-6 ml-6">
        <h2 className="text-lg font-bold mb-6">Configuration</h2>
        <div>
          <label className="block mb-2 font-medium">Couleur principale</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 border rounded-md"
          />
        </div>
        <div className="mt-6">
          <label className="block mb-2 font-medium">Cachet</label>
          <input
            type="file"
            onChange={(e) =>
              setCachet(URL.createObjectURL(e.target.files[0]))
            }
            className="w-full border rounded-md"
          />
        </div>
        <div className="mt-6">
          <label className="block mb-2 font-medium">Remise (%)</label>
          <input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(parseFloat(e.target.value))}
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleAddFacture}
            className="bg-blue-600 text-white p-2 rounded-md w-full"
          >
            Générer PDF
          </button>
          </div>
          <div className="mt-6 flex justify-center">
          <button
            onClick={handleAnnuler}
            className="bg-gray-900 text-white p-2 rounded-md w-full"
          >
            Annuler
          </button>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}
