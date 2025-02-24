/* eslint-disable react/prop-types */
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useState,useEffect } from 'react';
import {request} from '../../Service/axios_helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contextHook/AuthContext';
import Cookies from 'js-cookie'; 

const ModifFicheReparationRsc = ({demande}) => {

  const navigate = useNavigate();
  const location = useLocation();
  const isViewMode = location.search.includes('mode=voirFiche');
  const {user} = useAuth();
  const termine = demande.etat === "Terminé" || demande.etat === "Irréparable" ;
  const [piecesUtilises, setPiecesUtilises] = useState([]);
  const [reparation, setReparation] = useState({});

  useEffect(() => {
    if (termine && demande?.id) {
      fetchReparation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [termine, demande?.id]);
  
  const fetchReparation = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await request("get", `/rsc/getReparationByDemandeReparationId?id=${demande.id}`, null, headers);
      const response2 = await request("get", `/rsc/getPiecesByReparationId?id=${response.data.id}`, null, headers);
      setReparation(response.data);
      setPiecesUtilises(response2.data);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la récupération de réparation.");
    }
  };

  const handleSaveAndDownloadPDF = () => {
    const element = document.querySelector(".container");
    html2canvas(element, { scale: 1.5 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); 
      pdf.save("fiche_de_reparation.pdf");
    });
  };

  const [modifiedData, setModifiedData] = useState({
    id : demande.id,
    dateDepot : demande.dateDepot,
    etat : demande.etat,
    client: demande.client,
    appareil: demande.appareil,
    datePrevueRemise: demande.datePrevueRemise || "",
    symptomesPanne: demande.symptomesPanne || "",
    creePar :{id :demande.creePar.id },
    modifiePar :{id : user.idUser }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifiedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeAppareil = (e) => {
    const { name, value } = e.target;
    setModifiedData((prevData) => ({
      ...prevData,
      appareil: {
        ...prevData.appareil,
        [name]: value,
      },
    }));
  };

  const handleRetourner =()=>{
    navigate('/dashboard')
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleEdit = async () => {
    try {
      const token = sessionStorage.getItem('token') || Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };
      await request("put", "/rsc/updateDemandeReparation", modifiedData,headers);
      toast.success("Demande modifiée avec succès!", { autoClose: 1300 });
      setTimeout(()=>{
        navigate('/dashboard');
      },1300)
    } catch (error) {
      toast.error("Erreur lors de la modification de la demande.");
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <div className="container -mt-8 scale-90  mx-auto p-4 bg-gray-200 border border-black w-[250mm]">
        
        <h2 className="text-center text-2xl font-semibold bg-blue-600 text-black p-1 mt-3 mb-12">Fiche de Réparation</h2>

        <div className="flex justify-between mb-4">
          <div className="w-[48%]">
            <p>Numéro de Fiche: {demande.id} </p>
          </div>
          <div className="w-[48%]">
            <p>Date de Création: {demande.dateDepot}</p>
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
                  <td className="border-none p-2">
                    <input
                      type="text"
                      readOnly={true}
                      disabled
                      value={modifiedData.client.nom || ""}
                      className="text-lg w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-none text-lg p-2">Adresse:</td>
                  <td className="border-none p-2">
                    <input
                      type="text"
                      readOnly={true}
                      disabled
                      value={modifiedData.client.adresse || ""}
                      className="text-lg w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-none text-lg p-2">Tél. Portable:</td>
                  <td className="border-none p-2">
                    <input
                      type="text"
                      readOnly={true}
                      disabled
                      value={modifiedData.client.telephone || ""}
                      className="text-lg w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-none text-lg p-2">Email:</td>
                  <td className="border-none p-2">
                    <input
                      type="text"
                      readOnly={true}
                      disabled
                      value={modifiedData.client.email || ""}
                      className="text-lg w-full"
                    />
                  </td>
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
                    <td className="border-none p-2">
                      <input
                        type="text"
                        value={modifiedData.appareil.modele || ""}
                        onChange={handleChangeAppareil}
                        name="modele"
                        readOnly={isViewMode}
                        className="border-gray-900 text-lg w-full"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-none text-lg p-2">Marque :</td>
                    <td className="border-none p-2">
                      <input
                        type="text"
                        value={modifiedData.appareil.marque || ""}
                        onChange={handleChangeAppareil}
                        name="marque"
                        readOnly={isViewMode}
                        className="border-gray-900 text-lg w-full"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-none text-lg p-2">N° Serie :</td>
                    <td className="border-none p-2">
                      <input
                        type="text"
                        value={modifiedData.appareil.numeroSerie || ""}
                        onChange={handleChangeAppareil}
                        name="numeroSerie"
                        readOnly={isViewMode}
                        className="border-gray-900 text-lg w-full"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-none text-lg p-2">Désignation :</td>
                    <td className="border-none p-2">
                      <input
                        type="text"
                        value={modifiedData.appareil.designation || ""}
                        onChange={handleChangeAppareil}
                        name="designation"
                        readOnly={isViewMode}
                        className="border-gray-900 text-lg w-full"
                      />
                    </td>
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
                <input type="checkbox" checked={{isViewMode} } disabled={isViewMode} className="mr-2" /> À facturer
              </label>
              <label className="flex items-center">
                <input type="checkbox" disabled={isViewMode} className="mr-2" /> Garantie
              </label>
              <label className="flex items-center">
                <input type="checkbox" disabled={isViewMode} className="mr-2" /> Sous-contrat
              </label>
              <label className="flex items-center">
                <input type="checkbox" disabled={isViewMode} className="mr-2" /> Gratuit
              </label>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan="2" className="border border-gray-900 p-2">
            Date prévue de remise : <input type="date" 
            value={modifiedData.datePrevueRemise || ""}
            onChange={handleChange}
            name="datePrevueRemise"
            readOnly={isViewMode}
               className="w-36 text-lg border-b border-gray-600 px-2 py-1" /> , sinon téléphoner.
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
                    <textarea 
                      value={modifiedData.symptomesPanne || ""}
                      onChange={handleChange}
                      name="symptomesPanne"
                      readOnly={isViewMode}
                    className="w-full h-36 p-2 text-xl border border-gray-600"></textarea>
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
          <tbody>
            {
              termine &&(
                <tr>
                  <td className="border border-gray-800 p-1">
                      {reparation?.description}
                  </td>
                  <td className="border border-gray-800 p-1">
                      {reparation?.dureeMainOeuvre}
                  </td>
                  <td className="border border-gray-800 p-1">
                    { reparation?.technicien?.nom && reparation?.technicien?.prenom
                        ? `${reparation.technicien.nom} ${reparation.technicien.prenom}`
                        : "Non sélectionné"
                      }
                  </td>
                  <td className="border border-gray-800 p-1">
                      {reparation?.dureeMainOeuvre * 15 + "  TND"}
                  </td>
                </tr>
              )
            }
          </tbody>
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
          <tbody>
            {
              termine &&(
                piecesUtilises.map((piece, index) => (
                  <tr key={index}>
                    <td className="border flex border-gray-800 px-4 py-2 w-[100%]">{ piece?.nom }</td>
                    <td className="border border-gray-900 px-4 py-2">{ piece?.prixVenteTTC?.toFixed(2)} DT</td>
                    <td className="border border-gray-900 px-4 py-2 w-[12%]">{ piece?.reparationPieces[0]?.qte }</td>
                    <td className="border border-gray-900 px-4 py-2">{ (piece?.reparationPieces[0]?.qte * piece?.prixVenteTTC).toFixed(2) } DT</td>
                  </tr>
                ))
              )
            }
          </tbody>
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
      {
        !isViewMode ? (
          <div className="flex relative gap-8 -top-10 -ml-2 mb-4 items-center justify-center">
            <button onClick={handleEdit}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            Enregistrer
          </button>
          <button  onClick={handleRetourner} className="bg-gray-800 text-white px-6 py-2 rounded shadow hover:bg-blue-600">
              Annuler
          </button>
        </div>
        ) :(
        <div className="flex gap-8 mt-10 items-center justify-center ">
           <button onClick={handleSaveAndDownloadPDF}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
             Imprimer
           </button>
          <button onClick={handleRetourner}  className="bg-gray-800 text-white px-4 py-2 rounded shadow hover:bg-blue-600">
            Retourner
          </button>
        </div>
        )
      }
      <ToastContainer></ToastContainer>
    </>
  );
};

export default ModifFicheReparationRsc;
