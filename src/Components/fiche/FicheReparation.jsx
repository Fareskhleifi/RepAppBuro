/* eslint-disable react/prop-types */
import { jsPDF } from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contextHook/AuthContext';
import { request } from '../../Service/axios_helper';
import Cookies from 'js-cookie'; 

const FicheReparation = ({member,setShowClientTable}) => {

  const {user} = useAuth();

  const currentDate = new Date();
  const dateOnly = currentDate.toLocaleDateString();

  // eslint-disable-next-line no-unused-vars
  const [clientId, setClientId] = useState(member.id);
  const [marque, setMarque] = useState('');
  const [modele, setModele] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [designation, setDesignation] = useState('');
  const [symptomesPanne, setSymptomesPanne] = useState('');
  const [datePrevueRemise, setDatePrevueRemise] = useState('');

  const [showEtiquette, setShowEtiquette] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const handleSaveAndDownloadPDF = () => {
    const element = document.querySelector(".container");
    html2canvas(element, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); 
      pdf.save("fiche_de_reparation.pdf");
      setShowEtiquette(true);
    });
  };

  const handleDownloadEtiquette = () => {
    const etiquette = document.getElementById('etiquette');
    html2canvas(etiquette, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight); 
      pdf.save("etiquette.pdf");
      setShowEtiquette(true);
      setTimeout(() => {
        setShowClientTable(false);
        // navigate('/fich');
        window.location.href="/dashboard";
      }, 1200); 
    });
  };
  
  const generateQRCode = () => {
    const qrData = `Marque de l'appareil: ${marque}\nNuméro de Série: ${numeroSerie}\nDate de Dépôt: ${dateOnly}\nSymptôme de Panne: ${symptomesPanne}\\nPropriétaire: ${member.nom}\nDate de Remise Prévue: ${datePrevueRemise}`;
    QRCode.toDataURL(qrData, function (err, url) {
      if (err) console.error(err);
      setQrCodeUrl(url);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateDepot = new Date();
    const dateRemise = new Date(datePrevueRemise);
  
    if (dateRemise < dateDepot) {
      toast.error("La date prévue de remise ne peut pas être antérieure à la date de dépôt.", {
        autoClose: 2000,
      });
      return;
    }
    const appareilData = {
      marque,
      modele,
      numeroSerie,
      designation,
    };
    generateQRCode();
    const demandeData = {
      symptomesPanne,
      dateDepot: new Date().toISOString().split('T')[0],
      datePrevueRemise,
      etat: 'En attente',
      client: { id: clientId },
    };

    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const appareilResponse = await request('post', '/rsc/addAppareil', appareilData, headers);
      const appareil = appareilResponse.data;
      demandeData.appareil = { id: appareil.id };
      demandeData.creePar = {id : user.idUser};
      // eslint-disable-next-line no-unused-vars
      const demandeResponse = await request('post', '/rsc/addDemandeReparation', demandeData, headers);
      toast.success('Appareil et demande de réparation enregistrés avec succès!',{
        autoClose : 1200,
      });

      setTimeout(()=>{
        handleSaveAndDownloadPDF();
      },500)
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement de l\'appareil ou de la demande.');
    }
  };
  

  return (
    <>
      { !showEtiquette ? (
        <>
          <div className="container -mt-16 scale-90  mx-auto p-4 bg-gray-200 border border-black w-[250mm]">
            
            <h2 className="text-center text-2xl font-semibold bg-blue-600 text-black p-1 mt-3 mb-12">Fiche de Réparation</h2>

            <div className="flex justify-between mb-4">
              <div className="w-[48%] text-md">
                <p>Numéro de Fiche: </p>
              </div>
              <div className="w-[48%] text-md">
                <p>Date de Création:  {dateOnly} </p>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <div className="w-[48%]">
                <table className="w-full border p-10 border-gray-600 table-auto bg-white border-collapse mb-4">
                  <thead>
                    <tr>
                      <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Coordonnées Client</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-none text-lg p-2">Nom: </td>
                      <td className="border-none p-2 "><input type="text" value={member.nom || ''} className=" text-lg  w-full" /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Adresse:</td>
                      <td className="border-none p-2"><input type="text" value={member.adresse || ''} className=" text-lg  w-full"/></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Tél. Portable:</td>
                      <td className="border-none p-2"><input type="text" value={member.telephone || ''} className=" text-lg   w-full" /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Email:</td>
                      <td className="border-none p-2"><input type="text" value={member.email || ''} className=" text-lg   w-full" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
      
              <div className="w-[48%]">
                <table className="w-full table-auto border border-gray-600 bg-white border-collapse mb-4">
                  <thead className="">
                    <tr>
                      <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Matériel</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-none text-lg p-2">Modele :</td>
                      <td className="border-none p-2"><input type="text"  value={modele} onChange={(e) => setModele(e.target.value)} required className="  border-gray-900 text-lg  w-full" placeholder="........................................................."   /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Marque :</td>
                      <td className="border-none p-2"><input type="text" value={marque} onChange={(e) => setMarque(e.target.value)} required className=" border-gray-900 text-lg  w-full" placeholder="........................................................."  /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">N° Serie :</td>
                      <td className="border-none p-2"><input type="text" value={numeroSerie} onChange={(e) => setNumeroSerie(e.target.value)} required className=" border-gray-900 text-lg  w-full" placeholder="........................................................."  /></td>
                    </tr>
                    <tr>
                      <td className="border-none text-lg p-2">Désignation :</td>
                      <td className="border-none p-2"><input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} required className=" border-gray-900 text-lg  w-full" placeholder="........................................................."  /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <table className="w-full table-auto border border-gray-900 bg-white border-collapse mb-6">
          <thead>
            <tr>
              <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Observation(s)</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="2" className="border border-gray-900 p-2">
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> À facturer
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Garantie
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Sous-contrat
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" /> Gratuit
                  </label>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="border border-gray-900 p-2">
              Date prévue de remise : <input type="date" value={datePrevueRemise} onChange={(e) => setDatePrevueRemise(e.target.value)} required className="w-36 text-lg border-b border-gray-600 px-2 py-1" /> , sinon téléphoner.
              </td>
            </tr>
          </tbody>
            </table>

            <table id="travaux-demandes-table" className="w-full table-auto border border-gray-900 bg-white border-collapse mb-6">
              <thead>
                <tr>
                  <td colSpan="2" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Travaux demandés par le client</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="2" className="border border-gray-900 p-2">
                    <div className="flex justify-between">
                      <div className="w-[65%]">
                        <textarea value={symptomesPanne} onChange={(e) => setSymptomesPanne(e.target.value)} required className="w-full h-36  p-2 text-xl border border-gray-600"></textarea>
                      </div>
                      <div className="w-[30%] flex flex-col justify-center">
                        <p>Signature client:</p>
                        <div className="border border-gray-600 h-28"></div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="page-break"></div>
            
            <table id="work-table" className="w-full border border-gray-900 table-auto bg-white border-collapse mb-6">
              <thead>
                <tr>
                  <td colSpan="5" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Travaux effectués</td>
                </tr>
                <tr>
                  <td className="border border-gray-800 w-1/3  p-2">Description</td>
                  <td className="border border-gray-800  p-2">Durée main d&apos;oeuvre (H)</td>
                  <td className="border border-gray-800  p-2">Effectué par</td>
                  <td className="border border-gray-800  p-2">Total réparation</td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>

            <table id="fourniture-table" className="w-full border border-gray-900 table-auto bg-white border-collapse mb-6">
              <thead>
                <tr>
                  <td colSpan="5" className="bg-blue-600 border-b border-black text-black font-semibold text-lg text-center p-2">Fournitures</td>
                </tr>
                <tr>
                    <td className="border border-gray-800 text-center p-2">Pièces - Désignations</td>
                    <td className="border border-gray-800  p-2">Prix TTC</td>
                    <td className="border border-gray-800  p-2">Quantite</td>
                    <td className="border border-gray-800  p-2">Montant TTC</td>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
            <div className="totals flex justify-between">
                <div className="stamp w-[340px] border border-gray-900 p-5 text-center align-top bg-white h-40">
                <p>Cachet de lentreprise</p>
              </div>
              <div className="stamp w-[340px] border border-gray-900 p-5 text-center align-top bg-white h-40">
                <p>Signature de client</p>
              </div>
            </div>
            <p className="notes text-xs italic mt-2">Note: Nos conditions de réparation et tarifaire affichés vous sont applicables.</p>
          </div>
          <div className="flex gap-8 -mt-6 -ml-2 mb-4 items-center justify-center">
            <button onClick={handleSubmit}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                Enregistrer
            </button>
            <button  onClick={()=>{setShowClientTable(true); window.scrollTo({ top: 0, behavior: 'smooth' });}} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-blue-600">
                Annuler
            </button>
          </div>
      </>) :
      (

        <>
          <div id='etiquette' className=" flex flex-col justify-center items-center  h-full bg-white">
            <div  className="flex w-[120mm] h-[70mm] border-2 border-teal-700 p-5  bg-white rounded-lg shadow-lg justify-between items-center">
              {/* Left Section */}
              <div className="flex flex-col w-8/12 leading-4 justify-between  text-xs">
                <div className="w-12 h-12  bg-teal-700 text-white flex items-center justify-center rounded-full mb-3">
                <FontAwesomeIcon icon={faTools} />
                </div>
                <div className="font-bold text-lg text-teal-700 mb-2">Appareil en Réparation</div>
                <div className="mb-1 text-gray-600">
                  <span className="font-bold text-teal-700">Numéro de Série:</span> {numeroSerie}
                </div>
                <div className="mb-1 text-gray-600">
                  <span className="font-bold text-teal-700">Date de Dépôt:</span> {dateOnly}
                </div>
                <div className="mb-1 text-gray-600">
                  <span className="font-bold text-teal-700">Symptôme de Panne:</span> {symptomesPanne}
                </div>
                <div className="mb-1 text-gray-600">
                  <span className="font-bold text-teal-700">Propriétaire:</span> {member.nom}
                </div>
                <div className="text-gray-600">
                  <span className="font-bold text-teal-700">Date de Remise Prévue:</span> {datePrevueRemise}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="w-[45mm] h-[45mm] ml-1 flex justify-center items-center">
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-auto border border-gray-300 rounded-lg" />
              </div>
            </div>
          </div>
            <div className='flex gap-8 mt-10 items-center justify-center'>
              <button onClick={handleDownloadEtiquette}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
                  Imprimer
              </button>
              <button  onClick={()=>{setShowClientTable(true); window.location.reload();}} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-blue-600">
                  Retourne
              </button>
            </div>
        </>
        
      )}
       <ToastContainer />
    </>
  );
};

export default FicheReparation;
